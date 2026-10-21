"use client";

import { ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct } from "@/app/admin/actions/catalog";
import { FormMessage, SubmitButton } from "@/components/admin/client-ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { adminInput, Card, Field } from "@/components/admin/ui";
import type { ActionState, Category, Product, Spec } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";

const initial: ActionState = { ok: false };

export function ProductForm({ product, categories }: { product?: Product; categories: Pick<Category, "id" | "name">[] }) {
  const [state, action] = useActionState(saveProduct.bind(null, product?.id ?? null), initial);
  const e = state.errors ?? {};
  const v = state.values;

  const [name, setName] = useState(v?.name ?? product?.name ?? "");
  const [slug, setSlug] = useState(v?.slug ?? product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [specs, setSpecs] = useState<Spec[]>(product?.specs?.length ? product.specs : [{ label: "", value: "" }]);

  const cleanSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="specs" value={JSON.stringify(cleanSpecs)} />

      <div className="space-y-6">
        <Card title="Basic details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product name" name="name" error={e.name} required className="sm:col-span-2">
              <input
                id="name"
                name="name"
                value={name}
                onChange={(ev) => {
                  setName(ev.target.value);
                  if (!slugTouched) setSlug(slugify(ev.target.value));
                }}
                aria-invalid={!!e.name}
                className={adminInput}
                placeholder="e.g. Glow-in-Dark Exit Sign"
              />
            </Field>
            <Field label="URL slug" name="slug" error={e.slug} hint={`/products/${slug || "…"}`} required>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(ev) => {
                  setSlug(slugify(ev.target.value));
                  setSlugTouched(true);
                }}
                aria-invalid={!!e.slug}
                className={adminInput}
              />
            </Field>
            <Field label="Category" name="category_id" error={e.category_id}>
              <select id="category_id" name="category_id" defaultValue={v?.category_id ?? product?.category_id ?? ""} className={cn(adminInput, "cursor-pointer")}>
                <option value="">Uncategorised</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Short description" name="short_description" error={e.short_description} hint="One line shown on product cards (max 300 chars)" className="sm:col-span-2">
              <textarea id="short_description" name="short_description" rows={2} maxLength={300} defaultValue={v?.short_description ?? product?.short_description ?? ""} className={adminInput} />
            </Field>
            <Field label="Full description" name="description" error={e.description} className="sm:col-span-2">
              <textarea id="description" name="description" rows={6} defaultValue={v?.description ?? product?.description ?? ""} className={adminInput} />
            </Field>
          </div>
        </Card>

        <Card title="Images">
          <ImageUploader name="images" folder="products" defaultValue={product?.images ?? []} />
          {e.images && <p className="mt-2 text-xs font-medium text-accent-700">{e.images}</p>}
        </Card>

        <Card title="Features & specifications">
          <Field label="Key features" name="features" hint="One feature per line, shown as a checklist" error={e.features}>
            <textarea id="features" name="features" rows={4} defaultValue={v?.features ?? product?.features.join("\n") ?? ""} className={adminInput} placeholder={"3 hr battery backup\nISO 7010 symbols"} />
          </Field>
          <div className="mt-5">
            <p className="mb-1.5 text-sm font-semibold text-ink-900">Specifications</p>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    aria-label={`Spec ${i + 1} label`}
                    value={s.label}
                    onChange={(ev) => setSpecs((prev) => prev.map((p, j) => (j === i ? { ...p, label: ev.target.value } : p)))}
                    placeholder="Material"
                    className={cn(adminInput, "w-40 shrink-0")}
                  />
                  <input
                    aria-label={`Spec ${i + 1} value`}
                    value={s.value}
                    onChange={(ev) => setSpecs((prev) => prev.map((p, j) => (j === i ? { ...p, value: ev.target.value } : p)))}
                    placeholder="ACP / Sunboard"
                    className={adminInput}
                  />
                  <button
                    type="button"
                    onClick={() => setSpecs((prev) => prev.filter((_, j) => j !== i))}
                    aria-label="Remove spec"
                    className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-400 ring-1 ring-ink-200 hover:text-accent-700"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSpecs((prev) => [...prev, { label: "", value: "" }])}
              className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              <Plus className="size-4" /> Add spec
            </button>
          </div>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <Card title="Publish">
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-ink-900">
              Visible on website
              <input type="checkbox" name="is_active" defaultChecked={v ? v.is_active === "on" : (product?.is_active ?? true)} className="size-5 cursor-pointer accent-success-600" />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-ink-900">
              Featured on home page
              <input type="checkbox" name="is_featured" defaultChecked={v ? v.is_featured === "on" : (product?.is_featured ?? false)} className="size-5 cursor-pointer accent-success-600" />
            </label>
            <Field label="Badge" name="badge" hint='e.g. "Best Seller", "BIS Certified"' error={e.badge}>
              <input id="badge" name="badge" defaultValue={v?.badge ?? product?.badge ?? ""} className={adminInput} />
            </Field>
            <Field label="Sort order" name="sort_order" hint="Lower numbers show first" error={e.sort_order}>
              <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={v?.sort_order ?? product?.sort_order ?? 0} className={adminInput} />
            </Field>
            <FormMessage state={state} />
            <div className="flex items-center gap-2">
              <SubmitButton className="flex-1">{product ? "Save changes" : "Create product"}</SubmitButton>
              {product && (
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="grid size-10 place-items-center rounded-lg text-ink-500 ring-1 ring-ink-200 hover:bg-ink-50"
                  aria-label="View on website"
                >
                  <ExternalLink className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </Card>

        <Card title="Pricing">
          <div className="grid gap-4">
            <Field label="Price (₹, excl. GST)" name="price" hint="Leave blank to show “Price on request”" error={e.price}>
              <input id="price" name="price" type="number" min={0} step="0.01" defaultValue={v?.price ?? product?.price ?? ""} className={adminInput} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Unit" name="unit" error={e.unit}>
                <input id="unit" name="unit" defaultValue={v?.unit ?? product?.unit ?? "piece"} className={adminInput} />
              </Field>
              <Field label="Min. order" name="min_order_qty" error={e.min_order_qty}>
                <input id="min_order_qty" name="min_order_qty" type="number" min={1} defaultValue={v?.min_order_qty ?? product?.min_order_qty ?? 1} className={adminInput} />
              </Field>
            </div>
            <Field label="SKU / code" name="sku" error={e.sku}>
              <input id="sku" name="sku" defaultValue={v?.sku ?? product?.sku ?? ""} className={adminInput} />
            </Field>
          </div>
        </Card>
      </div>
    </form>
  );
}
