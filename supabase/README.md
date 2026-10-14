# Supabase Setup — UP Taruna Bhakti

## 1. Urutan eksekusi
1. Buat project di supabase.com → copy `Project URL` + `anon key` + `service_role key`.
2. SQL Editor → jalankan `schema.sql`, lalu `rls.sql`, lalu `seed.sql`.
3. Storage → buat 3 private bucket (atau via SQL di bawah):
   - `up-catalog` (public, gambar katalog)
   - `up-drafts` (private, draft siswa → guru/klien review)
   - `up-final` (private, hasil akhir, hanya klien lunas)
4. Authentication → aktifkan Email provider. Magic link opsional fase 2.
5. Isi `.env` backend & frontend (lihat `.env.example` masing-masing).

## 2. Buckets via SQL (opsional)
```sql
insert into storage.buckets (id, name, public) values
  ('up-catalog','up-catalog', true),
  ('up-drafts','up-drafts', false),
  ('up-final','up-final', false)
on conflict (id) do nothing;
```

## 3. Storage policies (contoh minimal)
- `up-catalog`: SELECT untuk semua (public read), INSERT hanya `admin_jurusan`/`super_admin` (atur via policy `storage.objects` dengan `bucket_id = 'up-catalog'`).
- `up-drafts`/`up-final`: SELECT hanya pemilik order / assignee / admin — paling aman diakses via signed URL yang dibuat backend (service_role), bukan policy publik.

## 4. Realtime
Aktifkan Realtime untuk tabel `orders` + `project_tracking` (Dashboard → Database → Replication → centang keduanya). Frontend subscribe channel `order:{orderId}`.
