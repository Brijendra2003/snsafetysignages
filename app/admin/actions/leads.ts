"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { manualLeadSchema, leadUpdateSchema } from "@/lib/admin-validation";
import { adminDb } from "@/lib/auth";
import { str, values } from "@/lib/form-data";
import { LEAD_STATUSES, type ActionState, type LeadStatus } from "@/lib/types";
import { fieldErrors } from "@/lib/validation";

export async function updateLead(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = leadUpdateSchema.safeParse({ status: str(formData, "status"), notes: str(formData, "notes") });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Check the fields." };

  const { error } = await supabase.from("leads").update(parsed.data).eq("id", id);
  if (error) return { ok: false, message: error.message };
  refresh();
  return { ok: true, message: "Lead updated." };
}

/** One-click status change from the leads table. */
export async function setLeadStatus(id: string, status: LeadStatus) {
  if (!LEAD_STATUSES.includes(status)) return;
  const { supabase } = await adminDb();
  await supabase.from("leads").update({ status }).eq("id", id);
  refresh();
}

export async function createLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminDb();
  const parsed = manualLeadSchema.safeParse({
    name: str(formData, "name"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    company: str(formData, "company"),
    city: str(formData, "city"),
    subject: str(formData, "subject"),
    message: str(formData, "message"),
    source: str(formData, "source") || "manual",
    status: str(formData, "status") || "new",
  });
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields.", values: values(formData) };
  }
  const { data, error } = await supabase.from("leads").insert(parsed.data).select("id").single();
  if (error) return { ok: false, message: error.message, values: values(formData) };
  redirect(`/admin/leads/${data.id}`);
}

export async function deleteLead(id: string) {
  const { supabase } = await adminDb();
  await supabase.from("leads").delete().eq("id", id);
  redirect("/admin/leads");
}
