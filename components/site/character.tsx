import Image from "next/image";
import type { ReactNode } from "react";
import type { CharacterSlot } from "@/lib/characters";
import { cn } from "@/lib/utils";

/** Renders a 3D character render when provided, otherwise the vector fallback. */
export function Character({
  slot,
  fallback,
  priority,
  className,
}: {
  slot: CharacterSlot;
  fallback: ReactNode;
  priority?: boolean;
  className?: string;
}) {
  if (!slot.src) return <>{fallback}</>;
  return (
    <Image
      src={slot.src}
      alt={slot.alt}
      width={slot.width}
      height={slot.height}
      priority={priority}
      sizes="(min-width: 1024px) 560px, 90vw"
      className={cn("h-auto w-full drop-shadow-[0_30px_40px_rgba(15,23,42,0.25)]", className)}
    />
  );
}
