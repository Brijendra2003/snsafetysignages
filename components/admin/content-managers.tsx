"use client";

import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/actions/catalog";
import { deleteClient, deleteTestimonial, saveClient, saveTestimonial } from "@/app/admin/actions/content";
import { ConfirmAction, FormMessage, Modal, SubmitButton } from "@/components/admin/client-ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { adminInput, EmptyState, Field } from "@/components/admin/ui";
import type { ActionState, Category, Client, Testimonial } from "@/lib/types";
import { cldUrl, cn, initials, slugify } from "@/lib/utils";

type SaveAction = (id: string | null, prev: ActionState, fd: FormData) => Promise<ActionState>;
const initial: ActionState = { ok: false };

/** Form inside a modal that closes itself once the save succeeds. */
function DialogForm({
  save,
  id,
  onDone,
  children,
}: {
  save: SaveAction;
  id: string | null;
  onDone: () => void;
  children: (state: ActionState) => ReactNode;
}) {
  const [state, action] = useActionState(save.bind(null, id), initial);
  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);
  return (
    <form action={action} className="space-y-4">
      {children(state)}
      <FormMessage state={state} />
      <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
        <button type="button" onClick={onDone} className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50">
          Cancel
        </button>
        <SubmitButton>{id ? "Save changes" : "Add"}</SubmitButton>
      </div>
    </form>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-700">
      <Plus className="size-4" /> {children}
    </button>
  );
}

function ActiveCheckbox({ defaultChecked, label = "Visible on website" }: { defaultChecked: boolean; label?: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
      <input type="checkbox" name="is_active" defaultChecked={defaultChecked} className="size-4.5 cursor-pointer accent-success-600" />
      {label}
    </label>
  );
}

/* ---------------- Categories ---------------- */

export function CategoriesManager({ categories }: { categories: (Category & { product_count: number })[] }) {
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const current = editing === "new" ? null : editing;
  const [slug, setSlug] = useState("");
  const close = () => setEditing(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <AddButton
          onClick={() => {
            setSlug("");
            setEditing("new");
          }}
        >
          Add category
        </AddButton>
      </div>
      {categories.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-ink-900">{c.name}</p>
                  <p className="text-xs text-ink-500">/products?category={c.slug}</p>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", c.is_active ? "bg-success-50 text-success-600" : "bg-ink-100 text-ink-500")}>
                  {c.is_active ? "Live" : "Hidden"}
                </span>
              </div>
              {c.tagline && <p className="mt-3 text-sm text-ink-700">{c.tagline}</p>}
              <p className="mt-1 flex-1 text-sm text-ink-500">{c.product_count} products · order {c.sort_order}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSlug(c.slug);
                    setEditing(c);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50"
                >
                  <Pencil className="size-4" /> Edit
                </button>
                <ConfirmAction
                  action={deleteCategory.bind(null, c.id)}
                  confirm={`Delete "${c.name}"? Its ${c.product_count} products will become uncategorised.`}
                >
                  <Trash2 className="size-4" />
                </ConfirmAction>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No categories yet" text="Categories group products on the website." />
      )}

      <Modal open={editing !== null} onClose={close} title={current ? `Edit ${current.name}` : "Add category"} wide>
        {editing !== null && (
          <DialogForm save={saveCategory} id={current?.id ?? null} onDone={close} key={current?.id ?? "new"}>
            {(state) => {
              const e = state.errors ?? {};
              const v = state.values;
              return (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" error={e.name} required>
                    <input
                      id="name"
                      name="name"
                      defaultValue={v?.name ?? current?.name}
                      onChange={(ev) => !current && setSlug(slugify(ev.target.value))}
                      className={adminInput}
                    />
                  </Field>
                  <Field label="Slug" name="slug" error={e.slug} required>
                    <input id="slug" name="slug" value={slug} onChange={(ev) => setSlug(slugify(ev.target.value))} className={adminInput} />
                  </Field>
                  <Field label="Tagline" name="tagline" error={e.tagline} className="sm:col-span-2">
                    <input id="tagline" name="tagline" defaultValue={v?.tagline ?? current?.tagline ?? ""} className={adminInput} />
                  </Field>
                  <Field label="Description" name="description" error={e.description} className="sm:col-span-2">
                    <textarea id="description" name="description" rows={3} defaultValue={v?.description ?? current?.description ?? ""} className={adminInput} />
                  </Field>
                  <div className="sm:col-span-2">
                    <ImageUploader name="image_url" multiple={false} folder="categories" label="Cover image (optional)" defaultValue={current?.image_url ? [current.image_url] : []} />
                  </div>
                  <Field label="Sort order" name="sort_order" error={e.sort_order}>
                    <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={v?.sort_order ?? current?.sort_order ?? 0} className={adminInput} />
                  </Field>
                  <div className="flex items-end pb-2.5">
                    <ActiveCheckbox defaultChecked={current?.is_active ?? true} />
                  </div>
                </div>
              );
            }}
          </DialogForm>
        )}
      </Modal>
    </>
  );
}

/* ---------------- Clients ---------------- */

export function ClientsManager({ clients }: { clients: Client[] }) {
  const [editing, setEditing] = useState<Client | "new" | null>(null);
  const current = editing === "new" ? null : editing;
  const close = () => setEditing(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <AddButton onClick={() => setEditing("new")}>Add client</AddButton>
      </div>
      {clients.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((c) => (
            <li key={c.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
              <div className="grid h-20 place-items-center rounded-xl bg-ink-50">
                {c.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cldUrl(c.logo_url, 300)} alt={c.name} className="max-h-14 max-w-[80%] object-contain" />
                ) : (
                  <span className="grid size-12 place-items-center rounded-xl bg-brand-900 font-bold text-white">{initials(c.name)}</span>
                )}
              </div>
              <p className="mt-3 font-semibold text-ink-900">{c.name}</p>
              <p className="text-xs text-ink-500">{c.is_active ? "Shown on website" : "Hidden"}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setEditing(c)} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50">
                  <Pencil className="size-4" /> Edit
                </button>
                <ConfirmAction action={deleteClient.bind(null, c.id)} confirm={`Remove ${c.name}?`}>
                  <Trash2 className="size-4" />
                </ConfirmAction>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No clients yet" text="Client logos scroll on the home and about pages." />
      )}

      <Modal open={editing !== null} onClose={close} title={current ? `Edit ${current.name}` : "Add client"}>
        {editing !== null && (
          <DialogForm save={saveClient} id={current?.id ?? null} onDone={close} key={current?.id ?? "new"}>
            {(state) => {
              const e = state.errors ?? {};
              const v = state.values;
              return (
                <>
                  <Field label="Client name" name="name" error={e.name} required>
                    <input id="name" name="name" defaultValue={v?.name ?? current?.name} className={adminInput} />
                  </Field>
                  <ImageUploader name="logo_url" multiple={false} folder="clients" label="Logo (transparent PNG/SVG works best)" defaultValue={current?.logo_url ? [current.logo_url] : []} />
                  <Field label="Website" name="website" error={e.website}>
                    <input id="website" name="website" defaultValue={v?.website ?? current?.website ?? ""} placeholder="https://" className={adminInput} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Sort order" name="sort_order">
                      <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={v?.sort_order ?? current?.sort_order ?? 0} className={adminInput} />
                    </Field>
                    <div className="flex items-end pb-2.5">
                      <ActiveCheckbox defaultChecked={current?.is_active ?? true} />
                    </div>
                  </div>
                </>
              );
            }}
          </DialogForm>
        )}
      </Modal>
    </>
  );
}

/* ---------------- Testimonials ---------------- */

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | "new" | null>(null);
  const current = editing === "new" ? null : editing;
  const close = () => setEditing(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <AddButton onClick={() => setEditing("new")}>Add testimonial</AddButton>
      </div>
      {testimonials.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-safety-400" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={cn("size-4", i < t.rating ? "fill-current" : "text-ink-200")} />
                  ))}
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", t.is_active ? "bg-success-50 text-success-600" : "bg-ink-100 text-ink-500")}>
                  {t.is_active ? "Live" : "Hidden"}
                </span>
              </div>
              <p className="mt-3 line-clamp-4 flex-1 text-sm text-ink-700">“{t.quote}”</p>
              <p className="mt-3 text-sm font-semibold text-ink-900">{t.name}</p>
              <p className="text-xs text-ink-500">{[t.role, t.company].filter(Boolean).join(", ")}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setEditing(t)} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50">
                  <Pencil className="size-4" /> Edit
                </button>
                <ConfirmAction action={deleteTestimonial.bind(null, t.id)} confirm={`Delete testimonial from ${t.name}?`}>
                  <Trash2 className="size-4" />
                </ConfirmAction>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No testimonials yet" text="Add quotes from happy customers to build trust." />
      )}

      <Modal open={editing !== null} onClose={close} title={current ? "Edit testimonial" : "Add testimonial"} wide>
        {editing !== null && (
          <DialogForm save={saveTestimonial} id={current?.id ?? null} onDone={close} key={current?.id ?? "new"}>
            {(state) => {
              const e = state.errors ?? {};
              const v = state.values;
              return (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" error={e.name} required>
                    <input id="name" name="name" defaultValue={v?.name ?? current?.name} className={adminInput} />
                  </Field>
                  <Field label="Rating" name="rating">
                    <select id="rating" name="rating" defaultValue={v?.rating ?? current?.rating ?? 5} className={cn(adminInput, "cursor-pointer")}>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} star{r > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Role" name="role">
                    <input id="role" name="role" defaultValue={v?.role ?? current?.role ?? ""} placeholder="EHS Manager" className={adminInput} />
                  </Field>
                  <Field label="Company" name="company">
                    <input id="company" name="company" defaultValue={v?.company ?? current?.company ?? ""} className={adminInput} />
                  </Field>
                  <Field label="Quote" name="quote" error={e.quote} required className="sm:col-span-2">
                    <textarea id="quote" name="quote" rows={4} defaultValue={v?.quote ?? current?.quote} className={adminInput} />
                  </Field>
                  <input type="hidden" name="avatar_url" value={current?.avatar_url ?? ""} />
                  <Field label="Sort order" name="sort_order">
                    <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={v?.sort_order ?? current?.sort_order ?? 0} className={adminInput} />
                  </Field>
                  <div className="flex items-end pb-2.5">
                    <ActiveCheckbox defaultChecked={current?.is_active ?? true} />
                  </div>
                </div>
              );
            }}
          </DialogForm>
        )}
      </Modal>
    </>
  );
}
