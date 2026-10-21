import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AddToQuoteButton } from "@/components/site/add-to-quote";
import { ProductVisual } from "@/components/ui/product-visual";
import type { ProductWithCategory } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product, priority }: { product: ProductWithCategory; priority?: boolean }) {
  const href = `/products/${product.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={href} className="block" tabIndex={-1} aria-hidden>
        <ProductVisual
          image={product.images[0]}
          slug={product.slug}
          categorySlug={product.category?.slug}
          name={product.name}
          priority={priority}
          className="aspect-[4/3]"
        />
      </Link>
      {product.badge && (
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-accent-700 uppercase shadow-soft ring-1 ring-accent-100">
          {product.badge}
        </span>
      )}
      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">{product.category.name}</p>
        )}
        <h3 className="mt-1.5 text-lg leading-snug font-bold">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{product.short_description}</p>
        )}
        <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
          <p className="text-sm whitespace-nowrap">
            {product.price ? (
              <>
                <span className="font-bold text-ink-900">{formatINR(product.price)}</span>
                <span className="text-ink-500"> / {product.unit || "piece"}</span>
              </>
            ) : (
              <span className="text-[0.8rem] font-semibold text-ink-500">On request</span>
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <AddToQuoteButton
              item={{
                product_id: product.id,
                name: product.name,
                slug: product.slug,
                categorySlug: product.category?.slug ?? null,
                image: product.images[0] ?? null,
              }}
            />
            <span className="grid size-9 place-items-center rounded-lg text-ink-500 transition group-hover:bg-accent-600 group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
