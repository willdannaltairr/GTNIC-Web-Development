export function BcForm({ value, onChange, hargaHarian = 0 }) {
  const durasi = Number(value.durasi ?? 1);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Tanggal sewa<input type="date" value={value.tanggal_sewa ?? ""} onChange={(e) => onChange({ ...value, tanggal_sewa: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
        <label className="text-sm font-bold">Durasi (hari)<input type="number" min={1} value={durasi} onChange={(e) => onChange({ ...value, durasi: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
      </div>
      <label className="text-sm font-bold">Daftar alat dibutuhkan<textarea value={value.daftar_alat ?? ""} onChange={(e) => onChange({ ...value, daftar_alat: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Kamera, lighting, mic wireless" /></label>
      <div className="rounded-xl bg-slate-50 p-3 text-sm">Estimasi sewa: <b>Rp {(hargaHarian * durasi).toLocaleString("id-ID")}</b> ({durasi} hari × Rp {Number(hargaHarian).toLocaleString("id-ID")})</div>
      <label className="flex items-start gap-2 text-xs text-slate-600"><input type="checkbox" checked={!!value.setuju_tos} onChange={(e) => onChange({ ...value, setuju_tos: e.target.checked })} className="mt-0.5" /> Saya setuju ToS peminjaman: pengembalian telat didenda Rp 50rb/jam, kerusakan diganti sesuai inventaris.</label>
    </div>
  );
}
