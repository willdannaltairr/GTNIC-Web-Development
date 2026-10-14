"use client";
import { useMemo } from "react";

export function TeForm({ value, onChange }) {
  const items = value.komponen ?? [{ nama: "ESP32", qty: 1, hargaSatuan: 120000 }];
  const { subtotal, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.hargaSatuan || 0), 0);
    return { subtotal: sub, total: sub + 150000 };
  }, [JSON.stringify(items)]);

  const setItems = (next) => {
    onChange({ ...value, komponen: next, estimasi_komponen: total });
  };

  const validGerber = (name = "") => /\.(zip|gbr|ger|sch|kicad_pcb)$/i.test(name);

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Jenis alat<input value={value.jenis_alat ?? ""} onChange={(e) => onChange({ ...value, jenis_alat: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Sensor suhu IoT" /></label>
        <label className="text-sm font-bold">Jumlah unit<input type="number" min={1} value={value.jumlah_unit ?? 1} onChange={(e) => onChange({ ...value, jumlah_unit: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
      </div>
      <div className="rounded-2xl border border-slate-200 p-3">
        <p className="text-sm font-bold">Kalkulator komponen</p>
        {items.map((it, i) => (
          <div key={i} className="mt-2 grid grid-cols-3 gap-2">
            <input value={it.nama} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], nama: e.target.value }; setItems(n); }} className="rounded-lg border border-slate-200 p-2 text-xs" placeholder="Nama" />
            <input type="number" value={it.qty} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], qty: Number(e.target.value) }; setItems(n); }} className="rounded-lg border border-slate-200 p-2 text-xs" placeholder="Qty" />
            <input type="number" value={it.hargaSatuan} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], hargaSatuan: Number(e.target.value) }; setItems(n); }} className="rounded-lg border border-slate-200 p-2 text-xs" placeholder="Harga" />
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between">
          <button type="button" onClick={() => setItems([...items, { nama: "", qty: 1, hargaSatuan: 0 }])} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold">+ Komponen</button>
          <p className="text-xs">Subtotal Rp {subtotal.toLocaleString("id-ID")} + jasa Rp 150.000 = <b>Rp {total.toLocaleString("id-ID")}</b></p>
        </div>
      </div>
      <label className="text-sm font-bold">File skematik/Gerber (zip/gbr/sch)<input value={value.skematik_url ?? ""} onChange={(e) => onChange({ ...value, skematik_url: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Link file atau nama file.zip" />
        {value.skematik_url && !validGerber(value.skematik_url) && <span className="mt-1 block text-xs font-semibold text-red-500">Format harus .zip/.gbr/.ger/.sch — akan divalidasi pembimbing sebelum cetak.</span>}
      </label>
    </div>
  );
}
