"use client";

import { Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { saveSettings } from "@/app/admin/actions/content";
import { FormMessage, SubmitButton } from "@/components/admin/client-ui";
import { adminInput, Card, Field } from "@/components/admin/ui";
import type { ActionState, SiteSettings, Stat } from "@/lib/types";

const initial: ActionState = { ok: false };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, initial);
  const [stats, setStats] = useState<Stat[]>(settings.stats ?? []);
  const e = state.errors ?? {};
  const v = state.values;
  const val = (k: keyof SiteSettings) => v?.[k] ?? (settings[k] as string | null) ?? "";

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-2">
      <input type="hidden" name="stats" value={JSON.stringify(stats)} />

      <Card title="Contact details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" name="phone" error={e.phone} required>
            <input id="phone" name="phone" defaultValue={val("phone")} className={adminInput} />
          </Field>
          <Field label="Alternate phone" name="phone_alt" error={e.phone_alt}>
            <input id="phone_alt" name="phone_alt" defaultValue={val("phone_alt")} className={adminInput} />
          </Field>
          <Field label="WhatsApp number" name="whatsapp" error={e.whatsapp} hint="With country code, e.g. 918530072419" required>
            <input id="whatsapp" name="whatsapp" defaultValue={val("whatsapp")} className={adminInput} />
          </Field>
          <Field label="Email" name="email" error={e.email} required>
            <input id="email" name="email" type="email" defaultValue={val("email")} className={adminInput} />
          </Field>
          <Field label="Address" name="address" error={e.address} required className="sm:col-span-2">
            <textarea id="address" name="address" rows={2} defaultValue={val("address")} className={adminInput} />
          </Field>
          <Field label="Google Maps search text" name="map_query" error={e.map_query} hint="What the map on the contact page searches for" required>
            <input id="map_query" name="map_query" defaultValue={val("map_query")} className={adminInput} />
          </Field>
          <Field label="Working hours" name="hours" error={e.hours} required>
            <input id="hours" name="hours" defaultValue={val("hours")} className={adminInput} />
          </Field>
          <Field label="Top bar announcement" name="announcement" error={e.announcement} hint="Optional. Replaces working hours in the top bar." className="sm:col-span-2">
            <input id="announcement" name="announcement" defaultValue={val("announcement")} className={adminInput} placeholder="Diwali offer: 10% off on bulk orders" />
          </Field>
        </div>
      </Card>

      <div className="space-y-6">
        <Card title="Social & catalogue links">
          <div className="grid gap-4">
            {(
              [
                ["facebook_url", "Facebook"],
                ["instagram_url", "Instagram"],
                ["linkedin_url", "LinkedIn"],
                ["youtube_url", "YouTube"],
                ["catalog_url", "Catalogue PDF link"],
              ] as const
            ).map(([k, label]) => (
              <Field key={k} label={label} name={k} error={e[k]}>
                <input id={k} name={k} defaultValue={val(k)} placeholder="https://" className={adminInput} />
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Trust numbers" actions={<span className="text-xs text-ink-500">Shown with count-up animation</span>}>
          <div className="space-y-2">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  aria-label="Value"
                  type="number"
                  step="0.1"
                  min={0}
                  value={s.value}
                  onChange={(ev) => setStats((prev) => prev.map((p, j) => (j === i ? { ...p, value: Number(ev.target.value) } : p)))}
                  className={`${adminInput} w-24`}
                />
                <input
                  aria-label="Suffix"
                  value={s.suffix ?? ""}
                  maxLength={4}
                  onChange={(ev) => setStats((prev) => prev.map((p, j) => (j === i ? { ...p, suffix: ev.target.value } : p)))}
                  placeholder="+"
                  className={`${adminInput} w-16`}
                />
                <input
                  aria-label="Label"
                  value={s.label}
                  onChange={(ev) => setStats((prev) => prev.map((p, j) => (j === i ? { ...p, label: ev.target.value } : p)))}
                  placeholder="Happy customers"
                  className={adminInput}
                />
                <button
                  type="button"
                  onClick={() => setStats((prev) => prev.filter((_, j) => j !== i))}
                  aria-label="Remove"
                  className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-400 ring-1 ring-ink-200 hover:text-accent-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          {stats.length < 6 && (
            <button
              type="button"
              onClick={() => setStats((prev) => [...prev, { value: 0, suffix: "+", label: "" }])}
              className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              <Plus className="size-4" /> Add number
            </button>
          )}
          {Object.keys(e).some((k) => k.startsWith("stats")) && <p className="mt-2 text-xs text-accent-700">Each number needs a label.</p>}
        </Card>

        <div className="flex items-center justify-end gap-3">
          <FormMessage state={state} />
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </div>
    </form>
  );
}
