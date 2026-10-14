"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MAJORS } from "../lib/majors";

export default function BentoMajors() {
  return (
    <section className="mx-auto w-[min(1120px,92%)]">
      <h2 className="text-xl font-black text-[#0F172A] sm:text-2xl">6 Mini-Store Jurusan</h2>
      <p className="mt-1 text-sm text-slate-500">Satu portal, enam keahlian. Arahkan kursor untuk glow tiap jurusan.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MAJORS.map((m, i) => (
          <motion.div
            key={m.kode}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl"
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
              style={{ background: m.warna }}
            />
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-black text-white"
              style={{ background: m.warna }}
            >
              {m.kode}
            </span>
            <h3 className="mt-2 font-bold text-[#0F172A]">{m.nama}</h3>
            <p className="text-sm font-semibold text-slate-500">{m.tagline}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{m.deskripsi}</p>
            <Link
              href={`/katalog?jurusan=${m.kode}`}
              className="mt-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-[#0F172A] transition group-hover:border-transparent group-hover:text-white"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = m.warna)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Lihat layanan →
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
