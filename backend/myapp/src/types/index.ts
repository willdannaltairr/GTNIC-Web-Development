// Tipe strict untuk seluruh domain UP. Satu sumber kebenaran untuk FE/BE.

export const JURUSAN_KODE = ["DKV", "TKJ", "RPL", "BC", "ANIMASI", "TE"] as const;
export type JurusanKode = (typeof JURUSAN_KODE)[number];

export const ROLES = ["super_admin", "admin_jurusan", "siswa", "klien"] as const;
export type Role = (typeof ROLES)[number];

export const PAYMENT_STATUS = [
  "pending_payment",
  "settlement",
  "expire",
  "cancel",
  "deny",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PROJECT_STATUS = [
  "brief",
  "in_progress",
  "review",
  "revision",
  "completed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUS)[number];

export interface Jurusan {
  id: string;
  kode: JurusanKode;
  nama: string;
  deskripsi: string;
  aktif: boolean;
}

export interface CatalogItem {
  id: string;
  jurusan_id: string;
  nama: string;
  tipe: "product" | "service";
  harga: number;
  satuan: string;
  deskripsi: string;
  metadata: Record<string, unknown>;
  aktif: boolean;
}

export interface OrderRow {
  id: string;
  invoice_no: string;
  client_id: string;
  jurusan_id: string;
  layanan_id: string | null;
  total: number;
  snap_token: string | null;
  snap_redirect_url: string | null;
  payment_status: PaymentStatus;
  project_status: ProjectStatus;
  brief: Record<string, unknown>;
  created_at: string;
}

export interface TrackingRow {
  id: string;
  order_id: string;
  assigned_student: string | null;
  tahapan: ProjectStatus;
  pipeline_label: string | null;
  notes: string;
  file_url: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  jurusan_id: string | null;
  name: string;
}

// Payload Midtrans Snap
export interface SnapRequest {
  transaction_details: { order_id: string; gross_amount: number };
  customer_details?: { first_name?: string; email?: string };
  item_details?: Array<{ id: string; price: number; quantity: number; name: string }>;
  callbacks?: { finish?: string };
}

export interface SnapResponse {
  token: string;
  redirect_url: string;
}

// Payload webhook Midtrans (disederhanakan dari dokumentasi resmi)
export interface MidtransWebhook {
  order_id: string;
  transaction_status: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  payment_type?: string;
  fraud_status?: string;
}
