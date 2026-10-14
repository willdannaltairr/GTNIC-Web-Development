import type { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { asyncHandler, ok, fail } from "../utils/asyncHandler.js";
import { mapMidtransStatus, verifyWebhookSignature } from "../services/midtrans.service.js";
import { calcSplit } from "../utils/pricing.js";
import type { MidtransWebhook } from "../types/index.js";

export const midtransWebhook = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as MidtransWebhook;
  if (!body?.order_id || !body?.signature_key) return fail(res, "Payload tidak valid.", 400);
  if (!verifyWebhookSignature(body)) return fail(res, "Signature tidak valid.", 403);

  const mapped = mapMidtransStatus(body.transaction_status, body.fraud_status);
  // Midtrans mengirim capture/challenge dsb — yang membuka workflow hanya settlement
  const paymentStatus =
    mapped === "settlement" ? "settlement"
    : mapped === "pending_payment" ? "pending_payment"
    : ["expire", "cancel", "deny"].includes(mapped) ? mapped : "pending_payment";

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,total,project_status")
    .eq("id", body.order_id)
    .maybeSingle();
  if (!order) {
    // Tetap 200 agar Midtrans tidak retry selamanya untuk order tak dikenal
    return ok(res, { ignored: true });
  }

  const patch: Record<string, unknown> = { payment_status: paymentStatus };
  if (paymentStatus === "settlement" && (order as { project_status: string }).project_status === "brief") {
    patch["project_status"] = "in_progress";
  }
  await supabaseAdmin.from("orders").update(patch).eq("id", body.order_id);

  if (paymentStatus === "settlement") {
    const total = Number((order as { total: number }).total);
    const s = calcSplit(total);
    await supabaseAdmin.from("revenue_splits").update({
      amount_up: s.amountUp,
      amount_jurusan: s.amountJurusan,
      amount_siswa: s.amountSiswa,
    }).eq("order_id", body.order_id);
    await supabaseAdmin.from("project_tracking").insert({
      order_id: body.order_id,
      tahapan: "in_progress",
      pipeline_label: "payment_settlement",
      notes: `Pembayaran lunas via ${body.payment_type ?? "midtrans"}. Workflow dibuka.`,
    });
  }
  ok(res, { order_id: body.order_id, payment_status: paymentStatus });
});

export const financeSummary = asyncHandler(async (req: Request, res: Response) => {
  const jurusanId = req.query["jurusan_id"] as string | undefined;
  let q = supabaseAdmin.from("orders").select("total,jurusan_id,payment_status").eq("payment_status", "settlement");
  if (jurusanId) q = q.eq("jurusan_id", jurusanId);
  // Admin jurusan otomatis difilter ke jurusannya
  if (req.user?.role === "admin_jurusan" && req.user.jurusan_id) q = q.eq("jurusan_id", req.user.jurusan_id);
  const { data, error } = await q;
  if (error) return fail(res, error.message, 500);
  const rows = (data ?? []) as Array<{ total: number; jurusan_id: string }>;
  const gross = rows.reduce((s, r) => s + Number(r.total), 0);
  const byJurusan: Record<string, number> = {};
  for (const r of rows) byJurusan[r.jurusan_id] = (byJurusan[r.jurusan_id] ?? 0) + Number(r.total);
  const s = calcSplit(gross);
  ok(res, { gross, settled_count: rows.length, by_jurusan: byJurusan, split_estimate: s });
});
