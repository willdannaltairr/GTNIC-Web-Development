import Hero from "../components/Hero";
import BentoMajors from "../components/BentoMajors";

export const metadata = {
  title: "UP Taruna Bhakti — Jasa Kreatif & Teknis 6 Jurusan",
  description: "Portal Production Unit SMK Taruna Bhakti Depok: DKV, TKJ, RPL, BC, Animasi, TE. Checkout Midtrans + tracking real-time.",
};

export default function Home() {
  return (
    <main className="space-y-8 py-6">
      <Hero />
      <BentoMajors />
      <section className="mx-auto w-[min(1120px,92%)] rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="font-black text-[#0F172A]">Cara pesan</h2>
        <ol className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-4">
          {["Pilih layanan per jurusan", "Isi brief dinamis (warna/jadwal/ToS/gerber)", "Bayar via QRIS/VA/E-Wallet", "Pantau pipeline real-time"].map((t, i) => (
            <li key={t} className="rounded-2xl bg-slate-50 p-4"><b className="text-[#0F172A]">{i + 1}.</b> {t}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
