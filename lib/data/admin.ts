import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/auth";
import type {
  Category,
  Client,
  Lead,
  LeadStatus,
  Order,
  OrderStatus,
  OrderWithItems,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import { seedSettings } from "@/lib/seed";

/**
 * Admin reads. Every function verifies the admin session first (adminDb), and
 * Row Level Security enforces the same rule again inside Postgres.
 */

export const PAGE_SIZE = 20;

function range(page: number) {
  const from = (Math.max(1, page) - 1) * PAGE_SIZE;
  return [from, from + PAGE_SIZE - 1] as const;
}

function escapeLike(value: string) {
  return value.replace(/[%_,()]/g, " ").trim();
}

/* ---------- Dashboard ---------- */

export async function getDashboard() {
  const { supabase } = await adminDb();
  const now = new Date();
  const since14 = new Date(now);
  since14.setDate(now.getDate() - 13);
  since14.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [leads14, leadStatus, newLeads, openOrders, monthOrders, productCount, recentLeads, recentOrders] =
    await Promise.all([
      supabase.from("leads").select("created_at").gte("created_at", since14.toISOString()),
      supabase.from("leads").select("status"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "confirmed", "in_production", "dispatched"]),
      supabase.from("orders").select("total, amount_paid, status").gte("created_at", monthStart.toISOString()),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(6),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
    ]);

  // Leads per day for the last 14 days (IST calendar days)
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const days: { key: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push({
      key: dayKey(d),
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }),
      count: 0,
    });
  }
  for (const row of leads14.data ?? []) {
    const day = days.find((d) => d.key === dayKey(new Date(row.created_at)));
    if (day) day.count++;
  }

  const statusCounts: Record<LeadStatus, number> = { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
  for (const row of leadStatus.data ?? []) statusCounts[row.status as LeadStatus]++;
  const totalLeads = (leadStatus.data ?? []).length;

  const billable = (monthOrders.data ?? []).filter((o) => o.status !== "cancelled");
  const revenue = billable.reduce((sum, o) => sum + Number(o.total), 0);
  const collected = billable.reduce((sum, o) => sum + Number(o.amount_paid), 0);

  return {
    leadsByDay: days,
    leads14: days.reduce((s, d) => s + d.count, 0),
    statusCounts,
    totalLeads,
    conversionRate: totalLeads ? Math.round((statusCounts.converted / totalLeads) * 100) : 0,
    newLeads: newLeads.count ?? 0,
    openOrders: openOrders.count ?? 0,
    monthOrders: billable.length,
    revenue,
    collected,
    activeProducts: productCount.count ?? 0,
    recentLeads: (recentLeads.data ?? []) as Lead[],
    recentOrders: (recentOrders.data ?? []) as Order[],
  };
}

/** Counts for the sidebar badges. */
export const getNavCounts = cache(async () => {
  const { supabase } = await adminDb();
  const [leads, orders] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return { newLeads: leads.count ?? 0, pendingOrders: orders.count ?? 0 };
});

/* ---------- Leads ---------- */

export async function listLeads({ q, status, source, page = 1 }: { q?: string; status?: string; source?: string; page?: number }) {
  const { supabase } = await adminDb();
  const [from, to] = range(page);
  let query = supabase.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (q) {
    const s = escapeLike(q);
    query = query.or(`name.ilike.%${s}%,phone.ilike.%${s}%,email.ilike.%${s}%,company.ilike.%${s}%,subject.ilike.%${s}%`);
  }
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as Lead[], count: count ?? 0 };
}

export async function getLead(id: string) {
  const { supabase } = await adminDb();
  const [{ data: lead }, { data: orders }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase.from("orders").select("id, order_number, status, total, created_at").eq("lead_id", id),
  ]);
  return lead ? { lead: lead as Lead, orders: (orders ?? []) as Pick<Order, "id" | "order_number" | "status" | "total" | "created_at">[] } : null;
}

/* ---------- Orders ---------- */

export async function listOrders({ q, status, page = 1 }: { q?: string; status?: string; page?: number }) {
  const { supabase } = await adminDb();
  const [from, to] = range(page);
  let query = supabase.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  if (status) query = query.eq("status", status as OrderStatus);
  if (q) {
    const s = escapeLike(q);
    query = query.or(`order_number.ilike.%${s}%,customer_name.ilike.%${s}%,company.ilike.%${s}%,phone.ilike.%${s}%`);
  }
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as Order[], count: count ?? 0 };
}

export async function getOrder(id: string): Promise<OrderWithItems | null> {
  const { supabase } = await adminDb();
  const { data } = await supabase.from("orders").select("*, items:order_items(*)").eq("id", id).maybeSingle();
  if (!data) return null;
  const order = data as OrderWithItems;
  order.items = [...(order.items ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return order;
}

/* ---------- Catalogue ---------- */

export async function listProducts({ q, category, page = 1 }: { q?: string; category?: string; page?: number }) {
  const { supabase } = await adminDb();
  const [from, to] = range(page);
  let query = supabase
    .from("products")
    .select("*, category:categories(id, name, slug)", { count: "exact" })
    .order("sort_order")
    .order("name")
    .range(from, to);
  if (category) query = query.eq("category_id", category);
  if (q) {
    const s = escapeLike(q);
    query = query.or(`name.ilike.%${s}%,sku.ilike.%${s}%,slug.ilike.%${s}%`);
  }
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as (Product & { category: Pick<Category, "id" | "name" | "slug"> | null })[], count: count ?? 0 };
}

export async function getProduct(id: string) {
  const { supabase } = await adminDb();
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product | null) ?? null;
}

/** Light product list for pickers (order items). */
export async function listProductOptions() {
  const { supabase } = await adminDb();
  const { data } = await supabase.from("products").select("id, name, price, unit").order("name");
  return (data ?? []) as Pick<Product, "id" | "name" | "price" | "unit">[];
}

export async function listCategories() {
  const { supabase } = await adminDb();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").order("name"),
    supabase.from("products").select("category_id"),
  ]);
  const counts = new Map<string, number>();
  for (const p of products ?? []) if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  return ((categories ?? []) as Category[]).map((c) => ({ ...c, product_count: counts.get(c.id) ?? 0 }));
}

/* ---------- Content ---------- */

export async function listClients() {
  const { supabase } = await adminDb();
  const { data } = await supabase.from("clients").select("*").order("sort_order").order("name");
  return (data ?? []) as Client[];
}

export async function listTestimonials() {
  const { supabase } = await adminDb();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  return (data ?? []) as Testimonial[];
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const { supabase } = await adminDb();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { ...seedSettings, ...(data ?? {}) } as SiteSettings;
}
