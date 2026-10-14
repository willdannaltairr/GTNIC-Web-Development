import type { Request, Response } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../config/supabase.js";
import { asyncHandler, ok, fail } from "../utils/asyncHandler.js";

const catalogSchema = z.object({
  jurusan_id: z.string().uuid(),
  nama: z.string().min(3),
  tipe: z.enum(["product", "service"]).default("service"),
  harga: z.number().nonnegative(),
  satuan: z.string().default("paket"),
  deskripsi: z.string().default(""),
  metadata: z.record(z.string(), z.unknown()).default({}),
  aktif: z.boolean().default(true),
});

export const listCatalog = asyncHandler(async (req: Request, res: Response) => {
  const jurusan = (req.query["jurusan"] as string | undefined)?.toUpperCase();
  const q = (req.query["q"] as string | undefined) ?? "";
  let query = supabaseAdmin
    .from("products_services")
    .select("*, jurusan!inner(id,kode,nama)")
    .eq("aktif", true)
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("nama", `%${q}%`);
  const { data, error } = await query;
  if (error) return fail(res, error.message, 500);
  let rows = data ?? [];
  if (jurusan) rows = rows.filter((r: { jurusan: { kode: string } }) => r.jurusan.kode === jurusan);
  ok(res, rows);
});

export const getCatalogById = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from("products_services")
    .select("*, jurusan!inner(id,kode,nama)")
    .eq("id", req.params["id"])
    .maybeSingle();
  if (error) return fail(res, error.message, 500);
  if (!data) return fail(res, "Layanan tidak ditemukan.", 404);
  ok(res, data);
});

export const createCatalog = asyncHandler(async (req: Request, res: Response) => {
  const parsed = catalogSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Data katalog tidak valid.", 400, parsed.error.flatten());
  // Admin jurusan hanya boleh buat di jurusannya sendiri
  if (req.user?.role === "admin_jurusan" && req.user.jurusan_id !== parsed.data.jurusan_id) {
    return fail(res, "Anda hanya boleh menambah katalog jurusan sendiri.", 403);
  }
  const { data, error } = await supabaseAdmin
    .from("products_services")
    .insert(parsed.data)
    .select()
    .single();
  if (error) return fail(res, error.message, 500);
  ok(res, data, 201);
});

export const updateCatalog = asyncHandler(async (req: Request, res: Response) => {
  const parsed = catalogSchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, "Data tidak valid.", 400, parsed.error.flatten());
  const { data: existing } = await supabaseAdmin
    .from("products_services")
    .select("jurusan_id")
    .eq("id", req.params["id"])
    .maybeSingle();
  if (!existing) return fail(res, "Layanan tidak ditemukan.", 404);
  if (
    req.user?.role === "admin_jurusan" &&
    req.user.jurusan_id !== (existing as { jurusan_id: string }).jurusan_id
  ) {
    return fail(res, "Anda hanya boleh mengubah katalog jurusan sendiri.", 403);
  }
  const { data, error } = await supabaseAdmin
    .from("products_services")
    .update(parsed.data)
    .eq("id", req.params["id"])
    .select()
    .single();
  if (error) return fail(res, error.message, 500);
  ok(res, data);
});

export const deleteCatalog = asyncHandler(async (req: Request, res: Response) => {
  // Soft delete agar histori order tidak rusak
  const { data, error } = await supabaseAdmin
    .from("products_services")
    .update({ aktif: false })
    .eq("id", req.params["id"])
    .select()
    .single();
  if (error) return fail(res, error.message, 500);
  ok(res, data);
});
