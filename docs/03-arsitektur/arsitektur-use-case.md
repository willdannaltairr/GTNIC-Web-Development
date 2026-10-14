# Use Case & Arsitektur Multi-Tenant
## UP SMK Taruna Bhakti

## 1. Aktor & Alur Naratif
### Klien
Browse katalog (filter jurusan) → Register/Login → Isi brief/order dinamis → Checkout → Bayar (Midtrans) → Tracking pipeline real-time → Request revisi (maks N) → Konfirmasi selesai → Download aset / terima fisik.
### Siswa
Login → Lihat task assigned → Update status (ToDo→InProgress→Review) → Upload draft → Tunggu validasi guru.
### Admin Jurusan
Validasi order masuk → Assign ke siswa/tim → Monitor kualitas/timeline → Validasi hasil → Teruskan ke klien → Kelola katalog/inventaris/keuangan jurusan.
### Super Admin
Monitor finansial global + performa/jurusan + log transaksi + kelola user/role + audit bagi hasil.

## 2. Use-Case List (ringkas)
| ID | UC | Aktor |
|---|---|---|
| UC-01 | Registrasi/Login | Semua |
| UC-02 | Kelola katalog | Admin Jurusan, Super Admin |
| UC-03 | Buat order + bayar | Klien |
| UC-04 | Webhook pembayaran | Sistem/Midtrans |
| UC-05 | Assign task | Admin Jurusan |
| UC-06 | Update progres | Siswa, Admin Jurusan |
| UC-07 | Review/revisi | Klien, Admin Jurusan |
| UC-08 | Download hasil | Klien (lunas/settlement) |
| UC-09 | Lihat finansial | Super Admin, Admin Jurusan |
| UC-10 | Kelola user/role | Super Admin |

## 3. Arsitektur
```
[Next.js frontend/my-app] --REST--> [Express backend/myapp] --service_role--> [Supabase Postgres]
        | Supabase Auth (JWT) + Realtime subscribe                  ^-- Storage buckets
        |-- Midtrans Snap redirect (bayar)                          ^-- RLS policies
[Midtrans] --webhook--> [backend /api/payments/webhook] --update--> [Supabase]
```
Multi-tenant: single DB, semua tabel bisnis punya `jurusan_id`. Isolasi via RLS + cek JWT di Express. `metadata JSONB` untuk fleksibilitas form/jurusan tanpa migrasi tiap ada layanan baru.

## 4. Keputusan Tech Stack (final, selaras repo ini)
| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind 4 (sudah di repo) + Framer Motion | SSR/SEO katalog, mobile responsif, animasi premium |
| Backend | Express 5 + TypeScript (sudah di repo) | Ringan, mudah diajarkan ke RPL, cukup untuk validasi + Midtrans + Supabase |
| DB/Auth/Realtime/Storage | Supabase (Postgres + RLS + Realtime + Storage) | Gratis MVP, RLS kuat, Realtime tanpa socket manual |
| Payment | Midtrans Snap + Core API webhook | Standar Indonesia (QRIS/VA/E-Wallet), sandbox mudah |
| Hosting | VPS Indonesia + Docker | Latensi lokal, reproducible via container |
| Storage file besar | Supabase Storage (bukan VPS) | Video/desain/animasi tidak bebani server utama |

> Alternatif yang dipertimbangkan: Laravel (bagus tapi butuh runtime PHP + kurva baru), NestJS (overkill MVP), PostgreSQL self-hosted (opsional saat scale), S3/R2 (naik ke sini saat file > kuota Supabase).
