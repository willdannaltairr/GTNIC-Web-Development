// Metadata 6 jurusan: sumber tunggal untuk bento grid, filter, dan wizard checkout.
export const MAJORS = [
  {
    kode: "DKV",
    nama: "Desain Komunikasi Visual",
    tagline: "Logo, branding, foto & video produk",
    deskripsi: "Brief warna/gaya + upload guideline. Preview watermark sebelum pelunasan.",
    warna: "#2563EB",
    fields: ["nama_brand", "preferensi_warna", "gaya_visual", "referensi_url"],
  },
  {
    kode: "TKJ",
    nama: "Teknik Komputer & Jaringan",
    tagline: "WiFi/LAN, rakit & service PC",
    deskripsi: "Booking kalender teknisi + kuesioner kerusakan + tracking serial number.",
    warna: "#0EA5E9",
    fields: ["jadwal_kunjungan", "luas_area", "keluhan", "serial_number"],
  },
  {
    kode: "RPL",
    nama: "Rekayasa Perangkat Lunak",
    tagline: "Website & aplikasi mobile",
    deskripsi: "Requirement multi-step + staging URL + sprint progress bar.",
    warna: "#10B981",
    fields: ["jenis_aplikasi", "fitur_utama", "referensi_app", "deadline"],
  },
  {
    kode: "BC",
    nama: "Broadcasting",
    tagline: "Sewa studio & alat, live streaming",
    deskripsi: "Kalender real-time + harga per jam/hari + checklist alat + ToS & denda.",
    warna: "#F59E0B",
    fields: ["tanggal_sewa", "durasi", "daftar_alat", "setuju_tos"],
  },
  {
    kode: "ANIMASI",
    nama: "Animasi",
    tagline: "Explainer, maskot 3D, motion",
    deskripsi: "Pipeline Concept→Sketch→Color→Render→Post-Pro + chunk upload file besar.",
    warna: "#8B5CF6",
    fields: ["durasi_video", "gaya_animasi", "naskah", "referensi"],
  },
  {
    kode: "TE",
    nama: "Teknik Elektronika",
    tagline: "IoT & cetak PCB",
    deskripsi: "Kalkulator estimasi komponen + upload Gerber/skematik + validasi pembimbing.",
    warna: "#EF4444",
    fields: ["jenis_alat", "skematik_url", "jumlah_unit", "estimasi_komponen"],
  },
];

export const PIPELINE_STAGES = [
  { key: "brief", label: "Brief diterima" },
  { key: "in_progress", label: "Dikerjakan siswa" },
  { key: "review", label: "Review guru" },
  { key: "revision", label: "Revisi" },
  { key: "completed", label: "Selesai" },
];

export function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n ?? 0));
}
