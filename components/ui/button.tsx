import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "secondary" | "whatsapp" | "ghost" | "dark" | "link" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const variants: Record<Variant, string> = {
  primary: "bg-accent-600 text-white shadow-cta hover:bg-accent-700 hover:-translate-y-0.5",
  brand: "bg-brand-700 text-white shadow-cta-brand hover:bg-brand-800 hover:-translate-y-0.5",
  secondary:
    "bg-white text-ink-900 ring-1 ring-ink-300/80 shadow-soft hover:ring-ink-500/40 hover:-translate-y-0.5",
  whatsapp: "bg-whatsapp-dark text-white shadow-soft hover:bg-[#0f7a40] hover:-translate-y-0.5",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
  dark: "bg-ink-900 text-white hover:bg-ink-700 hover:-translate-y-0.5",
  link: "p-0! text-accent-700 underline-offset-4 hover:text-accent-600 hover:underline",
  danger: "bg-white text-accent-700 ring-1 ring-accent-200 hover:bg-accent-50",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-3 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = { variant?: Variant; size?: Size };

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & Common) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & Common) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonAnchor({ variant, size, className, ...props }: ComponentProps<"a"> & Common) {
  return <a className={buttonClasses({ variant, size, className })} {...props} />;
}
