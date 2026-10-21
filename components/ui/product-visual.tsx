import Image from "next/image";
import { artBackground, artFor, SignArt } from "@/components/ui/sign-art";
import { cldUrl, cn } from "@/lib/utils";

/** Product/category picture: the uploaded Cloudinary image, or a matching illustration. */
export function ProductVisual({
  image,
  slug,
  categorySlug,
  name,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
  artClassName,
}: {
  image?: string | null;
  slug?: string | null;
  categorySlug?: string | null;
  name: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  artClassName?: string;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image
          src={cldUrl(image, 1200)}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-4 transition duration-500 group-hover:scale-105"
        />
      </div>
    );
  }
  const kind = artFor(slug, categorySlug, name);
  return (
    <div className={cn("relative grid place-items-center overflow-hidden", artBackground(kind), className)}>
      <div className={cn("aspect-square max-h-[86%] w-[72%] transition duration-500 group-hover:scale-105 group-hover:-rotate-2", artClassName)}>
        <SignArt kind={kind} title={name} />
      </div>
    </div>
  );
}
