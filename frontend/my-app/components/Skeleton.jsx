export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5">
      <div className="h-6 w-20 rounded-full bg-slate-100" />
      <div className="mt-3 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-full rounded bg-slate-100" />
      <div className="mt-4 h-10 w-full rounded-full bg-slate-100" />
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100" />
          <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="h-4 w-1/3 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
