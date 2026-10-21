"use server";

import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { ActionState } from "@/lib/types";
import { fieldErrors, leadSchema } from "@/lib/validation";

/**
 * Public lead capture used by the contact form, quote basket and product
 * enquiry forms. Bots are filtered with a honeypot field ("website").
 */
export async function submitLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (formData.get("website")) {
    // Honeypot filled: pretend success so bots move on.
    return { ok: true, message: "Thanks! We'll be in touch shortly." };
  }

  const values: Record<string, string> = {};
  for (const key of ["name", "phone", "email", "company", "city", "subject", "message"]) {
    values[key] = String(formData.get(key) ?? "");
  }

  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("items") || "[]"));
  } catch {
    items = [];
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    company: formData.get("company") || undefined,
    city: formData.get("city") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message") || undefined,
    source: formData.get("source") || "contact",
    items,
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }

  if (!isSupabaseConfigured) {
    console.warn("[submitLead] Supabase is not configured; lead not stored:", parsed.data);
    return {
      ok: false,
      message: "Our enquiry system is being set up. Please call or WhatsApp us for now.",
      values,
    };
  }

  const { error } = await createPublicClient()
    .from("leads")
    .insert({ ...parsed.data, status: "new" });

  if (error) {
    console.error("[submitLead]", error.message);
    return { ok: false, message: "Something went wrong. Please try again or call us directly.", values };
  }

  return {
    ok: true,
    message: "Thank you! Our team will call you back within one working day.",
  };
}
