import { Printer, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteOrder } from "@/app/admin/actions/orders";
import { ConfirmAction } from "@/components/admin/client-ui";
import { OrderForm } from "@/components/admin/order-form";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { getOrder, listProductOptions } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage({ params, searchParams }: PageProps<"/admin/orders/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [order, products] = await Promise.all([getOrder(id), listProductOptions()]);
  if (!order) notFound();

  return (
    <>
      {sp.created && (
        <p role="status" className="anim-fade-in mb-4 rounded-lg bg-success-50 px-4 py-3 text-sm font-medium text-success-600 ring-1 ring-success-600/20">
          Order {order.order_number} created.
        </p>
      )}
      <PageHeader
        back={{ href: "/admin/orders", label: "Orders" }}
        title={order.order_number}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge kind="order" value={order.status} />
            <StatusBadge kind="payment" value={order.payment_status} />
            <span>Created {formatDateTime(order.created_at)}</span>
            {order.lead_id && (
              <Link href={`/admin/leads/${order.lead_id}`} className="font-semibold text-brand-700 hover:underline">
                View lead
              </Link>
            )}
          </span>
        }
        actions={
          <>
            <ConfirmAction action={deleteOrder.bind(null, order.id)} confirm={`Delete order ${order.order_number}? This cannot be undone.`}>
              <Trash2 className="size-4" /> Delete
            </ConfirmAction>
            <Link
              href={`/admin/orders/${order.id}/invoice`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50"
            >
              <Printer className="size-4" /> Proforma invoice
            </Link>
          </>
        }
      />
      <OrderForm order={order} products={products} />
    </>
  );
}
