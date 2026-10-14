import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createClient(url, anon);

/** Ambil JWT sesi aktif untuk dikirim ke backend Express. */
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
