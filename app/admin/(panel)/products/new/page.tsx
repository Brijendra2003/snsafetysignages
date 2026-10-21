import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { listCategories } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <>
      <PageHeader title="Add product" back={{ href: "/admin/products", label: "Products" }} />
      <ProductForm categories={categories} />
    </>
  );
}
