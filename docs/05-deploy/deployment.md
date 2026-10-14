# Deployment & Go-Live — UP Taruna Bhakti

## 1. Prasyarat
- VPS Indonesia (2vCPU/4GB), Ubuntu 22.04, Docker + Compose.
- Domain (contoh: `up.tarunabhakti.sch.id`) + DNS A ke VPS.
- Akun Supabase (jalankan `supabase/schema.sql` → `rls.sql` → `seed.sql`, aktifkan Realtime untuk `orders` + `project_tracking`).
- Akun Midtrans sandbox → ambil Server Key + Client Key. Set webhook URL: `https://api-domain-anda/api/payments/webhook`.

## 2. Env production
- Backend: copy `backend/myapp/.env.example` → `.env`, isi Supabase service_role + Midtrans **production** key saat go-live (`MIDTRANS_IS_PRODUCTION=true`, base URL production).
- Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL=https://api-domain-anda/api`.

## 3. Docker (contoh minimal)
```yaml
services:
  api:
    build: ./backend/myapp
    env_file: ./backend/myapp/.env
    ports: ["4000:4000"]
    restart: unless-stopped
  web:
    build: ./frontend/my-app
    environment:
      - NEXT_PUBLIC_API_URL=https://api-domain-anda/api
    ports: ["3000:3000"]
    restart: unless-stopped
```
Butuh `Dockerfile` tiap service (fase Sprint 4/Go-Live) + reverse proxy (Caddy/Nginx) untuk SSL otomatis.

## 4. Checklist go-live
1. `npm run build` frontend hijau, `npx tsc --noEmit` backend hijau.
2. Webhook Midtrans test via sandbox simulator (settlement → order jadi `in_progress` + baris `project_tracking` muncul).
3. UAT: 2 order/jurusan end-to-end.
4. Backup: aktifkan daily backup Supabase + snapshot VPS.
5. Training: SOP Admin Jurusan (validasi → assign → review) + siswa (update Kanban + upload draft).
