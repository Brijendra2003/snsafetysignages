import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LeadStatus, OrderStatus, PaymentStatus } from "@/lib/types";
import { cn, titleCase } from "@/lib/utils";

export const adminInput =
  "w-full rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:ring-2 focus:ring-brand-600 focus:outline-none aria-invalid:ring-accent-500 disabled:bg-ink-50";

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
            <ChevronLeft className="size-4" /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, actions, children, className, bodyClassName }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn("rounded-2xl bg-white shadow-soft ring-1 ring-ink-100", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          {title && <h2 className="font-display text-base font-bold text-ink-900">{title}</h2>}
          {actions}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

const leadTones: Record<LeadStatus, string> = {
  new: "bg-brand-50 text-brand-700 ring-brand-200",
  contacted: "bg-safety-300/25 text-[#854d0e] ring-safety-400/50",
  qualified: "bg-[#f3e8ff] text-[#6b21a8] ring-[#e9d5ff]",
  converted: "bg-success-50 text-success-600 ring-success-600/20",
  lost: "bg-ink-100 text-ink-500 ring-ink-200",
};

const orderTones: Record<OrderStatus, string> = {
  pending: "bg-safety-300/25 text-[#854d0e] ring-safety-400/50",
  confirmed: "bg-brand-50 text-brand-700 ring-brand-200",
  in_production: "bg-[#f3e8ff] text-[#6b21a8] ring-[#e9d5ff]",
  dispatched: "bg-[#e0f2fe] text-[#075985] ring-[#bae6fd]",
  delivered: "bg-success-50 text-success-600 ring-success-600/20",
  cancelled: "bg-ink-100 text-ink-500 ring-ink-200",
};

const paymentTones: Record<PaymentStatus, string> = {
  unpaid: "bg-accent-50 text-accent-700 ring-accent-200",
  partial: "bg-safety-300/25 text-[#854d0e] ring-safety-400/50",
  paid: "bg-success-50 text-success-600 ring-success-600/20",
  refunded: "bg-ink-100 text-ink-500 ring-ink-200",
};

export function StatusBadge({ kind, value }: { kind: "lead" | "order" | "payment"; value: string }) {
  const tones = kind === "lead" ? leadTones : kind === "order" ? orderTones : paymentTones;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1",
        (tones as Record<string, string>)[value] ?? "bg-ink-100 text-ink-700 ring-ink-200",
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {titleCase(value)}
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-ink-100 text-ink-500">
        <Inbox className="size-7" />
      </span>
      <p className="mt-4 font-display text-lg font-bold text-ink-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** GET form for list filtering; keeps state in the URL so views are shareable and back-button friendly. */
export function FilterBar({
  q,
  placeholder = "Search…",
  selects = [],
}: {
  q?: string;
  placeholder?: string;
  selects?: { name: string; value?: string; label: string; options: { value: string; label: string }[] }[];
}) {
  return (
    <form className="mb-4 flex flex-col gap-2 sm:flex-row" role="search">
      <label className="relative flex-1">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
        <input name="q" defaultValue={q} placeholder={placeholder} className={cn(adminInput, "pl-9")} />
      </label>
      {selects.map((s) => (
        <label key={s.name}>
          <span className="sr-only">{s.label}</span>
          <select name={s.name} defaultValue={s.value ?? ""} className={cn(adminInput, "cursor-pointer sm:w-44")}>
            <option value="">{s.label}</option>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit" className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-700">
        Apply
      </button>
    </form>
  );
}

export function Pagination({ page, count, pageSize, params }: { page: number; count: number; pageSize: number; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `?${s}` : "?";
  };
  const link = "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-ink-200 hover:bg-ink-50";
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm text-ink-500">
      <p>
        Page {page} of {pages} · {count} total
      </p>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={href(page - 1)} className={link}>
            <ChevronLeft className="size-4" /> Prev
          </Link>
        )}
        {page < pages && (
          <Link href={href(page + 1)} className={link}>
            Next <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export function Field({
  label,
  name,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink-900">
        {label} {required && <span className="text-accent-600">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-accent-700">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const th = "px-4 py-3 text-left text-xs font-semibold tracking-wide text-ink-500 uppercase whitespace-nowrap";
export const td = "px-4 py-3 align-middle";

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-6 space-y-2">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-72" />
      </div>
      <div className="skeleton mb-4 h-10 w-full" />
      <div className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-ink-100">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="skeleton h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
