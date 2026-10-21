"use client";

import { Check } from "lucide-react";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * The "quote basket": visitors collect products they want priced, then submit
 * one enquiry from /quote. Persisted in localStorage so it survives reloads.
 */
export type QuoteItem = {
  product_id: string;
  name: string;
  slug: string;
  categorySlug: string | null;
  image: string | null;
  quantity: number;
};

type QuoteContextValue = {
  items: QuoteItem[];
  count: number;
  ready: boolean;
  add: (item: Omit<QuoteItem, "quantity">, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  has: (productId: string) => boolean;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);
const STORAGE_KEY = "sn-quote-v1";

function readStorage(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.product_id && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Hydrate from storage after mount to keep server and client markup identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode); the basket still works for this visit.
    }
  }, [items, ready]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const add = useCallback<QuoteContextValue["add"]>(
    (item, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === item.product_id);
        if (existing) {
          return prev.map((i) =>
            i.product_id === item.product_id ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...prev, { ...item, quantity }];
      });
      showToast(`${item.name} added to your quote`);
    },
    [showToast],
  );

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      ready,
      count: items.length,
      add,
      remove: (id) => setItems((prev) => prev.filter((i) => i.product_id !== id)),
      setQuantity: (id, quantity) =>
        setItems((prev) =>
          prev.map((i) => (i.product_id === id ? { ...i, quantity: Math.max(1, Math.min(100000, quantity || 1)) } : i)),
        ),
      clear: () => setItems([]),
      has: (id) => items.some((i) => i.product_id === id),
    }),
    [items, ready, add],
  );

  return (
    <QuoteContext value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8"
      >
        {toast && (
          <p className="anim-modal-in flex items-center gap-2.5 rounded-2xl bg-ink-900 py-3 pr-5 pl-3 text-sm font-semibold text-white shadow-lift">
            <span className="grid size-7 place-items-center rounded-lg bg-success-600">
              <Check className="size-4" />
            </span>
            {toast}
          </p>
        )}
      </div>
    </QuoteContext>
  );
}

export function useQuote() {
  const ctx = use(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
