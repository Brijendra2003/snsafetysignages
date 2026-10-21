import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { toggleProduct } from "@/app/admin/actions/catalog";
import { ToggleAction } from "@/components/admin/client-ui";
import { EmptyState, FilterBar, PageHeader, Pagination, TableWrap, td, th } from "@/components/admin/ui";
import { ProductVisual } from "@/components/ui/product-visual";
import { listCategories, listProducts, PAGE_SIZE } from "@/lib/data/admin";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" && sp.category ? sp.category : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ rows, count }, categories] = await Promise.all([listProducts({ q, category, page }), listCategories()]);

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything shown in the website catalogue. Changes go live immediately."
        actions={
          <Link href="/admin/products/new" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-700">
            <Plus className="size-4" /> Add product
          </Link>
        }
      />
      <FilterBar
        q={q}
        placeholder="Search name, SKU, slug…"
        selects={[{ name: "category", value: category, label: "All categories", options: categories.map((c) => ({ value: c.id, label: c.name })) }]}
      />
      <TableWrap>
        {rows.length ? (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-ink-50">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={th}>Price</th>
                <th className={th}>Featured</th>
                <th className={th}>Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50">
                  <td className={td}>
                    <Link href={`/admin/products/${p.id}`} className="group flex items-center gap-3">
                      <ProductVisual image={p.images[0]} slug={p.slug} categorySlug={p.category?.slug} name={p.name} sizes="48px" className="size-12 shrink-0 rounded-lg ring-1 ring-ink-100" />
                      <span>
                        <span className="block font-semibold text-ink-900 group-hover:text-accent-700">{p.name}</span>
                        <span className="block text-xs text-ink-500">
                          /{p.slug}
                          {p.badge ? ` · ${p.badge}` : ""}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className={`${td} text-ink-500`}>{p.category?.name ?? "—"}</td>
                  <td className={`${td} tabular-nums`}>{p.price != null ? formatINR(p.price) : <span className="text-ink-400">On request</span>}</td>
                  <td className={td}>
                    <ToggleAction checked={p.is_featured} label={`Feature ${p.name}`} action={toggleProduct.bind(null, p.id, "is_featured")} />
                  </td>
                  <td className={td}>
                    <ToggleAction checked={p.is_active} label={`Show ${p.name} on website`} action={toggleProduct.bind(null, p.id, "is_active")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="No products found"
            text={q || category ? "Try clearing the filters." : "Add your first product to show it on the website."}
            action={
              <Link href="/admin/products/new" className="rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white">
                Add product
              </Link>
            }
          />
        )}
      </TableWrap>
      <Pagination page={page} count={count} pageSize={PAGE_SIZE} params={{ q, category }} />
    </>
  );
}
