"use client";
import { Suspense, lazy, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "../lib/api";
import { getAccessToken } from "../lib/supabaseClient";
import { formatRupiah } from "../lib/majors";
import { DkvForm } from "./forms/DkvForm";
import { TkjForm } from "./forms/TkjForm";
import { RplForm } from "./forms/RplForm";
import { BcForm } from "./forms/BcForm";
import { AnimasiForm } from "./forms/AnimasiForm";
import { TeForm } from "./forms/TeForm";

const STEPS = ["Pilih layanan", "Isi brief", "Review & bayar"];

export default function CheckoutWizard({ catalog = [], initialId = "" }) {
  const [step, setStep] = useState(initialId ? 1 : 0);
  const [layananId, setLayananId] = useState(initialId);
  const [brief, setBrief] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const layanan = useMemo(() => catalog.find((c) => c.id === layananId) ?? null, [catalog, layananId]);
  const kode = layanan?.jurusan?.kode ?? "";

  const total = useMemo(() => {
    if (!layanan) return 0;
    if (kode === "BC") return Number(layanan.harga) * Number(brief.durasi ?? qty ?? 1);
    return Number(layanan.harga) * qty;
  }, [layanan, qty, brief, kode]);

  function renderBriefForm() {
    if (!layanan) return <p className="text-sm text-slate-500">Pilih layanan dulu.</p>;
    const props = { value: brief, onChange: setBrief };
    switch (kode) {
      case "DKV": return <DkvForm {...props} />;
      case "TKJ": return <TkjForm {...props} />;
      case "RPL": return <RplForm {...props} />;
      case "BC": return <BcForm {...props} hargaHarian={Number(layanan.harga)} />;
      case "ANIMASI": return <AnimasiForm {...props} />;
      case "TE": return <TeForm {...props} />;
      default: return <TkjForm {...props} />;
    }
  }

  async function handleBayar() {
    if (!layanan) return toast.error("Pilih layanan dulu.");
    if (kode === "BC" && !brief.setuju_tos) return toast.error("Centang persetujuan ToS dulu.");
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Silakan login dulu sebelum checkout.");
        setLoading(false);
        return;
      }
      const data = await api.checkout(token, { layanan_id: layanan.id, brief, qty: kode === "BC" ? Number(brief.durasi ?? 1) : qty });
      toast.success(`Order ${data.invoice_no} dibuat. Mengalihkan ke pembayaran...`);
      window.location.href = data.redirect_url;
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
      <div className="flex gap-2">
        {STEPS.map((t, i) => (
          <div key={t} className="flex flex-1 items-center gap-2">
            <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${i <= step ? "bg-[#0F172A] text-white" : "bg-slate-100 text-slate-400"}`}>{i + 1}</span>
            <span className={`text-xs font-bold ${i <= step ? "text-[#0F172A]" : "text-slate-400"}`}>{t}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6">
          {step === 0 && (
            <div className="grid gap-2">
              <label className="text-sm font-bold">Layanan<select value={layananId} onChange={(e) => setLayananId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal">
                <option value="">— pilih —</option>
                {catalog.map((c) => (
                  <option key={c.id} value={c.id}>{c.jurusan?.kode} • {c.nama} • {formatRupiah(c.harga)}</option>
                ))}
              </select></label>
              {kode !== "BC" && (
                <label className="text-sm font-bold">Qty<input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
              )}
            </div>
          )}
          {step === 1 && renderBriefForm()}
          {step === 2 && (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">
              <p className="font-black text-[#0F172A]">{layanan?.nama}</p>
              <p className="text-slate-500">{layanan?.jurusan?.nama} • Qty {kode === "BC" ? (brief.durasi ?? 1) : qty}</p>
              <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-white p-3 text-[11px] text-slate-600">{JSON.stringify(brief, null, 2)}</pre>
              <p className="mt-3 text-lg font-black">Total: {formatRupiah(total)}</p>
              <p className="text-xs text-slate-500">Dibayar via Midtrans (QRIS/VA/E-Wallet). Progres dibuka setelah settlement.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between gap-2">
        <button disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold disabled:opacity-40">← Kembali</button>
        {step < 2
          ? <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep(step + 1)} disabled={step === 0 && !layanan} className="rounded-full bg-[#0F172A] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">Lanjut →</motion.button>
          : <motion.button whileTap={{ scale: 0.95 }} onClick={handleBayar} disabled={loading} className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 disabled:opacity-50">{loading ? "Memproses..." : `Bayar ${formatRupiah(total)}`}</motion.button>}
      </div>
    </div>
  );
}
