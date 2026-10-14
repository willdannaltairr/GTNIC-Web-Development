export function AnimasiForm({ value, onChange }) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Durasi video (detik)<input type="number" min={5} value={value.durasi_video ?? 60} onChange={(e) => onChange({ ...value, durasi_video: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label>
        <label className="text-sm font-bold">Gaya<select value={value.gaya_animasi ?? "2d"} onChange={(e) => onChange({ ...value, gaya_animasi: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal"><option value="2d">2D</option><option value="3d">3D</option><option value="motion">Motion Graphics</option><option value="maskot">Maskot</option></select></label>
      </div>
      <label className="text-sm font-bold">Naskah / sinopsis<textarea value={value.naskah ?? ""} onChange={(e) => onChange({ ...value, naskah: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Ceritakan pesan videonya..." /></label>
      <label className="text-sm font-bold">Referensi<input value={value.referensi ?? ""} onChange={(e) => onChange({ ...value, referensi: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" placeholder="Link YouTube/contoh" /></label>
      <p className="rounded-xl bg-violet-50 p-3 text-xs text-violet-700">Pipeline: Concept → Sketch → Color → Render → Post-Pro. File besar diupload bertahap (chunk) ke Supabase Storage.</p>
    </div>
  );
}
