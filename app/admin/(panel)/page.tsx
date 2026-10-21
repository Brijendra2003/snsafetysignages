import { ArrowRight, Inbox, IndianRupee, Package, Plus, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LeadsChart } from "@/components/admin/leads-chart";
import { Card, PageHeader, StatusBadge, td, th } from "@/components/admin/ui";
import { getAdmin } from "@/lib/auth";
import { getDashboard } from "@/lib/data/admin";
import { LEAD_STATUSES } from "@/lib/types";
import { formatDateTime, formatINR, titleCase } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

function Stat({ label, value, hint, icon: Icon, href }: { label: string; value: string; hint?: string; icon: typeof Inbox; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-accent-600 group-hover:text-white">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </Link>
  );
}

export default async function DashboardPage() {
  const [admin, d] = await Promise.all([getAdmin(), getDashboard()]);
  const hour = Number(new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const maxStatus = Math.max(...Object.values(d.statusCounts), 1);

  return (
    <>
      <PageHeader
        title={`${greeting}, ${admin?.name ?? "Admin"}`}
        description="Here's what's happening with SN Safety & Signages."
        actions={
          <>
            <Link href="/admin/leads/new" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50">
              <Plus className="size-4" /> Add lead
            </Link>
            <Link href="/admin/orders/new" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-700">
              <Plus className="size-4" /> New order
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New leads" value={String(d.newLeads)} hint="Waiting for first contact" icon={Inbox} href="/admin/leads?status=new" />
        <Stat label="Open orders" value={String(d.openOrders)} hint="Pending to dispatched" icon={ShoppingCart} href="/admin/orders" />
        <Stat
          label="Order value this month"
          value={formatINR(d.revenue)}
          hint={`${d.monthOrders} orders · ${formatINR(d.collected)} received`}
          icon={IndianRupee}
          href="/admin/orders"
        />
        <Stat label="Live products" value={String(d.activeProducts)} hint="Visible on the website" icon={Package} href="/admin/products" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Leads, last 14 days" actions={<span className="text-sm font-semibold text-ink-900">{d.leads14} total</span>}>
          <LeadsChart data={d.leadsByDay} />
        </Card>
        <Card title="Lead pipeline" actions={<span className="text-sm text-ink-500">{d.conversionRate}% converted</span>}>
          <ul className="space-y-3.5">
            {LEAD_STATUSES.map((s) => (
              <li key={s}>
                <Link href={`/admin/leads?status=${s}`} className="group block">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-700 group-hover:text-ink-900">{titleCase(s)}</span>
                    <span className="font-semibold text-ink-900 tabular-nums">{d.statusCounts[s]}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-brand-50">
                    <div className="h-2 rounded-full bg-brand-600 transition-all group-hover:bg-brand-800" style={{ width: `${(d.statusCounts[s] / maxStatus) * 100}%` }} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-ink-100 pt-4 text-xs text-ink-500">{d.totalLeads} leads all time</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card
          title="Latest leads"
          bodyClassName="p-0"
          actions={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              All leads <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {d.recentLeads.length ? (
            <table className="w-full text-sm">
              <thead className="bg-ink-50">
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Source</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {d.recentLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-ink-50">
                    <td className={td}>
                      <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink-900 hover:text-accent-700">
                        {l.name}
                      </Link>
                      <p className="text-xs text-ink-500">{l.company || l.phone}</p>
                    </td>
                    <td className={`${td} text-ink-500`}>{titleCase(l.source)}</td>
                    <td className={td}>
                      <StatusBadge kind="lead" value={l.status} />
                    </td>
                    <td className={`${td} text-right text-xs whitespace-nowrap text-ink-500`}>{formatDateTime(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-sm text-ink-500">No leads yet. They&apos;ll appear here when visitors submit a form.</p>
          )}
        </Card>

        <Card
          title="Latest orders"
          bodyClassName="p-0"
          actions={
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              All orders <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {d.recentOrders.length ? (
            <table className="w-full text-sm">
              <thead className="bg-ink-50">
                <tr>
                  <th className={th}>Order</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {d.recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-ink-50">
                    <td className={td}>
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-ink-900 hover:text-accent-700">
                        {o.order_number}
                      </Link>
                      <p className="text-xs text-ink-500">{o.company || o.customer_name}</p>
                    </td>
                    <td className={td}>
                      <StatusBadge kind="order" value={o.status} />
                    </td>
                    <td className={`${td} text-right font-semibold text-ink-900 tabular-nums`}>{formatINR(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-sm text-ink-500">No orders yet. Convert a lead or create one manually.</p>
          )}
        </Card>
      </div>
    </>
  );
}
