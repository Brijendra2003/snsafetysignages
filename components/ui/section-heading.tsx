import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow", dark && "text-accent-300!")}>{eyebrow}</p>
      <h2
        id={id}
        className={cn(
          "mt-3 text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-[2.75rem]",
          dark && "text-white!",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-brand-200/90" : "text-ink-500")}>
          {description}
        </p>
      )}
    </div>
  );
}
