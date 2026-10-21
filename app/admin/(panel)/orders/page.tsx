import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { setOrderStatus } from "@/app/admin/actions/orders";
import { StatusSelect } from "@/components/admin/client-ui";
import { EmptyState, FilterBar, PageHeader, Pagination, StatusBadge, TableWrap, td, th } from "@/components/admin/ui";
import { listOrders, PAGE_SIZE } from "@/lib/data/admin";
import { ORDER_STATUSES } from "@/lib/types";
import { formatDate, formatINR, titleCase } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const status = typeof sp.status === "string" && sp.status ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, count } = await listOrders({ q, status, page });

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track orders from confirmation to delivery."
        actions={
          <Link href="/admin/orders/new" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-700">
            <Plus className="size-4" /> New order
          </Link>
        }
      />
      <FilterBar
        q={q}
        placeholder="Search order no., customer, company, phone…"
        selects={[{ name: "status", value: status, label: "All statuses", options: ORDER_STATUSES.map((s) => ({ value: s, label: titleCase(s) })) }]}
      />
      <TableWrap>
        {rows.length ? (
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-ink-50">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Customer</th>
                <th className={th}>Status</th>
                <th className={th}>Payment</th>
                <th className={th}>Dispatch by</th>
                <th className={`${th} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-ink-50">
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-semibold text-ink-900 hover:text-accent-700">
                      {o.order_number}
                    </Link>
                    <p className="text-xs text-ink-500">{formatDate(o.created_at)}</p>
                  </td>
                  <td className={td}>
                    <p className="font-medium text-ink-900">{o.customer_name}</p>
                    {o.company && <p className="text-xs text-ink-500">{o.company}</p>}
                  </td>
                  <td className={td}>
                    <StatusSelect value={o.status} options={ORDER_STATUSES} label={`Status for ${o.order_number}`} action={setOrderStatus.bind(null, o.id)} />
                  </td>
                  <td className={td}>
                    <StatusBadge kind="payment" value={o.payment_status} />
                  </td>
                  <td className={`${td} text-ink-500`}>{formatDate(o.expected_dispatch)}</td>
                  <td className={`${td} text-right font-semibold text-ink-900 tabular-nums`}>{formatINR(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="No orders found"
            text={q || status ? "Try clearing the filters." : "Create an order, or convert a lead from its detail page."}
          />
        )}
      </TableWrap>
      <Pagination page={page} count={count} pageSize={PAGE_SIZE} params={{ q, status }} />
    </>
  );
}
