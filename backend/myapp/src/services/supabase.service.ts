import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const admin = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false },
});

export const db = {
  from: (table: string) => admin.from(table),
  rpc: (fn: string, args?: Record<string, unknown>) => admin.rpc(fn, args),
};

export async function getCatalogWithJurusan() {
  return db
    .from("products_services")
    .select("*, jurusan!inner(id,kode,nama)")
    .eq("aktif", true)
    .order("created_at", { ascending: false });
}
