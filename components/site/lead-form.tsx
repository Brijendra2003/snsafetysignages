"use client";

import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { createContext, use, useActionState, useEffect, useId, useRef } from "react";
import { submitLead } from "@/app/actions/leads";
import { buttonClasses } from "@/components/ui/button";
import type { ActionState, LeadSource } from "@/lib/types";
import { cn } from "@/lib/utils";

export type LeadFormItem = { product_id: string | null; name: string; slug?: string | null; quantity: number };

const initial: ActionState = { ok: false };
const IdPrefix = createContext("lead");

export const inputClasses =
  "w-full rounded-xl border-0 bg-white px-4 py-3 text-[0.95rem] text-ink-900 shadow-soft ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:ring-2 focus:ring-brand-600 focus:outline-none aria-invalid:ring-accent-500";

function Field({
  label,
  name,
  error,
  required,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const prefix = use(IdPrefix);
  return (
    <div className={className}>
      <label htmlFor={`${prefix}-${name}`} className="mb-1.5 block text-sm font-semibold text-ink-900">
        {label} {required && <span className="text-accent-600">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${prefix}-${name}-error`} className="mt-1.5 text-xs font-medium text-accent-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm({
  source = "contact",
  items,
  subject,
  compact = false,
  submitLabel = "Send enquiry",
  onSuccess,
  className,
}: {
  source?: LeadSource;
  items?: LeadFormItem[];
  subject?: string;
  compact?: boolean;
  submitLabel?: string;
  onSuccess?: () => void;
  className?: string;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state, onSuccess]);

  if (state.ok) {
    return (
      <div className={cn("anim-modal-in rounded-2xl bg-success-50 p-8 text-center ring-1 ring-success-600/20", className)}>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-success-600 text-white">
          <CircleCheck className="size-7" />
        </span>
        <h3 className="mt-4 text-xl font-bold">Enquiry received</h3>
        <p className="mt-2 text-ink-500">{state.message}</p>
      </div>
    );
  }

  return (
    <IdPrefix value={uid}>
    <form ref={formRef} action={action} noValidate className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="items" value={JSON.stringify(items ?? [])} />
      {/* Honeypot: hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Full name" name="name" error={e.name} required>
        <input id={`${uid}-name`} name="name" defaultValue={v.name} autoComplete="name" required aria-invalid={!!e.name} className={inputClasses} placeholder="Your name" />
      </Field>
      <Field label="Phone / WhatsApp" name="phone" error={e.phone} required>
        <input id={`${uid}-phone`} name="phone" defaultValue={v.phone} type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={!!e.phone} className={inputClasses} placeholder="+91 98xxx xxxxx" />
      </Field>
      <Field label="Email" name="email" error={e.email}>
        <input id={`${uid}-email`} name="email" defaultValue={v.email} type="email" autoComplete="email" aria-invalid={!!e.email} className={inputClasses} placeholder="you@company.com" />
      </Field>
      <Field label="Company" name="company" error={e.company}>
        <input id={`${uid}-company`} name="company" defaultValue={v.company} autoComplete="organization" className={inputClasses} placeholder="Company / site name" />
      </Field>
      {!compact && (
        <>
          <Field label="City" name="city" error={e.city}>
            <input id={`${uid}-city`} name="city" defaultValue={v.city} autoComplete="address-level2" className={inputClasses} placeholder="e.g. Mumbai" />
          </Field>
          <Field label="What do you need?" name="subject" error={e.subject}>
            <input id={`${uid}-subject`} name="subject" defaultValue={v.subject ?? subject} className={inputClasses} placeholder="e.g. 200 exit signs for a new plant" />
          </Field>
        </>
      )}
      <Field label="Message" name="message" error={e.message} className="sm:col-span-2">
        <textarea
          id={`${uid}-message`}
          name="message"
          defaultValue={v.message}
          rows={compact ? 3 : 5}
          className={cn(inputClasses, "resize-y")}
          placeholder="Sizes, quantities, material, site location, deadline…"
        />
      </Field>

      {state.message && !state.ok && (
        <p role="alert" className="rounded-xl bg-accent-50 px-4 py-3 text-sm font-medium text-accent-800 ring-1 ring-accent-100 sm:col-span-2">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-500">We reply within one working day. Your details are never shared.</p>
        <button type="submit" disabled={pending} className={buttonClasses({ size: "lg", className: "btn-shine" })}>
          {pending ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-4.5" />}
          {pending ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
    </IdPrefix>
  );
}
