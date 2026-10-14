"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/checkout", label: "Checkout" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-3 z-50 mx-auto w-[min(1120px,92%)]"
    >
      <nav className="flex items-center justify-between gap-3 rounded-2xl border border-white/40 bg-[#0F172A]/80 px-4 py-3 text-white shadow-xl backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 font-black">TB</span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">UP Taruna Bhakti</span>
            <span className="block text-[11px] text-slate-300">Production Unit • Depok</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-sm transition ${active ? "text-white" : "text-slate-300 hover:text-white"}`}
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/15" />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </div>
        <motion.div whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.03 }}>
          <Link href="/katalog" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
            Pesan Jasa
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}
