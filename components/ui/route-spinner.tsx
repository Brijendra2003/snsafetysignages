"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Gives up on a navigation that never completes (offline, aborted) so the spinner can't get stuck. */
const FAILSAFE_MS = 20_000;

function urlKey(url: URL) {
  return url.origin + url.pathname + url.search;
}

/**
 * App-wide circular spinner shown while a client-side navigation is in flight.
 * On slow networks a clicked link can sit for seconds before the next route
 * (or its loading.tsx) arrives; this gives immediate feedback for every link,
 * not just ones wrapped with useLinkStatus. A short CSS delay keeps it from
 * flashing on fast, prefetched navigations.
 */
export function RouteSpinner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const route = `${pathname}?${searchParams}`;
  // The route the navigation started from; once the URL moves on, it has committed.
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const pending = startedAt === route;

  useEffect(() => {
    const setPending = (on: boolean) => setStartedAt(on ? route : null);

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.hasAttribute("download") || (a.target && a.target !== "_self")) return;

      const next = new URL(a.href, location.href);
      if (next.origin !== location.origin) return;
      // Same page or a hash jump: no navigation to wait for.
      if (urlKey(next) === urlKey(new URL(location.href))) return;
      setPending(true);
    };
    const onPopState = () => setPending(true);

    window.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [route]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setStartedAt(null), FAILSAFE_MS);
    return () => clearTimeout(t);
  }, [pending]);

  if (!pending) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-[90] grid place-items-center opacity-0 [animation:fade-in_0.2s_ease_0.15s_forwards]"
    >
      <span className="grid size-16 place-items-center rounded-full bg-white/95 shadow-lift ring-1 ring-ink-100">
        <span className="size-9 animate-spin rounded-full border-[3px] border-brand-100 border-t-accent-600" />
      </span>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
