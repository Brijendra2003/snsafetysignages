"use server";

import { refresh } from "next/cache";
import { clientSchema, settingsSchema, testimonialSchema } from "@/lib/admin-validation";
import { adminDb } from "@/lib/auth";
import { bool, json, str, values } from "@/lib/form-data";
import { refreshPublic } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { fieldErrors } from "@/lib/validation";

export async function saveClient(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = clientSchema.safeParse({
    name: str(formData, "name"),
    logo_url: str(formData, "logo_url"),
    website: str(formData, "website"),
    sort_order: str(formData, "sort_order") || "0",
    is_active: bool(formData, "is_active"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), values: values(formData) };
  const { error } = id
    ? await supabase.from("clients").update(parsed.data).eq("id", id)
    : await supabase.from("clients").insert(parsed.data);
  if (error) return { ok: false, message: error.message, values: values(formData) };
  refreshPublic("clients");
  refresh();
  return { ok: true, message: id ? "Client updated." : "Client added." };
}

export async function deleteClient(id: string) {
  const { supabase } = await adminDb();
  await supabase.from("clients").delete().eq("id", id);
  refreshPublic("clients");
  refresh();
}

export async function saveTestimonial(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = testimonialSchema.safeParse({
    name: str(formData, "name"),
    role: str(formData, "role"),
    company: str(formData, "company"),
    quote: str(formData, "quote"),
    rating: str(formData, "rating") || "5",
    avatar_url: str(formData, "avatar_url"),
    sort_order: str(formData, "sort_order") || "0",
    is_active: bool(formData, "is_active"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), values: values(formData) };
  const { error } = id
    ? await supabase.from("testimonials").update(parsed.data).eq("id", id)
    : await supabase.from("testimonials").insert(parsed.data);
  if (error) return { ok: false, message: error.message, values: values(formData) };
  refreshPublic("testimonials");
  refresh();
  return { ok: true, message: id ? "Testimonial updated." : "Testimonial added." };
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await adminDb();
  await supabase.from("testimonials").delete().eq("id", id);
  refreshPublic("testimonials");
  refresh();
}

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = settingsSchema.safeParse({
    phone: str(formData, "phone"),
    phone_alt: str(formData, "phone_alt"),
    whatsapp: str(formData, "whatsapp"),
    email: str(formData, "email"),
    address: str(formData, "address"),
    map_query: str(formData, "map_query"),
    hours: str(formData, "hours"),
    announcement: str(formData, "announcement"),
    facebook_url: str(formData, "facebook_url"),
    instagram_url: str(formData, "instagram_url"),
    linkedin_url: str(formData, "linkedin_url"),
    youtube_url: str(formData, "youtube_url"),
    catalog_url: str(formData, "catalog_url"),
    stats: json(formData, "stats", []),
  });
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields.", values: values(formData) };
  }
  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...parsed.data });
  if (error) return { ok: false, message: error.message, values: values(formData) };
  refreshPublic("settings");
  refresh();
  return { ok: true, message: "Settings saved. The website is updated." };
}
