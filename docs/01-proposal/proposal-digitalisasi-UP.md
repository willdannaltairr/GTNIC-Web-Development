# Proposal Digitalisasi Production Unit (UP)
## SMK Taruna Bhakti Depok

**Versi:** 1.0 — 14 Okt 2026
**Branch:** `develop` | **Repo:** GTNIC-Web-Development

## 1. Executive Summary
Unit Produksi (UP) SMK Taruna Bhakti adalah wadah praktik kewirausahaan siswa dari 6 jurusan (DKV, TKJ, RPL, BC, Animasi, TE). Saat ini order masih manual (WA/catatan kertas), tidak ada katalog terpusat, tracking progres tidak transparan, pembayaran tidak tercatat sistematis.

Solusi: **Portal E-Commerce Multi-Vendor Terpusat** — 1 website, 6 mini-toko jurusan. Klien eksternal/internal browse katalog → isi brief/order dinamis per jurusan → bayar via Midtrans (QRIS/VA/E-Wallet) → tracking progres real-time → terima hasil digital/fisik. Siswa sebagai eksekutor, guru/Kaprog sebagai Admin Jurusan, Kepala UP sebagai Super Admin.

## 2. Latar Belakang & Tujuan
- SMK wajib punya UP sebagai teaching factory (Permendikbud). Digitalisasi = nilai akreditasi + pendapatan sekolah + portofolio siswa.
- Tujuan SMART (13 minggu, 1 semester):
  1. 100% katalog 6 jurusan online + checkout.
  2. Payment tercatat otomatis (rekonsiliasi < 5 menit/order).
  3. Klien bisa tracking tanpa tanya via WA.
  4. Bagi hasil UP : Jurusan : Siswa transparan di dashboard.

## 3. Scope of Work (In / Out)
**In:** Auth multi-role, katalog multi-tenant, checkout wizard dinamis/jurusan, Midtrans Snap + webhook, Kanban/timeline tracking + Realtime, dashboard finansial + bagi hasil, upload file (Supabase Storage), UAT + training.
**Out (fase 2):** Mobile app native, akuntansi pajak otomatis, integrasi SIP akademik, render-farm on-premise.

## 4. Metodologi: Agile Scrum, 13 minggu
- Sprint 0 (M1-2): FGD Kaprog + Figma wireframe.
- Sprint 1 (M3-4): Auth + multi-tenant + RLS.
- Sprint 2 (M5-6): Katalog + checkout + Midtrans sandbox.
- Sprint 3 (M7-8): Workspace tracking + Realtime.
- Sprint 4 (M9-10): Finansial + invoice PDF + hardening.
- M11: Blackbox + UAT. M12: Go-live VPS + SSL. M13: Training + handover.

## 5. RAB Ringkas (estimasi awal)
| Item | Estimasi |
|---|---|
| Domain .sch.id + SSL | Rp 300rb/th |
| VPS Indonesia 2vCPU/4GB | Rp 150rb/bln |
| Supabase Cloud (Pro, opsional — Free cukup MVP) | Rp 0–350rb/bln |
| Midtrans (fee per transaksi, bukan lisensi) | 0,7–2,9%/trx |
| Insentif tim siswa/guru | Kebijakan UP |
| Total infra MVP/tahun | < Rp 3 jt |

## 6. Risiko & Mitigasi
| Risiko | Mitigasi |
|---|---|
| Brief beda-beda/jurusan | Form metadata dinamis (JSONB), bukan tabel kaku |
| File besar (video/animasi) | Supabase Storage + chunk upload, bukan di VPS |
| Scope-creep RPL | Requirement questionnaire + kunci revisi maks di kontrak order |
| Alat BC rusak/telat | Kalender real-time + denda otomatis + checklist inventory |
| Siswa lulus/rotasi | Task assign ulang oleh Admin Jurusan, histori tetap di DB |

## 7. Kriteria Sukses (Acceptance)
UAT minimal 2 order/jurusan end-to-end (browse → bayar sandbox → tracking → selesai → download) + dashboard finansial cocok dengan mutasi Midtrans.
