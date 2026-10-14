"use client";
import { useState } from "react";

const STEPS = ["Jenis", "Fitur", "Referensi & deadline"];

export function RplForm({ value, onChange }) {
  const [s, setS] = useState(0);
  return (
    <div>
      <div className="mb-3 flex gap-1">
        {STEPS.map((t, i) => (
          <button key={t} type="button" onClick={() => setS(i)} className={`flex-1 rounded-full px-2 py-1.5 text-[11px] font-bold ${i === s ? "bg-[#0F172A] text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}. {t}</button>
        ))}
      </div>
      {s === 0 && (
        <label className="text-sm font-bold">Jenis aplikasi<select value={value.jenis_aplikasi ?? "company-profile"} onChange={(e) => onChange({ ...value, jenis_aplikasi: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal"><option value="company-profile">Company Profile</option><option value="ecommerce">E-Commerce</option><option value="android">Aplikasi Android</option><option value="cms">Kustomisasi CMS</option></select></label>
      )}
      {s === 1 && (
        <label className="text-sm font-bold">Fitur utama (pisahkan koma)<textarea value={value.fitur_utama ?? ""} onChange={(e) => onChange({ ...value, fitur_utama: e.target.value })} rows={4} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Login, katalog, checkout, invoice" /></label>
      )}
      {s === 2 && (
        <div className="grid gap-3">
          <label className="text-sm font-bold">Referensi app/website<input value={value.referensi_app ?? ""} onChange={(e) => onChange({ ...value, referensi_app: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="https://..." /></label>
          <label className="text-sm font-bold">Deadline<input type="date" value={value.deadline ?? ""} onChange={(e) => onChange({ ...value, deadline: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
          <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">Scope dikunci saat brief disetujui. Revisi maks 2x — penambahan fitur dihitung change-request.</p>
        </div>
      )}
      <div className="mt-3 flex justify-between">
        <button type="button" disabled={s === 0} onClick={() => setS(s - 1)} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold disabled:opacity-40">← Kembali</button>
        <button type="button" disabled={s === 2} onClick={() => setS(s + 1)} className="rounded-full bg-[#0F172A] px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Lanjut →</button>
      </div>
    </div>
  );
}
