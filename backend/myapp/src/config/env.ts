import "dotenv/config";

function required(name: string, fallback = ""): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}. Copy .env.example to .env.`);
  return v;
}

export const env = {
  port: Number(process.env["PORT"] ?? 4000),
  frontendUrl: process.env["FRONTEND_URL"] ?? "http://localhost:3000",
  supabaseUrl: required("SUPABASE_URL"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),
  supabaseServiceKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  midtransServerKey: required("MIDTRANS_SERVER_KEY"),
  midtransClientKey: process.env["MIDTRANS_CLIENT_KEY"] ?? "",
  midtransIsProduction: (process.env["MIDTRANS_IS_PRODUCTION"] ?? "false") === "true",
  midtransSnapBase:
    process.env["MIDTRANS_SNAP_BASE"] ?? "https://app.sandbox.midtrans.com/snap/v1",
  midtransApiBase:
    process.env["MIDTRANS_API_BASE"] ?? "https://api.sandbox.midtrans.com/v2",
  splitUp: Number(process.env["SPLIT_UP_PCT"] ?? 30),
  splitJurusan: Number(process.env["SPLIT_JURUSAN_PCT"] ?? 30),
  splitSiswa: Number(process.env["SPLIT_SISWA_PCT"] ?? 40),
};
