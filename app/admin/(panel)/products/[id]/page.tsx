import { Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/app/admin/actions/catalog";
import { ConfirmAction } from "@/components/admin/client-ui";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { getProduct, listCategories } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [product, categories] = await Promise.all([getProduct(id), listCategories()]);
  if (!product) notFound();

  return (
    <>
      {sp.created && (
        <p role="status" className="anim-fade-in mb-4 rounded-lg bg-success-50 px-4 py-3 text-sm font-medium text-success-600 ring-1 ring-success-600/20">
          Product created and published.
        </p>
      )}
      <PageHeader
        title={product.name}
        back={{ href: "/admin/products", label: "Products" }}
        actions={
          <ConfirmAction action={deleteProduct.bind(null, product.id)} confirm={`Delete "${product.name}"? It will be removed from the website.`}>
            <Trash2 className="size-4" /> Delete
          </ConfirmAction>
        }
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
