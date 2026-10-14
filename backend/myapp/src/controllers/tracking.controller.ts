import type { Request, Response } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../config/supabase.js";
import { asyncHandler, ok, fail } from "../utils/asyncHandler.js";

const trackingSchema = z.object({
  tahapan: z.enum(["brief", "in_progress", "review", "revision", "completed"]),
  pipeline_label: z.string().max(50).nullable().optional(),
  notes: z.string().max(2000).default(""),
  file_url: z.string().url().nullable().optional(),
  assigned_student: z.string().uuid().nullable().optional(),
});

export const listTracking = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from("project_tracking")
    .select("*")
    .eq("order_id", req.params["orderId"])
    .order("created_at", { ascending: true });
  if (error) return fail(res, error.message, 500);
  ok(res, data ?? []);
});

export const addTracking = asyncHandler(async (req: Request, res: Response) => {
  const parsed = trackingSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Data progres tidak valid.", 400, parsed.error.flatten());
  const orderId = req.params["orderId"];

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,jurusan_id,payment_status")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return fail(res, "Order tidak ditemukan.", 404);
  const o = order as { jurusan_id: string; payment_status: string };
  if (o.payment_status !== "settlement") {
    return fail(res, "Progres baru bisa diupdate setelah pembayaran lunas.", 402);
  }
  if (req.user?.role === "admin_jurusan" && req.user.jurusan_id !== o.jurusan_id) {
    return fail(res, "Bukan order jurusan Anda.", 403);
  }

  const { data, error } = await supabaseAdmin
    .from("project_tracking")
    .insert({
      order_id: orderId,
      assigned_student: parsed.data.assigned_student ?? req.user?.id ?? null,
      tahapan: parsed.data.tahapan,
      pipeline_label: parsed.data.pipeline_label ?? null,
      notes: parsed.data.notes,
      file_url: parsed.data.file_url ?? null,
      created_by: req.user?.id ?? null,
    })
    .select()
    .single();
  if (error) return fail(res, error.message, 500);

  // Sinkron status proyek order mengikuti tahapan terakhir
  await supabaseAdmin.from("orders").update({ project_status: parsed.data.tahapan }).eq("id", orderId);
  ok(res, data, 201);
});

export const assignStudent = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({ student_id: z.string().uuid(), notes: z.string().max(500).default("") });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Data assign tidak valid.", 400, parsed.error.flatten());

  const { data: student } = await supabaseAdmin
    .from("users")
    .select("id,role,jurusan_id")
    .eq("id", parsed.data.student_id)
    .maybeSingle();
  if (!student || (student as { role: string }).role !== "siswa") {
    return fail(res, "Student ID tidak valid.", 404);
  }
  const { data, error } = await supabaseAdmin
    .from("project_tracking")
    .insert({
      order_id: req.params["orderId"],
      assigned_student: parsed.data.student_id,
      tahapan: "in_progress",
      pipeline_label: "assigned",
      notes: parsed.data.notes || "Task di-assign ke siswa.",
      created_by: req.user?.id ?? null,
    })
    .select()
    .single();
  if (error) return fail(res, error.message, 500);
  await supabaseAdmin.from("orders").update({ project_status: "in_progress" }).eq("id", req.params["orderId"]);
  ok(res, data, 201);
});
