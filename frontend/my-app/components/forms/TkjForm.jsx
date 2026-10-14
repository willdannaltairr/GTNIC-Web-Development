export function TkjForm({ value, onChange }) {
  return (
    <div className="grid gap-3">
      <label className="text-sm font-bold">Jadwal kunjungan teknisi<input type="datetime-local" value={value.jadwal_kunjungan ?? ""} onChange={(e) => onChange({ ...value, jadwal_kunjungan: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
      <label className="text-sm font-bold">Keluhan / kebutuhan<textarea value={value.keluhan ?? ""} onChange={(e) => onChange({ ...value, keluhan: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" rows={3} placeholder="Contoh: WiFi lantai 2 lemot, 12 perangkat" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Luas area (m²)<input value={value.luas_area ?? ""} onChange={(e) => onChange({ ...value, luas_area: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="72" /></label>
        <label className="text-sm font-bold">Serial number perangkat<input value={value.serial_number ?? ""} onChange={(e) => onChange({ ...value, serial_number: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Opsional" /></label>
      </div>
    </div>
  );
}
