import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero } from "@/components/site/page-hero";
import { ProductCatalog, ProductCatalogSkeleton } from "@/components/site/product-catalog";
import { SignArt } from "@/components/ui/sign-art";
import { getCategories, getProducts } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse safety signages, LED emergency & exit lights, photoluminescent signs, evacuation plans and safety tapes. Add items to your quote basket for bulk pricing.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHero
        eyebrow="Our products"
        crumbs={[{ href: "/", label: "Home" }, { label: "Products" }]}
        title={
          <>
            Safety products, <span className="text-accent-600">factory direct</span>
          </>
        }
        description="Every item below is manufactured at our Vasai unit. Pick what you need, add it to your quote basket, and we'll send one consolidated price, including custom sizes and materials."
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="blob absolute inset-4 bg-gradient-to-br from-white to-brand-100" />
            <div className="anim-float absolute top-[6%] left-[10%] w-[52%]" style={{ ["--rot" as string]: "-6deg" }}>
              <SignArt kind="mandatory" />
            </div>
            <div className="anim-float absolute right-[6%] bottom-[8%] w-[50%]" style={{ ["--rot" as string]: "6deg", ["--delay" as string]: "-3s" }}>
              <SignArt kind="exit" />
            </div>
          </div>
        }
      />
      <section className="container-page pb-20">
        <Suspense fallback={<ProductCatalogSkeleton />}>
          <ProductCatalog products={products} categories={categories} />
        </Suspense>
      </section>
      <CtaSection />
    </>
  );
}
