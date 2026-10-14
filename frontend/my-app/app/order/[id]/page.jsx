"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../lib/api";
import { getAccessToken, supabase } from "../../../lib/supabaseClient";
import PipelineTracker from "../../../components/PipelineTracker";
import { TimelineSkeleton } from "../../../components/Skeleton";
import { formatRupiah } from "../../../lib/majors";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return toast.error("Silakan login untuk melihat order.");
        const o = await api.orderById(token, id);
        setOrder(o);
        setEvents(o.project_tracking ?? []);
      } catch (e) {
        toast.error(e.message);
      }
    })();
    // Realtime: update pipeline saat siswa/guru push progres
    const ch = supabase
      .channel(`order:${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "project_tracking", filter: `order_id=eq.${id}` }, (payload) => {
        if (payload.eventType === "INSERT") setEvents((prev) => [...prev, payload.new]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, (payload) => {
        setOrder((prev) => (prev ? { ...prev, ...payload.new } : prev));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  if (!order) return <main className="mx-auto w-[min(720px,92%)] py-6"><TimelineSkeleton /></main>;

  return (
    <main className="mx-auto w-[min(720px,92%)] py-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-slate-400">{order.invoice_no}</p>
        <h1 className="text-xl font-black text-[#0F172A]">{order.products_services?.nama ?? "Order"}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
          <span className={`rounded-full px-3 py-1 ${order.payment_status === "settlement" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{order.payment_status}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{order.project_status}</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{formatRupiah(order.total)}</span>
        </div>
        {order.payment_status !== "settlement" && order.snap_redirect_url && (
          <a href={order.snap_redirect_url} className="mt-3 inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white">Lanjutkan pembayaran →</a>
        )}
      </div>
      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="font-black text-[#0F172A]">Tracking progres (live)</h2>
        <div className="mt-4"><PipelineTracker current={order.project_status} events={events} /></div>
      </div>
    </main>
  );
}
