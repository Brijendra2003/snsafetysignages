"use client";

import { useActionState } from "react";
import { createLead, updateLead } from "@/app/admin/actions/leads";
import { FormMessage, SubmitButton } from "@/components/admin/client-ui";
import { adminInput, Field } from "@/components/admin/ui";
import { LEAD_SOURCES, LEAD_STATUSES, type ActionState, type Lead } from "@/lib/types";
import { cn, titleCase } from "@/lib/utils";

const initial: ActionState = { ok: false };

/** Status + internal notes on the lead detail page. */
export function LeadUpdateForm({ lead }: { lead: Lead }) {
  const [state, action] = useActionState(updateLead.bind(null, lead.id), initial);
  return (
    <form action={action} className="space-y-4">
      <Field label="Status" name="status">
        <select id="status" name="status" defaultValue={state.values?.status ?? lead.status} className={cn(adminInput, "cursor-pointer")}>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {titleCase(s)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Internal notes" name="notes" hint="Only visible to admins">
        <textarea id="notes" name="notes" rows={6} defaultValue={lead.notes ?? ""} className={adminInput} placeholder="Called on Monday, sending revised quote…" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton className="w-full">Save</SubmitButton>
    </form>
  );
}

/** Manually log a lead from a phone call, walk-in or WhatsApp chat. */
export function NewLeadForm() {
  const [state, action] = useActionState(createLead, initial);
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Name" name="name" error={e.name} required>
        <input id="name" name="name" defaultValue={v.name} className={adminInput} aria-invalid={!!e.name} />
      </Field>
      <Field label="Phone" name="phone" error={e.phone} required>
        <input id="phone" name="phone" defaultValue={v.phone} className={adminInput} aria-invalid={!!e.phone} />
      </Field>
      <Field label="Email" name="email" error={e.email}>
        <input id="email" name="email" type="email" defaultValue={v.email} className={adminInput} />
      </Field>
      <Field label="Company" name="company">
        <input id="company" name="company" defaultValue={v.company} className={adminInput} />
      </Field>
      <Field label="City" name="city">
        <input id="city" name="city" defaultValue={v.city} className={adminInput} />
      </Field>
      <Field label="Subject" name="subject">
        <input id="subject" name="subject" defaultValue={v.subject} className={adminInput} />
      </Field>
      <Field label="Source" name="source">
        <select id="source" name="source" defaultValue={v.source ?? "manual"} className={cn(adminInput, "cursor-pointer")}>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {titleCase(s)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status" name="status">
        <select id="status" name="status" defaultValue={v.status ?? "new"} className={cn(adminInput, "cursor-pointer")}>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {titleCase(s)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Requirement / message" name="message" className="sm:col-span-2">
        <textarea id="message" name="message" rows={4} defaultValue={v.message} className={adminInput} />
      </Field>
      <div className="flex items-center justify-between gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton className="ml-auto">Create lead</SubmitButton>
      </div>
    </form>
  );
}
