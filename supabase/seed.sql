-- ============================================================
-- UP SMK Taruna Bhakti — Seed awal (jurusan + katalog contoh)
-- UUID jurusan fixed agar stabil antar environment.
-- Jalankan SETELAH schema.sql + rls.sql (sebagai service_role / dashboard).
-- ============================================================

insert into public.jurusan (id, kode, nama, deskripsi) values
  ('11111111-1111-1111-1111-111111111111','DKV','Desain Komunikasi Visual','Jasa desain, branding, foto/video produk.'),
  ('22222222-2222-2222-2222-222222222222','TKJ','Teknik Komputer dan Jaringan','Instalasi jaringan, rakit & maintenance PC, Mikrotik.'),
  ('33333333-3333-3333-3333-333333333333','RPL','Rekayasa Perangkat Lunak','Website, aplikasi mobile, CMS, maintenance sistem.'),
  ('44444444-4444-4444-4444-444444444444','BC','Broadcasting','Video editing, shooting, sewa studio & alat, live streaming.'),
  ('55555555-5555-5555-5555-555555555555','ANIMASI','Animasi','Animasi 2D/3D, explainer, maskot, motion graphics.'),
  ('66666666-6666-6666-6666-666666666666','TE','Teknik Elektronika','IoT kustom, cetak & assembly PCB, reparasi elektronik.')
on conflict (id) do update set nama = excluded.nama, deskripsi = excluded.deskripsi, aktif = true;

-- ---------- KATALOG CONTOH (2/jurusan) ----------
-- DKV
insert into public.products_services (jurusan_id, nama, tipe, harga, satuan, deskripsi, metadata) values
  ('11111111-1111-1111-1111-111111111111','Desain Logo + Branding Kit','service',750000,'paket','Logo, warna, tipografi, guideline 10 halaman.','{"brief_fields":["nama_brand","preferensi_warna","gaya_visual","referensi_url"],"watermark_preview":true,"revisi_maks":3}'),
  ('11111111-1111-1111-1111-111111111111','Foto & Video Produk UMKM','service',500000,'sesi','Foto 20 shot + video 60 detik untuk marketplace.','{"brief_fields":["jumlah_produk","lokasi_shoot","referensi"],"watermark_preview":true}');

-- TKJ
insert into public.products_services (jurusan_id, nama, tipe, harga, satuan, deskripsi, metadata) values
  ('22222222-2222-2222-2222-222222222222','Instalasi WiFi/LAN Rumah & Ruko','service',1200000,'titik','Survey, kabel, konfigurasi router/Mikrotik dasar.','{"butuh_jadwal":true,"form_teknis":["luas_area","jumlah_perangkat","denah"],"tracking_serial":true}'),
  ('22222222-2222-2222-2222-222222222222','Service Laptop/PC + Install OS','service',150000,'unit','Pembersihan, ganti pasta, install OS legal.','{"butuh_jadwal":true,"tracking_serial":true}');

-- RPL
insert into public.products_services (jurusan_id, nama, tipe, harga, satuan, deskripsi, metadata) values
  ('33333333-3333-3333-3333-333333333333','Website Company Profile','service',2500000,'paket','5 halaman, CMS, SEO dasar, staging URL.','{"multi_step":true,"staging":true,"revisi_maks":2,"sprint_bar":true}'),
  ('33333333-3333-3333-3333-333333333333','Aplikasi Android Kustom','service',6000000,'paket','Android native/Flutter, API, Play rollout bantuan.','{"multi_step":true,"staging":true,"revisi_maks":2}');

-- BC
insert into public.products_services (jurusan_id, nama, tipe, harga, satuan, deskripsi, metadata) values
  ('44444444-4444-4444-4444-444444444444','Sewa Studio + Operator (per hari)','service',1500000,'hari','Studio, lighting, 1 operator, editing dasar.','{"kalender_realtime":true,"harga_per":"hari","butuh_tos":true,"denda_telat_per_jam":50000}'),
  ('44444444-4444-4444-4444-444444444444','Jasa Live Streaming Event','service',2000000,'event','2 kamera, switcher, overlay, YouTube/IG.','{"kalender_realtime":true,"butuh_tos":true}');

-- Animasi
insert into public.products_services (jurusan_id, nama, tipe, harga, satuan, deskripsi, metadata) values
  ('55555555-5555-5555-5555-555555555555','Explainer Video 60 Detik','service',3000000,'paket','Script, storyboard, voice-over, render HD.','{"pipeline":["concept","sketch","color","render","postpro"],"chunk_upload":true}'),
  ('55555555-5555-5555-5555-555555555555','Maskot 3D + Rigging','service',4500000,'paket','Modeling, texturing, rig dasar, file blend/fbx.','{"pipeline":["concept","sketch","color","render","postpro"]}');

-- TE
insert into public.products_services (jurusan_id, nama, tipe, harga, satuan, deskripsi, metadata) values
  ('66666666-6666-6666-6666-666666666666','Cetak + Assembly PCB Kustom','service',350000,'lot','Review skematik, cetak, solder, QC.','{"kalkulator_komponen":true,"terima_gerber":true,"validasi_pembimbing":true}'),
  ('66666666-6666-6666-6666-666666666666','Alat IoT Kustom (ESP32)','service',1250000,'unit','Sensor + dashboard monitoring + enclosure.','{"kalkulator_komponen":true,"upload_skematik":true}');

-- ---------- EQUIPMENT BC CONTOH ----------
insert into public.equipment (jurusan_id, nama, stok_total, stok_tersedia, harga_sewa_per_hari, metadata) values
  ('44444444-4444-4444-4444-444444444444','Kamera Mirrorless + Lensa 24-70',3,3,350000,'{"kategori":"kamera"}'),
  ('44444444-4444-4444-4444-444444444444','Lighting Godox SL60 + Softbox',4,4,150000,'{"kategori":"lighting"}'),
  ('44444444-4444-4444-4444-444444444444','Mic Wireless + Recorder',5,5,120000,'{"kategori":"audio"}');
