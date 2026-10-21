import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrintButton } from "@/components/admin/print-button";
import { getOrder } from "@/lib/data/admin";
import { getSettings } from "@/lib/data/public";
import { site } from "@/lib/site";
import { formatDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Proforma invoice" };

export default function InvoicePage({ params }: PageProps<"/admin/orders/[id]/invoice">) {
  return (
    <Suspense fallback={<div className="skeleton m-8 h-[80vh]" />}>
      <Invoice params={params} />
    </Suspense>
  );
}

async function Invoice({ params }: Pick<PageProps<"/admin/orders/[id]/invoice">, "params">) {
  const { id } = await params;
  const [order, settings] = await Promise.all([getOrder(id), getSettings()]);
  if (!order) notFound();

  return (
    <div className="min-h-dvh bg-ink-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-3xl justify-end px-4 print:hidden">
        <PrintButton />
      </div>
      <article className="mx-auto max-w-3xl bg-white p-8 text-sm text-ink-700 shadow-lift sm:p-12 print:max-w-none print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6 border-b-4 border-accent-600 pb-6">
          <div>
            <Image src="/brand/logo.png" alt={site.name} width={640} height={414} className="h-16 w-auto" />
            <p className="mt-3 max-w-xs text-xs leading-relaxed">{settings.address}</p>
            <p className="mt-1 text-xs">
              {settings.phone} · {settings.email}
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-extrabold">Proforma Invoice</h1>
            <p className="mt-2 font-semibold text-ink-900">{order.order_number}</p>
            <p className="text-xs">Date: {formatDate(order.created_at)}</p>
            {order.expected_dispatch && <p className="text-xs">Dispatch by: {formatDate(order.expected_dispatch)}</p>}
          </div>
        </header>

        <section className="grid gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-wider text-ink-500 uppercase">Bill to</p>
            <p className="mt-1.5 font-semibold text-ink-900">{order.company || order.customer_name}</p>
            {order.company && <p>Attn: {order.customer_name}</p>}
            {order.shipping_address && <p className="whitespace-pre-line">{order.shipping_address}</p>}
            {order.phone && <p>{order.phone}</p>}
            {order.email && <p>{order.email}</p>}
            {order.gstin && <p className="mt-1 font-semibold">GSTIN: {order.gstin}</p>}
          </div>
        </section>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-950 text-white">
              <th className="px-3 py-2 text-left font-semibold">#</th>
              <th className="px-3 py-2 text-left font-semibold">Item</th>
              <th className="px-3 py-2 text-right font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Rate</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={item.id ?? i} className="border-b border-ink-200">
                <td className="px-3 py-2.5 align-top">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <p className="font-semibold text-ink-900">{item.product_name}</p>
                  {item.description && <p className="text-xs text-ink-500">{item.description}</p>}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{item.quantity}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatINR(item.unit_price)}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{formatINR(item.quantity * Number(item.unit_price))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <dl className="w-64 space-y-1.5">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatINR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>GST ({Number(order.tax_rate)}%)</dt>
              <dd className="tabular-nums">{formatINR(order.tax_amount)}</dd>
            </div>
            {Number(order.shipping_fee) > 0 && (
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="tabular-nums">{formatINR(order.shipping_fee)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-ink-900 pt-2 text-base font-extrabold text-ink-900">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatINR(order.total)}</dd>
            </div>
            {Number(order.amount_paid) > 0 && (
              <>
                <div className="flex justify-between text-success-600">
                  <dt>Received</dt>
                  <dd className="tabular-nums">− {formatINR(order.amount_paid)}</dd>
                </div>
                <div className="flex justify-between font-bold text-ink-900">
                  <dt>Balance due</dt>
                  <dd className="tabular-nums">{formatINR(Number(order.total) - Number(order.amount_paid))}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        <footer className="mt-12 grid gap-6 border-t border-ink-200 pt-6 text-xs sm:grid-cols-2">
          <div>
            <p className="font-bold text-ink-900">Terms</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>This is a proforma invoice, not a tax invoice.</li>
              <li>Prices are valid for 15 days from the date above.</li>
              <li>Dispatch after artwork approval and advance payment.</li>
            </ul>
          </div>
          <div className="text-right">
            <p className="mt-10 font-semibold text-ink-900">For {site.legalName}</p>
            <p className="text-ink-500">Authorised signatory</p>
          </div>
        </footer>
      </article>
    </div>
  );
}
