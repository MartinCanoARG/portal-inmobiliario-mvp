export function PlanBadge({ label, slug }: { label: string; slug: string }) {
  const styleMap: Record<string, string> = {
    premium: "border-amber-400/50 bg-amber-100 text-amber-900",
    basic: "border-sky-300/50 bg-sky-100 text-sky-900",
    free: "border-slate-300 bg-slate-100 text-slate-700"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
        styleMap[slug] ?? styleMap.free
      }`}
    >
      {label}
    </span>
  );
}
