import type { Request, Response } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../config/supabase.js";
import { env } from "../config/env.js";
import { asyncHandler, ok, fail } from "../utils/asyncHandler.js";
import { calcSplit, makeInvoiceNo } from "../utils/pricing.js";
import { createSnapTransaction } from "../services/midtrans.service.js";

const checkoutSchema = z.object({
  layanan_id: z.string().uuid(),
  brief: z.record(z.string(), z.unknown()).default({}),
  // Untuk layanan BC/TE yang qty-nya dinamis (hari/lot)
  qty: z.number().int().positive().default(1),
});

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return fail(res, "Belum login.", 401);
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Data checkout tidak valid.", 400, parsed.error.flatten());

  const { data: layanan, error: e1 } = await supabaseAdmin
    .from("products_services")
    .select("*, jurusan(id,kode,nama)")
    .eq("id", parsed.data.layanan_id)
    .eq("aktif", true)
    .maybeSingle();
  if (e1 || !layanan) return fail(res, "Layanan tidak tersedia.", 404);
  const item = layanan as {
    id: string;
    nama: string;
    harga: number;
    jurusan_id: string;
    jurusan: { kode: string };
  };

  const total = Math.round(Number(item.harga) * parsed.data.qty);
  const invoiceNo = makeInvoiceNo(item.jurusan.kode);

  // 1) Buat order pending dulu (order_id internal dipakai sebagai Midtrans order_id)
  const orderId = crypto.randomUUID();
  const { error: e2 } = await supabaseAdmin.from("orders").insert({
    id: orderId,
    invoice_no: invoiceNo,
    client_id: req.user.id,
    jurusan_id: item.jurusan_id,
    layanan_id: item.id,
    total,
    payment_status: "pending_payment",
    project_status: "brief",
    brief: { ...((parsed.data.brief ?? {}) as object), qty: parsed.data.qty },
  });
  if (e2) return fail(res, `Gagal membuat order: ${e2.message}`, 500);

  // 2) Minta token ke Midtrans Snap
  try {
    const snap = await createSnapTransaction({
      transaction_details: { order_id: orderId, gross_amount: total },
      customer_details: { first_name: req.user.name, email: req.user.email },
      item_details: [{ id: item.id, price: Math.round(Number(item.harga)), quantity: parsed.data.qty, name: item.nama.slice(0, 50) }],
      callbacks: { finish: `${env.frontendUrl}/order/${orderId}` },
    });
    await supabaseAdmin
      .from("orders")
      .update({ snap_token: snap.token, snap_redirect_url: snap.redirect_url })
      .eq("id", orderId);
    // 3) Siapkan baris bagi hasil (diisi nominal saat settlement)
    const split = calcSplit(total);
    await supabaseAdmin.from("revenue_splits").insert({
      order_id: orderId,
      pct_up: split.pctUp,
      pct_jurusan: split.pctJurusan,
      pct_siswa: split.pctSiswa,
      amount_up: 0,
      amount_jurusan: 0,
      amount_siswa: 0,
    });
    ok(res, { order_id: orderId, invoice_no: invoiceNo, total, snap_token: snap.token, redirect_url: snap.redirect_url }, 201);
  } catch (err) {
    await supabaseAdmin.from("orders").delete().eq("id", orderId);
    return fail(res, err instanceof Error ? err.message : "Gagal memproses pembayaran.", 502);
  }
});

export const myOrders = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return fail(res, "Belum login.", 401);
  let query = supabaseAdmin
    .from("orders")
    .select("*, jurusan(id,kode,nama), products_services(id,nama,harga)")
    .order("created_at", { ascending: false });
  if (req.user.role === "klien") query = query.eq("client_id", req.user.id);
  if (req.user.role === "admin_jurusan" && req.user.jurusan_id) query = query.eq("jurusan_id", req.user.jurusan_id);
  const { data, error } = await query;
  if (error) return fail(res, error.message, 500);
  ok(res, data ?? []);
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, jurusan(id,kode,nama), products_services(id,nama,harga), project_tracking(*), revenue_splits(*)")
    .eq("id", req.params["id"])
    .maybeSingle();
  if (error) return fail(res, error.message, 500);
  if (!data) return fail(res, "Order tidak ditemukan.", 404);
  const o = data as { client_id: string; jurusan_id: string };
  const u = req.user;
  const allowed =
    u?.role === "super_admin" || o.client_id === u?.id ||
    (u?.role === "admin_jurusan" && u.jurusan_id === o.jurusan_id);
  if (!allowed) {
    // Siswa yang di-assign juga boleh lihat
    const { data: t } = await supabaseAdmin
      .from("project_tracking")
      .select("id")
      .eq("order_id", req.params["id"])
      .eq("assigned_student", u?.id ?? "")
      .limit(1);
    if (!t || t.length === 0) return fail(res, "Akses ditolak.", 403);
  }
  ok(res, data);
});
