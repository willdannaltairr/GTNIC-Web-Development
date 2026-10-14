# Roadmap Sprint (Agile, 13 minggu)
## UP SMK Taruna Bhakti

| Minggu | Sprint | Output | Owner |
|---|---|---|---|
| 1–2 | Sprint 0 Discovery | FGD 6 Kaprog, final brief/jurusan, Figma wireframe | PM + UI/UX |
| 3 | Desain Arsitektur | SRS final, ERD, API contract (`docs/`) | PM + Tech Lead |
| 4–5 | Sprint 1 Core | Auth + RBAC + RLS + multi-tenant | Backend |
| 5–6 | Sprint 2 Commerce | Katalog + checkout wizard + Midtrans sandbox | Full-stack |
| 7–8 | Sprint 3 Tracking | Kanban/timeline + Realtime + upload | Full-stack |
| 9–10 | Sprint 4 Finance | Bagi hasil + dashboard + invoice | Backend + FE |
| 11 | QA/UAT | Blackbox + UAT 2 order/jurusan | QA + Kaprog |
| 12 | Go-Live | VPS + Docker + SSL + domain sekolah | DevOps |
| 13 | Training | SOP Admin Jurusan + siswa + handover | PM |

Definisi Sprint di repo: `develop` ← `backend`/`frontend` ← `feature/*`. 1 branch = 1 tujuan. Commit Conventional Commits. Merge ke `main` hanya via `develop` setelah UAT.
