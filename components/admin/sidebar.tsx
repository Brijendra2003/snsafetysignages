"use client";

import {
  Building2,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Sales",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/leads", label: "Leads", icon: Inbox, badge: "leads" as const },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "orders" as const },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tags },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/clients", label: "Clients", icon: Building2 },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

type SidebarProps = { badges: Record<"leads" | "orders", ReactNode>; footer: ReactNode };

/** Reads the URL for the active link; render inside <Suspense> with <AdminSidebar pathname={null}> as fallback. */
export function AdminSidebarRoute(props: SidebarProps) {
  return <AdminSidebar {...props} pathname={usePathname()} />;
}

export function AdminSidebar({ badges, footer, pathname }: SidebarProps & { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="px-3 text-[0.65rem] font-bold tracking-[0.18em] text-brand-300/70 uppercase">{g.label}</p>
          <ul className="mt-2 space-y-0.5">
            {g.items.map((item) => {
              const active = pathname !== null && ("exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      active ? "bg-white/10 text-white" : "text-brand-200 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className={cn("size-4.5", active && "text-accent-300")} />
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge && badges[item.badge]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
      <span className="grid size-10 place-items-center rounded-xl bg-white p-1">
        <Image src="/brand/mark.png" alt="" width={400} height={304} className="h-auto w-full" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-extrabold text-white">SN Safety</span>
        <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-brand-300 uppercase">Admin</span>
      </span>
    </Link>
  );

  const bottom = (
    <div className="space-y-1 border-t border-white/10 p-3">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-200 hover:bg-white/5 hover:text-white">
        <ExternalLink className="size-4.5" /> View website
      </Link>
      {footer}
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-brand-950 px-3 lg:hidden print:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-white p-0.5">
            <Image src="/brand/mark.png" alt="" width={400} height={304} className="h-auto w-full" />
          </span>
          <span className="font-display font-extrabold text-white">SN Admin</span>
        </Link>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-10 cursor-pointer place-items-center rounded-lg text-white">
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="anim-fade-in absolute inset-0 bg-ink-900/60" />
          <aside className="anim-intro absolute inset-y-0 left-0 flex w-72 flex-col bg-brand-950">
            <div className="flex items-center justify-between pr-3">
              {brand}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-9 cursor-pointer place-items-center rounded-lg text-brand-200">
                <X className="size-5" />
              </button>
            </div>
            {nav}
            {bottom}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-950 lg:flex print:hidden">
        {brand}
        {nav}
        {bottom}
      </aside>
    </>
  );
}
