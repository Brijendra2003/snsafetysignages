"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { orderSchema } from "@/lib/admin-validation";
import { adminDb } from "@/lib/auth";
import { json, str, values } from "@/lib/form-data";
import { ORDER_STATUSES, type ActionState, type OrderStatus } from "@/lib/types";
import { fieldErrors } from "@/lib/validation";

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Create (id = null) or update an order together with its line items. */
export async function saveOrder(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();

  const parsed = orderSchema.safeParse({
    lead_id: str(formData, "lead_id"),
    customer_name: str(formData, "customer_name"),
    company: str(formData, "company"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    gstin: str(formData, "gstin"),
    shipping_address: str(formData, "shipping_address"),
    status: str(formData, "status") || "pending",
    payment_status: str(formData, "payment_status") || "unpaid",
    tax_rate: str(formData, "tax_rate") || "18",
    shipping_fee: str(formData, "shipping_fee") || "0",
    amount_paid: str(formData, "amount_paid") || "0",
    expected_dispatch: str(formData, "expected_dispatch"),
    notes: str(formData, "notes"),
    items: json(formData, "items", []),
  });
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields.", values: values(formData) };
  }

  const { items, ...order } = parsed.data;
  // Totals are always computed on the server from the line items.
  const subtotal = round2(items.reduce((s, i) => s + i.quantity * i.unit_price, 0));
  const tax_amount = round2((subtotal * order.tax_rate) / 100);
  const total = round2(subtotal + tax_amount + order.shipping_fee);
  const row = { ...order, subtotal, tax_amount, total };

  let orderId = id;
  if (id) {
    const { error } = await supabase.from("orders").update(row).eq("id", id);
    if (error) return { ok: false, message: error.message, values: values(formData) };
    const { error: delError } = await supabase.from("order_items").delete().eq("order_id", id);
    if (delError) return { ok: false, message: delError.message, values: values(formData) };
  } else {
    const { data, error } = await supabase.from("orders").insert({ ...row, order_number: "" }).select("id").single();
    if (error) return { ok: false, message: error.message, values: values(formData) };
    orderId = data.id;
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((item, i) => ({ ...item, order_id: orderId, sort_order: i })));
  if (itemsError) return { ok: false, message: itemsError.message, values: values(formData) };

  // Converting a lead into an order closes the loop on the lead.
  if (!id && order.lead_id) {
    await supabase.from("leads").update({ status: "converted" }).eq("id", order.lead_id);
  }

  if (!id) redirect(`/admin/orders/${orderId}?created=1`);
  refresh();
  return { ok: true, message: "Order saved." };
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) return;
  const { supabase } = await adminDb();
  await supabase.from("orders").update({ status }).eq("id", id);
  refresh();
}

export async function deleteOrder(id: string) {
  const { supabase } = await adminDb();
  await supabase.from("orders").delete().eq("id", id);
  redirect("/admin/orders");
}
