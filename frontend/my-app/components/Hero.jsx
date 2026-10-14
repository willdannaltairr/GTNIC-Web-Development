"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative mx-auto w-[min(1120px,92%)] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] p-8 text-white sm:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur"
      >
        TEACHING FACTORY • 6 JURUSAN • 1 PORTAL
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-5xl"
      >
        Pesan jasa kreatif & teknis langsung dari siswa Taruna Bhakti.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base"
      >
        Desain, jaringan, software, broadcast, animasi, hingga IoT — dengan brief dinamis per jurusan,
        pembayaran Midtrans (QRIS/VA/E-Wallet), dan tracking progres real-time.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
          <Link href="/katalog" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0F172A]">
            Jelajahi Katalog
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
          <Link href="/dashboard" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white backdrop-blur">
            Lacak Pesanan
          </Link>
        </motion.div>
      </motion.div>
      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        {[
          ["6", "Jurusan vendor"],
          ["QRIS+", "Pembayaran otomatis"],
          ["Live", "Tracking progres"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-white/10 p-3 backdrop-blur">
            <div className="text-xl font-black">{v}</div>
            <div className="text-[11px] text-slate-200">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
