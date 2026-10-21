import { LogOut } from "lucide-react";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions/auth";
import { AdminSidebar, AdminSidebarRoute } from "@/components/admin/sidebar";
import { getAdmin } from "@/lib/auth";
import { getNavCounts } from "@/lib/data/admin";
import { initials } from "@/lib/utils";

/**
 * Admin shell. The shell itself is static; anything that needs the session
 * (user chip, badges, page content) streams in behind Suspense boundaries.
 */
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  const sidebar = {
    badges: {
      leads: (
        <Suspense fallback={null}>
          <Badge kind="leads" />
        </Suspense>
      ),
      orders: (
        <Suspense fallback={null}>
          <Badge kind="orders" />
        </Suspense>
      ),
    },
    footer: (
      <Suspense fallback={<div className="skeleton h-12 opacity-20" />}>
        <UserChip />
      </Suspense>
    ),
  };

  return (
    <div className="min-h-dvh">
      <Suspense fallback={<AdminSidebar {...sidebar} pathname={null} />}>
        <AdminSidebarRoute {...sidebar} />
      </Suspense>
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

async function Badge({ kind }: { kind: "leads" | "orders" }) {
  const counts = await getNavCounts();
  const n = kind === "leads" ? counts.newLeads : counts.pendingOrders;
  if (!n) return null;
  return (
    <span className="grid min-w-5 place-items-center rounded-full bg-accent-600 px-1.5 text-[0.65rem] font-bold text-white">
      {n > 99 ? "99+" : n}
    </span>
  );
}

async function UserChip() {
  const admin = await getAdmin();
  if (!admin) return null;
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-600 text-xs font-bold text-white">
        {initials(admin.name)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-semibold text-white">{admin.name}</span>
        <span className="block truncate text-xs text-brand-300">{admin.email}</span>
      </span>
      <form action={signOut}>
        <button type="submit" aria-label="Sign out" title="Sign out" className="grid size-8 cursor-pointer place-items-center rounded-lg text-brand-200 hover:bg-white/10 hover:text-white">
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}
