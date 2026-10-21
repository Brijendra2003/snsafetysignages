"use client";

import { ArrowRight, ClipboardList, Menu, Phone, X } from "lucide-react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/site/logo";
import { useQuote } from "@/components/site/quote-provider";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { mainNav, telLink, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

function PendingDot() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn(
        "absolute -top-1 -right-2.5 size-1.5 rounded-full bg-accent-600 transition-opacity",
        pending ? "animate-ping opacity-100" : "opacity-0",
      )}
    />
  );
}

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

type HeaderProps = { phone: string; whatsapp: string; logo?: ReactNode };

/** Reads the URL for active links; render inside <Suspense> with <Header pathname={null}> as fallback. */
export function HeaderRoute(props: HeaderProps) {
  return <Header {...props} pathname={usePathname()} />;
}

export function Header({ phone, whatsapp, logo, pathname }: HeaderProps & { pathname: string | null }) {
  const { count } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the route changes or this page is hidden by Activity.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled || open ? "bg-white/90 shadow-soft backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        {logo ?? <Logo />}

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.95rem] font-medium text-ink-700">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent-600 after:transition-transform hover:text-ink-900 hover:after:scale-x-100",
                      active ? "font-semibold text-ink-900 after:scale-x-100" : "after:scale-x-0",
                    )}
                  >
                    {item.label}
                    <PendingDot />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            aria-label={`Quote basket, ${count} item${count === 1 ? "" : "s"}`}
            className="relative grid size-11 place-items-center rounded-xl text-ink-900 ring-1 ring-ink-300/70 transition hover:-translate-y-0.5 hover:ring-ink-500/50"
          >
            <ClipboardList className="size-5" />
            {count > 0 && (
              <span className="anim-pop absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-accent-600 px-1 text-[0.65rem] font-bold text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/contact" className={buttonClasses({ size: "sm", className: "px-4 py-2.5 max-sm:hidden" })}>
            Get Free Quote
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 cursor-pointer place-items-center rounded-xl text-ink-900 ring-1 ring-ink-300/70 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="anim-fade-in h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink-100 bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-page py-6">
            <ul className="space-y-1">
              {mainNav.map((item, i) => (
                <li key={item.href} className="anim-intro" style={{ ["--d" as string]: `${i * 60}ms` }}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-4 font-display text-2xl font-bold",
                      isActive(pathname, item.href) ? "bg-accent-50 text-accent-700" : "text-ink-900 hover:bg-ink-50",
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <Link href="/contact" className={buttonClasses({ size: "lg" })}>
                Get Free Quote
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a href={telLink(phone)} className={buttonClasses({ variant: "secondary" })}>
                  <Phone className="size-4" /> Call
                </a>
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp" })}>
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
