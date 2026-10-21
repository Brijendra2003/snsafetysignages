import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal ticker. Content is rendered twice so the loop is seamless. */
export function Marquee({
  items,
  duration = 40,
  reverse = false,
  className,
  itemClassName,
  separator,
}: {
  items: ReactNode[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
}) {
  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={cn("marquee-track flex shrink-0 items-center gap-6 pr-6", reverse && "reverse")}
      style={{ ["--dur" as string]: `${duration}s` }}
    >
      {items.map((item, i) => (
        <li key={i} className={cn("flex items-center gap-6 whitespace-nowrap", itemClassName)}>
          {item}
          {separator}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee flex overflow-hidden", className)}>
      {track(false)}
      {track(true)}
    </div>
  );
}
