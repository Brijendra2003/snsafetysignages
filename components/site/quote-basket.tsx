"use client";

import { ArrowRight, ClipboardList, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { LeadForm } from "@/components/site/lead-form";
import { useQuote } from "@/components/site/quote-provider";
import { buttonClasses } from "@/components/ui/button";
import { ProductVisual } from "@/components/ui/product-visual";

export function QuoteBasket() {
  const { items, ready, remove, setQuantity, clear } = useQuote();
  const onSuccess = useCallback(() => clear(), [clear]);

  if (!ready) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" aria-hidden>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
        <div className="skeleton h-96" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">
            Your items <span className="text-ink-400">({items.length})</span>
          </h2>
          {items.length > 0 && (
            <button type="button" onClick={clear} className="cursor-pointer text-sm font-semibold text-ink-500 hover:text-accent-700">
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-ink-100">
            <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-700">
              <ClipboardList className="size-8" />
            </span>
            <h3 className="mt-5 text-xl font-bold">Your quote basket is empty</h3>
            <p className="mt-2 max-w-sm text-ink-500">
              Browse products and tap <strong>Quote</strong> to add them, or just describe what you need in the form.
            </p>
            <Link href="/products" className={buttonClasses({ variant: "brand", className: "mt-6" })}>
              Browse products <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <li key={item.product_id} className="anim-intro flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 shadow-soft ring-1 ring-ink-100">
                <Link href={`/products/${item.slug}`} className="group shrink-0">
                  <ProductVisual
                    image={item.image}
                    slug={item.slug}
                    categorySlug={item.categorySlug}
                    name={item.name}
                    sizes="80px"
                    className="size-20 rounded-xl"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} className="line-clamp-2 font-bold text-ink-900 hover:text-accent-700">
                    {item.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                      className="grid size-8 cursor-pointer place-items-center rounded-lg ring-1 ring-ink-200 hover:bg-ink-50"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => setQuantity(item.product_id, Number(e.target.value))}
                      aria-label={`Quantity of ${item.name}`}
                      className="w-16 rounded-lg border-0 py-1.5 text-center text-sm font-semibold ring-1 ring-ink-200 [appearance:textfield] focus:ring-2 focus:ring-brand-600 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                      className="grid size-8 cursor-pointer place-items-center rounded-lg ring-1 ring-ink-200 hover:bg-ink-50"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.product_id)}
                  aria-label={`Remove ${item.name}`}
                  className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-ink-400 transition hover:bg-accent-50 hover:text-accent-700"
                >
                  <Trash2 className="size-4.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-ink-100 sm:p-8 lg:sticky lg:top-28">
        <h2 className="text-xl font-bold">Your details</h2>
        <p className="mt-1 text-sm text-ink-500">
          {items.length
            ? `We'll price all ${items.length} item${items.length > 1 ? "s" : ""} and call you back.`
            : "Tell us what you need and we'll call you back."}
        </p>
        <LeadForm
          source="quote"
          items={items.map((i) => ({ product_id: i.product_id, name: i.name, slug: i.slug, quantity: i.quantity }))}
          subject={items.length ? `Quote for ${items.length} product${items.length > 1 ? "s" : ""}` : undefined}
          onSuccess={onSuccess}
          compact
          className="mt-6"
          submitLabel="Request quotation"
        />
      </div>
    </div>
  );
}
