import type { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { asyncHandler, ok, fail } from "../utils/asyncHandler.js";

export const me = asyncHandler(async (req: Request, res: Response) => {
  ok(res, req.user ?? null);
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const role = req.query["role"] as string | undefined;
  const jurusanId = (req.query["jurusan_id"] as string | undefined) ?? req.user?.jurusan_id ?? undefined;
  let q = supabaseAdmin.from("users").select("id,name,email,role,jurusan_id,created_at").order("created_at", { ascending: false }).limit(100);
  if (role) q = q.eq("role", role);
  if (req.user?.role === "admin_jurusan" && req.user.jurusan_id) q = q.eq("jurusan_id", req.user.jurusan_id);
  else if (jurusanId) q = q.eq("jurusan_id", jurusanId);
  const { data, error } = await q;
  if (error) return fail(res, error.message, 500);
  ok(res, data ?? []);
});

export const listJurusan = asyncHandler(async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from("jurusan").select("*").eq("aktif", true).order("kode");
  if (error) return fail(res, error.message, 500);
  ok(res, data ?? []);
});
