import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Client service_role — HANYA dipakai di backend, bypass RLS secara terkontrol.
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false },
});
