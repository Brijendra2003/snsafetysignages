import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { FloatingDecor } from "@/components/ui/floating-decor";

/** Banner at the top of inner pages: breadcrumb, title and an optional visual on the right. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  aside,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs: { href?: string; label: string }[];
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative -mt-[4.5rem] overflow-hidden bg-gradient-to-b from-brand-50 to-canvas pt-[4.5rem]">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[26rem] rounded-full bg-accent-100/60 blur-3xl" />
      <div aria-hidden className="dot-grid absolute inset-0 text-brand-200/50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-x-0 top-[4.5rem] bottom-0">
        <FloatingDecor />
      </div>
      <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
        <div>
          <nav aria-label="Breadcrumb" className="anim-intro">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-ink-900">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink-900">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow anim-intro mt-6" style={{ ["--d" as string]: "80ms" }}>
            {eyebrow}
          </p>
          <h1
            className="anim-intro mt-3 text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            style={{ ["--d" as string]: "160ms" }}
          >
            {title}
          </h1>
          {description && (
            <p className="anim-intro mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg" style={{ ["--d" as string]: "260ms" }}>
              {description}
            </p>
          )}
          {children && (
            <div className="anim-intro mt-8" style={{ ["--d" as string]: "360ms" }}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="anim-intro relative hidden lg:block" style={{ ["--d" as string]: "250ms" }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
