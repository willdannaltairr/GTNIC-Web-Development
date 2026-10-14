import type { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error("[UP-API]", err);
  const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
  res.status(500).json({ success: false, error: message });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: "Endpoint tidak ditemukan." });
}
