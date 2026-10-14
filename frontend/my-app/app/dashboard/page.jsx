"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { getAccessToken, supabase } from "../../lib/supabaseClient";
import { formatRupiah } from "../../lib/majors";
import { CardSkeleton } from "../../components/Skeleton";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          toast.error("Silakan login dulu.");
          setLoading(false);
          return;
        }
        const [o, f] = await Promise.all([
          api.myOrders(token),
          api.finance(token).catch(() => null),
        ]);
        setOrders(o);
        setFinance(f);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLoginDemo() {
    toast.info("Gunakan Supabase Auth (email/password) — hubungkan di halaman login. MVP ini membaca sesi aktif.");
  }

  return (
    <main className="mx-auto w-[min(1120px,92%)] py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#0F172A]">Dashboard</h1>
        <button onClick={handleLoginDemo} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold">Info login</button>
      </div>
      {finance && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-3xl bg-[#0F172A] p-4 text-white"><p className="text-[11px] text-slate-300">Omzet lunas</p><p className="text-lg font-black">{formatRupiah(finance.gross)}</p></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4"><p className="text-[11px] text-slate-400">Order lunas</p><p className="text-lg font-black">{finance.settled_count}</p></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4"><p className="text-[11px] text-slate-400">Est. UP 30%</p><p className="text-lg font-black">{formatRupiah(finance.split_estimate?.amountUp)}</p></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4"><p className="text-[11px] text-slate-400">Est. Siswa 40%</p><p className="text-lg font-black">{formatRupiah(finance.split_estimate?.amountSiswa)}</p></div>
        </div>
      )}
      <h2 className="mt-6 font-black text-[#0F172A]">Pesanan saya</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {loading ? [0, 1].map((i) => <CardSkeleton key={i} />) : orders.map((o) => (
          <Link key={o.id} href={`/order/${o.id}`} className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:shadow-lg">
            <p className="text-[11px] font-bold text-slate-400">{o.invoice_no} • {o.jurusan?.kode}</p>
            <p className="font-bold text-[#0F172A]">{o.products_services?.nama ?? "Order"}</p>
            <div className="mt-2 flex gap-2 text-[11px] font-bold">
              <span className={`rounded-full px-2 py-1 ${o.payment_status === "settlement" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{o.payment_status}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{o.project_status}</span>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">{formatRupiah(o.total)}</span>
            </div>
          </Link>
        ))}
      </div>
      {!loading && orders.length === 0 && (
        <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Belum ada order. Mulai dari <Link href="/katalog" className="font-bold text-blue-600 underline">katalog</Link>. Catatan: butuh login Supabase agar <code>/orders/mine</code> terisi.
        </p>
      )}
    </main>
  );
}
