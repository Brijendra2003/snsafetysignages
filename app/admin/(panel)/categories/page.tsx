import type { Metadata } from "next";
import { CategoriesManager } from "@/components/admin/content-managers";
import { PageHeader } from "@/components/admin/ui";
import { listCategories } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await listCategories();
  return (
    <>
      <PageHeader title="Categories" description="Product groups shown as filters and cards on the website." />
      <CategoriesManager categories={categories} />
    </>
  );
}
