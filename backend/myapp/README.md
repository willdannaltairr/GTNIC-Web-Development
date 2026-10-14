# Backend UP — Express API (`backend/myapp`)

## Jalankan lokal
```bash
cd backend/myapp
cp .env.example .env   # isi Supabase + Midtrans sandbox
npm install
npm run dev            # http://localhost:4000/api/health
npm run typecheck      # verifikasi TS
```

## Endpoint
| Method | Path | Auth |
|---|---|---|
| GET | `/api/health`, `/api/jurusan`, `/api/catalog` | publik |
| POST | `/api/payments/webhook` | signature Midtrans |
| POST | `/api/orders/checkout` | klien login |
| GET | `/api/orders/mine`, `/api/orders/:id` | login |
| POST | `/api/orders/:orderId/tracking` | login (settlement dulu) |
| CRUD | `/api/catalog` | admin_jurusan/super_admin |
| POST | `/api/orders/:orderId/assign` | admin jurusan |
| GET | `/api/finance/summary`, `/api/users` | admin jurusan/super |

Frontend mengambil JWT via Supabase Auth dan mengirimnya sebagai `Authorization: Bearer`.
