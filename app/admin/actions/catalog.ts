"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { categorySchema, productSchema } from "@/lib/admin-validation";
import { adminDb } from "@/lib/auth";
import { bool, json, str, values } from "@/lib/form-data";
import { refreshPublic } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { fieldErrors } from "@/lib/validation";

function uniqueViolation(message: string) {
  return /duplicate key|unique/i.test(message);
}

export async function saveProduct(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = productSchema.safeParse({
    name: str(formData, "name"),
    slug: str(formData, "slug"),
    category_id: str(formData, "category_id"),
    sku: str(formData, "sku"),
    short_description: str(formData, "short_description"),
    description: str(formData, "description"),
    images: json(formData, "images", []),
    features: str(formData, "features")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    specs: json(formData, "specs", []),
    price: str(formData, "price"),
    unit: str(formData, "unit"),
    min_order_qty: str(formData, "min_order_qty") || "1",
    badge: str(formData, "badge"),
    is_featured: bool(formData, "is_featured"),
    is_active: bool(formData, "is_active"),
    sort_order: str(formData, "sort_order") || "0",
  });
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields.", values: values(formData) };
  }

  const query = id
    ? supabase.from("products").update(parsed.data).eq("id", id).select("id").single()
    : supabase.from("products").insert(parsed.data).select("id").single();
  const { data, error } = await query;
  if (error) {
    return uniqueViolation(error.message)
      ? { ok: false, errors: { slug: "Another product already uses this slug" }, message: "Slug must be unique.", values: values(formData) }
      : { ok: false, message: error.message, values: values(formData) };
  }

  refreshPublic("catalog");
  if (!id) redirect(`/admin/products/${data.id}?created=1`);
  refresh();
  return { ok: true, message: "Product saved. The website is updated." };
}

export async function toggleProduct(id: string, field: "is_active" | "is_featured", value: boolean) {
  const { supabase } = await adminDb();
  await supabase.from("products").update({ [field]: value }).eq("id", id);
  refreshPublic("catalog");
  refresh();
}

export async function deleteProduct(id: string) {
  const { supabase } = await adminDb();
  await supabase.from("products").delete().eq("id", id);
  refreshPublic("catalog");
  redirect("/admin/products");
}

export async function saveCategory(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = categorySchema.safeParse({
    name: str(formData, "name"),
    slug: str(formData, "slug"),
    tagline: str(formData, "tagline"),
    description: str(formData, "description"),
    image_url: str(formData, "image_url"),
    sort_order: str(formData, "sort_order") || "0",
    is_active: bool(formData, "is_active"),
  });
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields.", values: values(formData) };
  }
  const { error } = id
    ? await supabase.from("categories").update(parsed.data).eq("id", id)
    : await supabase.from("categories").insert(parsed.data);
  if (error) {
    return uniqueViolation(error.message)
      ? { ok: false, errors: { slug: "Another category already uses this slug" }, values: values(formData) }
      : { ok: false, message: error.message, values: values(formData) };
  }
  refreshPublic("catalog");
  refresh();
  return { ok: true, message: id ? "Category updated." : "Category added." };
}

export async function deleteCategory(id: string) {
  const { supabase } = await adminDb();
  await supabase.from("categories").delete().eq("id", id);
  refreshPublic("catalog");
  refresh();
}
