# ERD & Skema Logis (ringkas)
## UP SMK Taruna Bhakti — Supabase Postgres

```
users (id UUID PK = auth.users.id, name, email unique, role, jurusan_id FK nullable)
  |
  |-- jurusan (id UUID PK, kode unique: DKV/TKJ/RPL/BC/ANIMASI/TE, nama, deskripsi, aktif)
  |
  |-- products_services (id, jurusan_id FK, nama, tipe: product/service, harga, deskripsi, metadata JSONB, aktif)
  |
  |-- orders (id, client_id FK users, jurusan_id FK, layanan_id FK nullable, total, snap_token, payment_status, project_status, brief JSONB, invoice_no unique)
  |     |
  |     +-- project_tracking (id, order_id FK, assigned_student FK users nullable, tahapan, notes, file_url, created_by, created_at)
  |     |
  |     +-- revenue_splits (id, order_id FK unique, pct_up, pct_jurusan, pct_siswa, amount_up, amount_jurusan, amount_siswa)
```

## Aturan penting
- `users.role`: super_admin | admin_jurusan | siswa | klien.
- `orders.brief JSONB`: isi form dinamis/jurusan (warna DKV, jadwal TKJ, staging RPL, durasi BC, dst) — divalidasi backend, bukan kolom kaku.
- `orders.payment_status`: pending_payment | settlement | expire | cancel | deny.
- `orders.project_status`: brief | in_progress | review | revision | completed.
- Semua FK berindeks. RLS aktif di semua tabel bisnis. Detail SQL: `supabase/schema.sql` + `supabase/rls.sql`. Seed awal: `supabase/seed.sql`.
