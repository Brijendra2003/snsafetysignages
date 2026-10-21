/**
 * Single-series column chart (leads per day). One hue, thin columns with
 * 4px rounded data-ends, hairline grid, per-column hover tooltip with a hit
 * target the full height of the slot, and a table view for screen readers.
 */
export function LeadsChart({ data }: { data: { key: string; label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 0);
  const step = max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : Math.ceil(max / 5 / 5) * 5;
  const top = Math.max(step * 4, Math.ceil(max / step) * step);
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).reverse();

  return (
    <figure>
      <div className="flex h-56 gap-3">
        {/* y axis */}
        <div className="flex flex-col justify-between pb-6 text-right text-[0.7rem] text-ink-500 tabular-nums" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {t}
            </span>
          ))}
        </div>
        {/* plot */}
        <div className="relative flex-1">
          <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between" aria-hidden>
            {ticks.map((t) => (
              <div key={t} className="h-px bg-ink-100" />
            ))}
          </div>
          <ol className="absolute inset-0 flex items-stretch gap-0.5" aria-hidden>
            {data.map((d, i) => {
              const pct = top ? (d.count / top) * 100 : 0;
              return (
                <li key={d.key} className="group relative flex flex-1 flex-col">
                  <div className="relative flex flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-6 rounded-t-[4px] bg-brand-600 transition-colors group-hover:bg-brand-800"
                      style={{ height: `${pct}%`, minHeight: d.count ? 2 : 0 }}
                    />
                    <div className="pointer-events-none absolute bottom-[calc(var(--h)+8px)] left-1/2 z-10 -translate-x-1/2 rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lift transition group-hover:opacity-100" style={{ ["--h" as string]: `${pct}%` }}>
                      <span className="block text-ink-300">{d.label}</span>
                      <span className="font-semibold">
                        {d.count} lead{d.count === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                  <span className="h-6 pt-1.5 text-center text-[0.65rem] whitespace-nowrap text-ink-500">
                    {i % 2 === (data.length - 1) % 2 ? d.label.split(" ")[0] : ""}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs font-semibold text-ink-500 hover:text-ink-900">View as table</summary>
        <table className="mt-2 w-full text-left text-xs">
          <thead>
            <tr className="text-ink-500">
              <th className="py-1 font-semibold">Date</th>
              <th className="py-1 text-right font-semibold">Leads</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key} className="border-t border-ink-100">
                <td className="py-1">{d.label}</td>
                <td className="py-1 text-right tabular-nums">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
