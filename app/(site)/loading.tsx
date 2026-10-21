/** Route-level fallback for public pages: a light skeleton of a page hero and card grid. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="container-page py-14">
      <div className="hazard-stripes fixed inset-x-0 top-0 z-50 h-1 origin-left [animation:progress_1.2s_cubic-bezier(.6,0,.3,1)_infinite]" />
      <div className="skeleton h-4 w-40" />
      <div className="skeleton mt-6 h-12 w-3/4 max-w-2xl" />
      <div className="skeleton mt-4 h-5 w-2/3 max-w-xl" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
            <div className="skeleton aspect-[4/3] rounded-none!" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-5 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
