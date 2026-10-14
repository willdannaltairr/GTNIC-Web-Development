# SRS — Production Unit Digitalization Platform
## SMK Taruna Bhakti Depok — v1.0

## 1. Introduction
### 1.1 Purpose
Menetapkan kebutuhan fungsional & non-fungsional portal UP multi-vendor 6 jurusan.
### 1.2 Scope
Sistem: `frontend/my-app` (Next.js) + `backend/myapp` (Express) + Supabase (Postgres/Auth/Realtime/Storage) + Midtrans. Multi-tenant single-database via `jurusan_id`.
### 1.3 Definitions
UP=Unit Produksi, Kaprog=Ketua Program Keahlian, RLS=Row Level Security, Snap=Midtrans payment UI.

## 2. Overall Description
### 2.1 Product Perspective
Monorepo GTNIC. Frontend SSR katalog (SEO). Backend REST validasi + Midtrans + Supabase service-role. Supabase sebagai source of truth.
### 2.2 User Classes
| Role | Hak |
|---|---|
| Super Admin (Kepala UP) | Semua data, finansial global, kelola user/role |
| Admin Jurusan (Kaprog/Guru) | CRUD katalog jurusannya, validasi order, assign siswa, validasi hasil |
| Siswa (Operator) | Lihat task assigned, update Kanban, upload draft |
| Klien | Browse, order, bayar, tracking miliknya, download hasil akhir |
### 2.3 Operating Environment
Browser modern, mobile-first. VPS Indonesia + Docker. Node 18+.
### 2.4 Constraints
Kurikulum RPL selaras (JS/TS), biaya minim (pakai tier gratis dulu), latency pembayaran lokal cepat.

## 3. System Features (per Modul)
### F-01 Auth & RBAC
Login email/password (+ magic link fase 2). JWT Supabase → middleware Express verifikasi. RLS: klien hanya `orders.client_id=auth.uid()`, siswa hanya task assigned, admin jurusan hanya `jurusan_id` miliknya.
### F-02 Katalog Multi-Tenant
CRUD `products_services` per `jurusan_id`. Field `metadata JSONB` untuk parameter spesifik (durasi sewa BC, spek PCB TE). Filter pill per jurusan + infinite scroll.
### F-03 Checkout Wizard Dinamis
Multi-step animasi. Step 1 pilih layanan, Step 2 form spesifik jurusan (lihat §4), Step 3 review + hitung harga, Step 4 bayar (Snap redirect). Validasi Zod/Joi di backend.
### F-04 Payment (Midtrans)
`POST /api/orders/checkout` → hitung total → Snap create → simpan order `pending_payment` + `snap_token`. Webhook `/api/payments/webhook` handle `settlement/expire/cancel/deny` + verifikasi signature SHA512. Saat settlement → broadcast Realtime + unlock pipeline.
### F-05 Project Tracking
`project_tracking` (order_id, assigned_student, tahapan, notes, file_url). Tahapan global: Brief → In-Progress → Review → Revision → Completed. Khusus Animasi: Concept→Sketch→Color→Render→Post-Pro (dipetakan ke tahapan global + label). Update via Supabase Realtime channel `order:{id}`.
### F-06 Finansial & Bagi Hasil
Aturan default (dapat dikonfigurasi): 30% UP sekolah, 30% kas jurusan, 40% insentif siswa/pembimbing. Dashboard global (Super Admin) + per jurusan. Export invoice PDF (fase 2: `@react-pdf/renderer`).

## 4. Form Spesifik per Jurusan
- **DKV:** brief warna/gaya, upload guideline, referensi; preview watermark sebelum pelunasan.
- **TKJ:** kalender booking, kuesioner kerusakan, serial-number timeline.
- **RPL:** requirement multi-step, staging URL + sprint progress bar, batas revisi.
- **BC:** kalender real-time, pricing per jam/hari, checklist inventaris, checkbox ToS + denda telat.
- **Animasi:** pipeline tracker, chunk upload file besar.
- **TE:** kalkulator estimasi komponen, upload Gerber/skematik (validasi ekstensi).

## 5. External Interfaces
UI: Next.js + Tailwind, glassmorphism navy `#0F172A/#1E3A8A/#2563EB`, Inter/Plus Jakarta Sans. HW: VPS 2vCPU/4GB cukup MVP. SW: Supabase, Midtrans Snap. Komunikasi: HTTPS REST + Supabase Realtime WebSocket.

## 6. Non-Functional
- Performance: LCP < 2.5s katalog (Image optimization + lazy sub-form), indeks FK.
- Security: RLS on, service-role hanya di backend, webhook signature check, validasi file (tipe + size), SSL.
- Quality: Clean architecture (routes→controllers→services), TS strict di backend, toast error ramah, skeleton bukan spinner.
