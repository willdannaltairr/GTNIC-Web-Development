export function DkvForm({ value, onChange }) {
  return (
    <div className="grid gap-3">
      <label className="text-sm font-bold">Nama brand<input value={value.nama_brand ?? ""} onChange={(e) => onChange({ ...value, nama_brand: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Contoh: Kopi Nusantara" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Preferensi warna<input type="color" value={value.preferensi_warna ?? "#2563EB"} onChange={(e) => onChange({ ...value, preferensi_warna: e.target.value })} className="mt-1 h-12 w-full rounded-xl border border-slate-200" /></label>
        <label className="text-sm font-bold">Gaya visual<select value={value.gaya_visual ?? "modern"} onChange={(e) => onChange({ ...value, gaya_visual: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal"><option value="modern">Modern</option><option value="klasik">Klasik</option><option value="playful">Playful</option><option value="luxury">Luxury</option></select></label>
      </div>
      <label className="text-sm font-bold">Link referensi<input value={value.referensi_url ?? ""} onChange={(e) => onChange({ ...value, referensi_url: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="https://..." /></label>
      <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-700">Hasil desain dikirim dengan watermark otomatis sebelum pelunasan — file final tanpa watermark dibuka setelah settlement.</p>
    </div>
  );
}
