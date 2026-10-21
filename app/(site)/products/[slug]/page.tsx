import { BadgeCheck, Check, ChevronRight, Factory, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/site/json-ld";
import { LeadForm } from "@/components/site/lead-form";
import { ProductActions } from "@/components/site/product-actions";
import { ProductCard } from "@/components/site/product-card";
import { ProductGallery } from "@/components/site/product-gallery";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { ButtonAnchor } from "@/components/ui/button";
import { getProductBySlug, getProducts, getRelatedProducts, getSettings } from "@/lib/data/public";
import { site, whatsappLink } from "@/lib/site";
import { formatINR } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const description =
    product.short_description ?? `${product.name} by ${site.name}. Request a quote for bulk and custom orders.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([getRelatedProducts(product), getSettings()]);
  const quoteItem = {
    product_id: product.id,
    name: product.name,
    slug: product.slug,
    categorySlug: product.category?.slug ?? null,
    image: product.images[0] ?? null,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? undefined,
    image: product.images.length ? product.images : undefined,
    sku: product.sku ?? undefined,
    brand: { "@type": "Brand", name: site.name },
    category: product.category?.name,
    ...(product.price
      ? { offers: { "@type": "Offer", priceCurrency: "INR", price: product.price, availability: "https://schema.org/InStock" } }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="container-page pt-6 pb-16 sm:pt-10">
        <nav aria-label="Breadcrumb" className="anim-intro">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            <li>
              <Link href="/" className="hover:text-ink-900">Home</Link>
            </li>
            <li aria-hidden><ChevronRight className="size-3.5" /></li>
            <li>
              <Link href="/products" className="hover:text-ink-900">Products</Link>
            </li>
            {product.category && (
              <>
                <li aria-hidden><ChevronRight className="size-3.5" /></li>
                <li>
                  <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink-900">
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden><ChevronRight className="size-3.5" /></li>
            <li aria-current="page" className="font-semibold text-ink-900">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="anim-intro lg:sticky lg:top-28 lg:self-start" style={{ ["--d" as string]: "80ms" }}>
            <ProductGallery
              images={product.images}
              name={product.name}
              slug={product.slug}
              categorySlug={product.category?.slug ?? null}
            />
          </div>

          <div className="anim-intro" style={{ ["--d" as string]: "160ms" }}>
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wide text-brand-700 uppercase">
                  {product.category.name}
                </span>
              )}
              {product.badge && (
                <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold tracking-wide text-accent-700 uppercase ring-1 ring-accent-100">
                  {product.badge}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-5xl">{product.name}</h1>
            {product.short_description && (
              <p className="mt-4 text-lg leading-relaxed text-ink-500">{product.short_description}</p>
            )}

            <div className="mt-6 flex items-baseline gap-2">
              {product.price ? (
                <>
                  <span className="font-display text-3xl font-extrabold text-ink-900">{formatINR(product.price)}</span>
                  <span className="text-ink-500">/ {product.unit || "piece"} + GST</span>
                </>
              ) : (
                <span className="font-display text-xl font-bold text-ink-900">
                  Price on request <span className="text-base font-medium text-ink-500">· bulk discounts available</span>
                </span>
              )}
            </div>
            {product.min_order_qty > 1 && (
              <p className="mt-1 text-sm text-ink-500">Minimum order: {product.min_order_qty} {product.unit || "pieces"}</p>
            )}

            {product.features.length > 0 && (
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-ink-700">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-50 text-success-600">
                      <Check className="size-3.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 space-y-3">
              <ProductActions item={quoteItem} minQty={product.min_order_qty} />
              <ButtonAnchor
                href={whatsappLink(settings.whatsapp, `Hi SN Safety, I'm interested in "${product.name}". Please share price and details.`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
              >
                <WhatsAppIcon className="size-5" /> Ask on WhatsApp
              </ButtonAnchor>
            </div>

            <ul className="mt-8 grid gap-3 rounded-2xl bg-ink-50 p-5 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2 font-medium text-ink-700">
                <BadgeCheck className="size-5 text-success-600" /> ISO 7010 compliant
              </li>
              <li className="flex items-center gap-2 font-medium text-ink-700">
                <Factory className="size-5 text-brand-600" /> Made in our factory
              </li>
              <li className="flex items-center gap-2 font-medium text-ink-700">
                <Truck className="size-5 text-accent-600" /> Pan-India delivery
              </li>
            </ul>

            {product.specs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold">Specifications</h2>
                <dl className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
                  {product.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5 text-sm">
                      <dt className="font-semibold text-ink-900">{s.label}</dt>
                      <dd className="text-ink-700">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.description && (
              <div className="mt-10">
                <h2 className="text-xl font-bold">About this product</h2>
                <div className="mt-3 space-y-3 leading-relaxed whitespace-pre-line text-ink-700">{product.description}</div>
              </div>
            )}

            <div id="enquire" className="mt-10 scroll-mt-28 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink-100 sm:p-8">
              <h2 className="text-xl font-bold">Enquire about this product</h2>
              <p className="mt-1 text-sm text-ink-500">Share quantity, size or material and we&apos;ll send a quote.</p>
              <LeadForm
                source="product"
                compact
                subject={product.name}
                items={[{ product_id: product.id, name: product.name, slug: product.slug, quantity: product.min_order_qty }]}
                className="mt-6"
                submitLabel="Request quote"
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-brand-50 py-16 sm:py-20">
          <div className="container-page">
            <h2 id="related-title" className="text-3xl font-extrabold">
              You may also <span className="text-accent-600">need</span>
            </h2>
            <ul className="stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <li key={p.id} style={{ ["--i" as string]: i }}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="container-page pt-10 pb-16" aria-hidden>
      <div className="skeleton h-4 w-64" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="skeleton aspect-square rounded-3xl!" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-40 rounded-full!" />
          <div className="skeleton h-12 w-4/5" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton mt-8 h-12 w-64" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
