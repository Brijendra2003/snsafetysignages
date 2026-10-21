"use client";

import { Check, Plus } from "lucide-react";
import { useQuote, type QuoteItem } from "@/components/site/quote-provider";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToQuoteButton({
  item,
  quantity = 1,
  variant = "compact",
  className,
}: {
  item: Omit<QuoteItem, "quantity">;
  quantity?: number;
  variant?: "compact" | "full";
  className?: string;
}) {
  const { add, has, ready } = useQuote();
  const added = ready && has(item.product_id);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => add(item, quantity)}
        className={buttonClasses({ variant: added ? "secondary" : "brand", size: "lg", className })}
      >
        {added ? <Check className="size-5 text-success-600" /> : <Plus className="size-5" />}
        {added ? "Added · add more" : "Add to quote"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item, quantity)}
      aria-label={added ? `${item.name} is in your quote, add one more` : `Add ${item.name} to quote`}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition active:scale-95",
        added
          ? "bg-success-50 text-success-600 ring-1 ring-success-600/20"
          : "bg-brand-50 text-brand-700 hover:bg-brand-700 hover:text-white",
        className,
      )}
    >
      {added ? <Check className="size-4" /> : <Plus className="size-4" />}
      {added ? "Added" : "Quote"}
    </button>
  );
}
