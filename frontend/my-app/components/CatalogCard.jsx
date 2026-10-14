"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatRupiah } from "../lib/majors";

export default function CatalogCard({ item }) {
  const jurusan = item.jurusan ?? {};
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#0F172A] px-3 py-1 text-[11px] font-black text-white">
          {jurusan.kode ?? "UP"}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{item.tipe}</span>
      </div>
      <h3 className="mt-3 font-bold text-[#0F172A]">{item.nama}</h3>
      <p className="mt-1 line-clamp-2 text-[13px] text-slate-500">{item.deskripsi}</p>
      <div className="mt-3 text-lg font-black text-[#0F172A]">{formatRupiah(item.harga)} <span className="text-xs font-semibold text-slate-400">/ {item.satuan}</span></div>
      <div className="mt-4 flex gap-2">
        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
          <Link
            href={`/checkout?layanan=${item.id}`}
            className="block rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/25"
          >
            Pesan
          </Link>
        </motion.div>
        <Link href={`/katalog?jurusan=${jurusan.kode ?? ""}`} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">
          {jurusan.nama ?? "Detail"}
        </Link>
      </div>
    </motion.article>
  );
}
