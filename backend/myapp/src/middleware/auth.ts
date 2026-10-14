import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import type { AuthUser } from "../types/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/** Verifikasi JWT Supabase dari header Authorization, sinkron profil dari tabel users. */
export async function authRequired(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    res.status(401).json({ success: false, error: "Token tidak ditemukan. Silakan login." });
    return;
  }
  try {
    const client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ success: false, error: "Sesi tidak valid. Silakan login ulang." });
      return;
    }
    // Ambil profil role dari tabel users via service key (helper internal)
    const { createClient: mk } = await import("@supabase/supabase-js");
    const admin = mk(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false } });
    const { data: profile } = await admin
      .from("users")
      .select("id,name,email,role,jurusan_id")
      .eq("id", data.user.id)
      .maybeSingle();
    req.user = {
      id: data.user.id,
      email: profile?.email ?? data.user.email ?? "",
      role: (profile?.role ?? "klien") as AuthUser["role"],
      jurusan_id: (profile?.jurusan_id ?? null) as string | null,
      name: (profile?.name ?? data.user.email ?? "") as string,
    };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Gagal verifikasi sesi." });
  }
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Belum login." });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: "Akses ditolak untuk peran Anda." });
      return;
    }
    next();
  };
}
