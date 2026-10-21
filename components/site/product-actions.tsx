"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToQuoteButton } from "@/components/site/add-to-quote";
import type { QuoteItem } from "@/components/site/quote-provider";

/** Quantity stepper + "Add to quote" on the product page. */
export function ProductActions({ item, minQty }: { item: Omit<QuoteItem, "quantity">; minQty: number }) {
  const [qty, setQty] = useState(Math.max(1, minQty));
  const clamp = (n: number) => Math.max(Math.max(1, minQty), Math.min(100000, Math.floor(n) || 1));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-xl bg-white shadow-soft ring-1 ring-ink-200">
        <button
          type="button"
          onClick={() => setQty((q) => clamp(q - 1))}
          aria-label="Decrease quantity"
          className="grid size-12 cursor-pointer place-items-center rounded-l-xl text-ink-700 hover:bg-ink-50"
        >
          <Minus className="size-4" />
        </button>
        <label className="sr-only" htmlFor="qty">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          inputMode="numeric"
          min={minQty}
          value={qty}
          onChange={(e) => setQty(clamp(Number(e.target.value)))}
          className="w-16 border-0 bg-transparent text-center font-semibold text-ink-900 [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => setQty((q) => clamp(q + 1))}
          aria-label="Increase quantity"
          className="grid size-12 cursor-pointer place-items-center rounded-r-xl text-ink-700 hover:bg-ink-50"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <AddToQuoteButton item={item} quantity={qty} variant="full" />
    </div>
  );
}
