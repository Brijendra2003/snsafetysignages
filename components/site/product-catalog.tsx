"use client";

import { PackageSearch, Search, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "@/components/site/product-card";
import type { Category, ProductWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Sort = "featured" | "name";

/**
 * Client-side filtering over the cached catalogue: instant category switching
 * and search, with the active category mirrored in the URL for sharing.
 */
export function ProductCatalog({
  products,
  categories,
}: {
  products: ProductWithCategory[];
  categories: Category[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the source of truth for the category, so footer/category links
  // work even when this page is kept alive between navigations.
  const urlCategory = searchParams.get("category") ?? "all";
  const category = categories.some((c) => c.slug === urlCategory) ? urlCategory : "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<Sort>("featured");
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) if (p.category) map.set(p.category.slug, (map.get(p.category.slug) ?? 0) + 1);
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && p.category?.slug !== category) return false;
      if (!q) return true;
      return [p.name, p.short_description, p.category?.name, p.sku, ...p.features]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return [...list].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  }, [products, category, deferredQuery, sort]);

  function updateUrl(next: { category?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const cat = next.category ?? category;
    const q = next.q ?? query;
    if (cat && cat !== "all") params.set("category", cat);
    else params.delete("category");
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    const qs = params.toString();
    // Native history updates are synced with useSearchParams without a server round-trip.
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  const activeCategory = categories.find((c) => c.slug === category);
  const chips = [{ slug: "all", name: "All products", count: products.length }].concat(
    categories.map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.slug) ?? 0 })),
  );

  return (
    <div>
      <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-ink-100 bg-canvas/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Product categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:pb-0">
            {chips.map((c) => {
              const active = c.slug === category;
              return (
                <button
                  key={c.slug}
                  role="tab"
                  aria-selected={active}
                  onClick={() => updateUrl({ category: c.slug })}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-ink-900 text-white shadow-soft"
                      : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-400",
                  )}
                >
                  {c.name}
                  <span className={cn("rounded-full px-1.5 text-[0.7rem]", active ? "bg-white/20" : "bg-ink-100 text-ink-500")}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <label className="relative flex-1 lg:w-72 lg:flex-none">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => updateUrl({})}
                placeholder="Search signs, lights, tapes…"
                className="w-full rounded-xl border-0 bg-white py-2.5 pr-9 pl-10 text-sm text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    updateUrl({ q: "" });
                  }}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </label>
            <label>
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-full cursor-pointer rounded-xl border-0 bg-white px-3 text-sm font-medium text-ink-700 ring-1 ring-ink-200 focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="featured">Popular first</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-extrabold">{activeCategory ? activeCategory.name : "All products"}</h2>
        <p className="text-sm text-ink-500" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </div>
      {activeCategory?.description && <p className="mt-2 max-w-3xl text-ink-500">{activeCategory.description}</p>}

      {filtered.length ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <li key={p.id} className="anim-intro" style={{ ["--d" as string]: `${Math.min(i, 8) * 40}ms` }}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-ink-100">
          <span className="grid size-16 place-items-center rounded-2xl bg-ink-100 text-ink-500">
            <PackageSearch className="size-8" />
          </span>
          <h3 className="mt-5 text-xl font-bold">No products match “{query}”</h3>
          <p className="mt-2 max-w-sm text-ink-500">
            We make many custom items that aren&apos;t listed. Send us your requirement and we&apos;ll quote it.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              updateUrl({ category: "all", q: "" });
            }}
            className="mt-6 cursor-pointer text-sm font-semibold text-accent-700 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductCatalogSkeleton() {
  return (
    <div aria-hidden>
      <div className="flex gap-2 py-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="skeleton h-9 w-32 rounded-full!" />
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
            <div className="skeleton aspect-[4/3] rounded-none!" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
