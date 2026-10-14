import crypto from "node:crypto";
import { midtransAuthHeader, midtransConfig } from "../config/midtrans.js";
import type { MidtransWebhook, SnapRequest, SnapResponse } from "../types/index.js";

export async function createSnapTransaction(payload: SnapRequest): Promise<SnapResponse> {
  const res = await fetch(`${midtransConfig.snapBase}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: midtransAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Midtrans Snap gagal (${res.status}): ${text}`);
  }
  return (await res.json()) as SnapResponse;
}

/** Verifikasi signature webhook sesuai dokumen Midtrans: SHA512(order_id+status_code+gross_amount+serverKey). */
export function verifyWebhookSignature(body: MidtransWebhook): boolean {
  const raw = `${body.order_id}${body.status_code}${body.gross_amount}${midtransConfig.serverKey}`;
  const expected = crypto.createHash("sha512").update(raw).digest("hex");
  return expected === body.signature_key;
}

export function mapMidtransStatus(tx: string, fraud?: string): string {
  if (tx === "capture") return fraud === "challenge" ? "review" : "settlement";
  if (tx === "settlement") return "settlement";
  if (tx === "pending") return "pending_payment";
  if (tx === "deny") return "deny";
  if (tx === "expire") return "expire";
  if (tx === "cancel") return "cancel";
  return tx;
}
