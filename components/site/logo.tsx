import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** SN mark + wordmark. `tone="light"` is for dark backgrounds. */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name}, home`} className={cn("group flex items-center gap-2.5", className)}>
      <Image
        src="/brand/mark.png"
        alt=""
        width={400}
        height={304}
        priority
        className="h-10 w-auto transition duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-11"
      />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-lg font-extrabold tracking-tight whitespace-nowrap sm:text-xl",
            tone === "dark" ? "text-ink-900" : "text-white",
          )}
        >
          SN Safety
        </span>
        <span
          className={cn(
            "mt-1 block text-[0.58rem] font-semibold tracking-[0.2em] whitespace-nowrap uppercase",
            tone === "dark" ? "text-ink-500" : "text-brand-200",
          )}
        >
          &amp; Signages
        </span>
      </span>
    </Link>
  );
}
