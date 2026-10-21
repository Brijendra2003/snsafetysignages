"use client";

import { Plus, Trash2 } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { saveOrder } from "@/app/admin/actions/orders";
import { FormMessage, SubmitButton } from "@/components/admin/client-ui";
import { adminInput, Card, Field } from "@/components/admin/ui";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type ActionState,
  type Lead,
  type OrderWithItems,
  type Product,
} from "@/lib/types";
import { cn, formatINR, titleCase } from "@/lib/utils";

type ItemRow = { key: number; product_id: string; product_name: string; description: string; quantity: number; unit_price: number };
type ProductOption = Pick<Product, "id" | "name" | "price" | "unit">;

const initial: ActionState = { ok: false };
let keySeq = 0;

function toRows(order?: OrderWithItems, lead?: Lead | null, products: ProductOption[] = []): ItemRow[] {
  if (order?.items.length) {
    return order.items.map((i) => ({
      key: keySeq++,
      product_id: i.product_id ?? "",
      product_name: i.product_name,
      description: i.description ?? "",
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
    }));
  }
  if (lead?.items.length) {
    return lead.items.map((i) => {
      const p = products.find((p) => p.id === i.product_id);
      return {
        key: keySeq++,
        product_id: p?.id ?? "",
        product_name: i.name,
        description: "",
        quantity: i.quantity,
        unit_price: Number(p?.price ?? 0),
      };
    });
  }
  return [{ key: keySeq++, product_id: "", product_name: "", description: "", quantity: 1, unit_price: 0 }];
}

export function OrderForm({ order, lead, products }: { order?: OrderWithItems; lead?: Lead | null; products: ProductOption[] }) {
  const [state, action] = useActionState(saveOrder.bind(null, order?.id ?? null), initial);
  const e = state.errors ?? {};
  const v = state.values;

  const [items, setItems] = useState<ItemRow[]>(() => toRows(order, lead, products));
  const [taxRate, setTaxRate] = useState(Number(v?.tax_rate ?? order?.tax_rate ?? 18));
  const [shipping, setShipping] = useState(Number(v?.shipping_fee ?? order?.shipping_fee ?? 0));

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + (i.quantity || 0) * (i.unit_price || 0), 0);
    const tax = (subtotal * (taxRate || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax + (shipping || 0) };
  }, [items, taxRate, shipping]);

  const update = (key: number, patch: Partial<ItemRow>) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const def = <K extends keyof OrderWithItems>(k: K, fallback: string | number = "") =>
    v?.[k as string] ?? (order?.[k] as string | number | null | undefined) ?? fallback;

  const payload = items.map(({ product_id, product_name, description, quantity, unit_price }) => ({
    product_id: product_id || null,
    product_name,
    description,
    quantity,
    unit_price,
  }));

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="items" value={JSON.stringify(payload)} />
      <input type="hidden" name="lead_id" value={order?.lead_id ?? lead?.id ?? ""} />

      <div className="space-y-6">
        <Card title="Customer">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer name" name="customer_name" error={e.customer_name} required>
              <input id="customer_name" name="customer_name" defaultValue={def("customer_name", lead?.name ?? "")} className={adminInput} aria-invalid={!!e.customer_name} />
            </Field>
            <Field label="Company" name="company" error={e.company}>
              <input id="company" name="company" defaultValue={def("company", lead?.company ?? "")} className={adminInput} />
            </Field>
            <Field label="Phone" name="phone" error={e.phone}>
              <input id="phone" name="phone" defaultValue={def("phone", lead?.phone ?? "")} className={adminInput} />
            </Field>
            <Field label="Email" name="email" error={e.email}>
              <input id="email" name="email" type="email" defaultValue={def("email", lead?.email ?? "")} className={adminInput} aria-invalid={!!e.email} />
            </Field>
            <Field label="GSTIN" name="gstin" error={e.gstin}>
              <input id="gstin" name="gstin" defaultValue={def("gstin")} className={cn(adminInput, "uppercase")} />
            </Field>
            <Field label="Expected dispatch" name="expected_dispatch" error={e.expected_dispatch}>
              <input id="expected_dispatch" name="expected_dispatch" type="date" defaultValue={def("expected_dispatch")} className={adminInput} />
            </Field>
            <Field label="Shipping address" name="shipping_address" error={e.shipping_address} className="sm:col-span-2">
              <textarea id="shipping_address" name="shipping_address" rows={2} defaultValue={def("shipping_address", lead?.city ?? "")} className={adminInput} />
            </Field>
          </div>
        </Card>

        <Card title="Items" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500 uppercase">Product / description</th>
                  <th className="w-24 px-2 py-2.5 text-left text-xs font-semibold text-ink-500 uppercase">Qty</th>
                  <th className="w-32 px-2 py-2.5 text-left text-xs font-semibold text-ink-500 uppercase">Rate (₹)</th>
                  <th className="w-28 px-2 py-2.5 text-right text-xs font-semibold text-ink-500 uppercase">Amount</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {items.map((item, idx) => (
                  <tr key={item.key} className="align-top">
                    <td className="space-y-2 px-4 py-3">
                      <select
                        aria-label={`Item ${idx + 1} product`}
                        value={item.product_id}
                        onChange={(ev) => {
                          const p = products.find((p) => p.id === ev.target.value);
                          update(item.key, {
                            product_id: ev.target.value,
                            product_name: p?.name ?? item.product_name,
                            unit_price: p?.price != null ? Number(p.price) : item.unit_price,
                          });
                        }}
                        className={cn(adminInput, "cursor-pointer")}
                      >
                        <option value="">Custom item</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label={`Item ${idx + 1} name`}
                        value={item.product_name}
                        onChange={(ev) => update(item.key, { product_name: ev.target.value })}
                        placeholder="Item name as it appears on the invoice"
                        className={adminInput}
                      />
                      <input
                        aria-label={`Item ${idx + 1} description`}
                        value={item.description}
                        onChange={(ev) => update(item.key, { description: ev.target.value })}
                        placeholder="Size / material (optional)"
                        className={cn(adminInput, "text-xs")}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input
                        aria-label={`Item ${idx + 1} quantity`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(ev) => update(item.key, { quantity: Math.max(1, Number(ev.target.value) || 1) })}
                        className={adminInput}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input
                        aria-label={`Item ${idx + 1} rate`}
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unit_price}
                        onChange={(ev) => update(item.key, { unit_price: Math.max(0, Number(ev.target.value) || 0) })}
                        className={adminInput}
                      />
                    </td>
                    <td className="px-2 py-3 pt-5 text-right font-semibold whitespace-nowrap text-ink-900 tabular-nums">
                      {formatINR(item.quantity * item.unit_price)}
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        disabled={items.length === 1}
                        onClick={() => setItems((prev) => prev.filter((i) => i.key !== item.key))}
                        aria-label={`Remove item ${idx + 1}`}
                        className="grid size-9 cursor-pointer place-items-center rounded-lg text-ink-400 hover:bg-accent-50 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, { key: keySeq++, product_id: "", product_name: "", description: "", quantity: 1, unit_price: 0 }])}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              <Plus className="size-4" /> Add item
            </button>
            {(e.items || Object.keys(e).some((k) => k.startsWith("items."))) && (
              <p className="text-xs font-medium text-accent-700">
                {e.items ?? Object.entries(e).find(([k]) => k.startsWith("items."))?.[1]}
              </p>
            )}
          </div>
        </Card>

        <Card title="Internal notes">
          <textarea name="notes" rows={3} defaultValue={def("notes")} aria-label="Internal notes" className={adminInput} placeholder="Artwork approval, special instructions…" />
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <Card title="Status">
          <div className="grid gap-4">
            <Field label="Order status" name="status">
              <select id="status" name="status" defaultValue={def("status", "pending")} className={cn(adminInput, "cursor-pointer")}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {titleCase(s)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Payment" name="payment_status">
              <select id="payment_status" name="payment_status" defaultValue={def("payment_status", "unpaid")} className={cn(adminInput, "cursor-pointer")}>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {titleCase(s)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount received (₹)" name="amount_paid" error={e.amount_paid}>
              <input id="amount_paid" name="amount_paid" type="number" min={0} step="0.01" defaultValue={def("amount_paid", 0)} className={adminInput} />
            </Field>
          </div>
        </Card>

        <Card title="Summary">
          <div className="grid grid-cols-2 gap-3">
            <Field label="GST %" name="tax_rate" error={e.tax_rate}>
              <input id="tax_rate" name="tax_rate" type="number" min={0} max={100} step="0.01" value={taxRate} onChange={(ev) => setTaxRate(Number(ev.target.value))} className={adminInput} />
            </Field>
            <Field label="Shipping (₹)" name="shipping_fee" error={e.shipping_fee}>
              <input id="shipping_fee" name="shipping_fee" type="number" min={0} step="0.01" value={shipping} onChange={(ev) => setShipping(Number(ev.target.value))} className={adminInput} />
            </Field>
          </div>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-ink-500">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatINR(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-500">
              <dt>GST ({taxRate || 0}%)</dt>
              <dd className="tabular-nums">{formatINR(totals.tax)}</dd>
            </div>
            <div className="flex justify-between text-ink-500">
              <dt>Shipping</dt>
              <dd className="tabular-nums">{formatINR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatINR(totals.total)}</dd>
            </div>
          </dl>
          <div className="mt-5 space-y-3">
            <FormMessage state={state} />
            <SubmitButton className="w-full">{order ? "Save order" : "Create order"}</SubmitButton>
          </div>
        </Card>
      </div>
    </form>
  );
}
