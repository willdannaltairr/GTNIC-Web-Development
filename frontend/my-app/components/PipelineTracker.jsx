"use client";
import { motion } from "framer-motion";
import { PIPELINE_STAGES } from "../lib/majors";

const DOT = {
  brief: "bg-slate-400",
  in_progress: "bg-blue-500",
  review: "bg-amber-500",
  revision: "bg-orange-500",
  completed: "bg-emerald-500",
};

export default function PipelineTracker({ current = "brief", events = [] }) {
  const idx = Math.max(0, PIPELINE_STAGES.findIndex((s) => s.key === current));
  return (
    <div>
      <div className="flex items-center gap-1">
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <motion.span
                layout
                className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-black text-white ${DOT[s.key]}`}
                animate={{ scale: i <= idx ? 1 : 0.85, opacity: i <= idx ? 1 : 0.5 }}
              >
                {i + 1}
              </motion.span>
              <span className="hidden text-[10px] font-bold text-slate-500 sm:block">{s.label}</span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className="mx-1 h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={false}
                  animate={{ width: i < idx ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {events.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Belum ada update progres. Update dari siswa/guru akan muncul di sini secara real-time.
          </p>
        )}
        {events.map((e) => (
          <motion.div
            key={e.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#0F172A]">{e.tahapan} {e.pipeline_label ? `• ${e.pipeline_label}` : ""}</span>
              <span className="text-[11px] text-slate-400">{new Date(e.created_at).toLocaleString("id-ID")}</span>
            </div>
            {e.notes && <p className="mt-1 text-sm text-slate-600">{e.notes}</p>}
            {e.file_url && (
              <a href={e.file_url} target="_blank" className="mt-2 inline-block text-xs font-bold text-blue-600 underline">
                Lihat file →
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
