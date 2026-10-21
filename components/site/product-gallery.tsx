"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductVisual } from "@/components/ui/product-visual";
import { cldUrl, cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  slug,
  categorySlug,
}: {
  images: string[];
  name: string;
  slug: string;
  categorySlug: string | null;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <ProductVisual
        slug={slug}
        categorySlug={categorySlug}
        name={name}
        priority
        className="aspect-square rounded-3xl ring-1 ring-ink-100"
        artClassName="w-[66%]"
      />
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100">
        {images.map((src, i) => (
          <Image
            key={src}
            src={cldUrl(src, 1400)}
            alt={`${name}${images.length > 1 ? ` – view ${i + 1}` : ""}`}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-contain p-6 transition duration-500", i === active ? "opacity-100" : "opacity-0")}
          />
        ))}
      </div>
      {images.length > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-white ring-2 transition",
                  i === active ? "ring-accent-600" : "ring-ink-100 hover:ring-ink-300",
                )}
              >
                <Image src={cldUrl(src, 200)} alt="" fill sizes="100px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
