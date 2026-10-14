"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { MAJORS } from "../../lib/majors";
import CatalogCard from "../../components/CatalogCard";
import { CardSkeleton } from "../../components/Skeleton";

function KatalogInner() {
  const params = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(params.get("jurusan") ?? "SEMUA");
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    api.catalog()
      .then(setItems)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(
    () => items.filter((it) => (filter === "SEMUA" ? true : it.jurusan?.kode === filter)).filter((it) => it.nama.toLowerCase().includes(q.toLowerCase())),
    [items, filter, q],
  );

  return (
    <main className="mx-auto w-[min(1120px,92%)] py-6">
      <h1 className="text-2xl font-black text-[#0F172A]">Katalog Layanan</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {["SEMUA", ...MAJORS.map((m) => m.kode)].map((k) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === k ? "bg-[#0F172A] text-white" : "border border-slate-200 bg-white text-slate-500"}`}>{k}</button>
        ))}
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari: logo, website, studio, PCB..." className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? [0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />) : list.map((it) => <CatalogCard key={it.id} item={it} />)}
      </div>
      {!loading && list.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Belum ada layanan. Jalankan <code>supabase/seed.sql</code> lalu refresh.</p>}
    </main>
  );
}

export default function KatalogPage() {
  return (
    <Suspense fallback={<main className="mx-auto w-[min(1120px,92%)] py-6"><CardSkeleton /></main>}>
      <KatalogInner />
    </Suspense>
  );
}
