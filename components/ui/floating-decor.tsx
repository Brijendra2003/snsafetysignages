import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Small safety-themed shapes that drift in section backgrounds (decorative only). */
type Shape = "cone" | "triangle" | "helmet" | "sparkle" | "ring" | "bolt" | "plus";

function ShapeSvg({ shape }: { shape: Shape }) {
  switch (shape) {
    case "cone":
      return (
        <svg viewBox="0 0 40 44">
          <path d="M16 4h8l10 32H6z" fill="#f97316" />
          <path d="M13 14h14l2 7H11zM9 27h22l2 6H7z" fill="#fff" />
          <rect x="2" y="36" width="36" height="6" rx="2" fill="#ea580c" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 40 36">
          <path d="M20 2 38 34H2z" fill="#facc15" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18.5" y="12" width="3" height="11" rx="1.5" fill="#0f172a" />
          <circle cx="20" cy="27.5" r="2" fill="#0f172a" />
        </svg>
      );
    case "helmet":
      return (
        <svg viewBox="0 0 44 32">
          <path d="M6 24C6 12 13 5 22 5s16 7 16 19z" fill="#facc15" />
          <path d="M19 5h6v12h-6z" fill="#eab308" />
          <rect x="2" y="23" width="40" height="6" rx="3" fill="#eab308" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill="currentColor" />
        </svg>
      );
    case "ring":
      return (
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#dc2626" strokeWidth="6" />
          <path d="M9 9 31 31" stroke="#dc2626" strokeWidth="6" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 32">
          <path d="M14 0 2 18h8l-2 14 14-20h-8z" fill="#1e3fd8" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24">
          <rect width="24" height="24" rx="5" fill="#16a34a" />
          <path d="M12 6v12M6 12h12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
}

type Item = {
  shape: Shape;
  style: CSSProperties;
  width: number;
  rot?: number;
  dur?: number;
  delay?: number;
  hideMobile?: boolean;
  twinkle?: boolean;
  className?: string;
};

const presets: Record<"hero" | "section" | "dark", Item[]> = {
  hero: [
    { shape: "triangle", style: { top: "58%", left: "47%" }, width: 40, rot: -14, dur: 6, hideMobile: true },
    { shape: "helmet", style: { top: "14%", left: "2%" }, width: 52, dur: 7.5, delay: -1.3, hideMobile: true },
    { shape: "cone", style: { left: "40%", bottom: "4%" }, width: 34, dur: 9, delay: -2.6, hideMobile: true },
    { shape: "sparkle", style: { top: "20%", right: "3%" }, width: 20, twinkle: true, className: "text-accent-500" },
    { shape: "ring", style: { right: "2%", bottom: "12%" }, width: 36, rot: 12, dur: 6, delay: -5.2, hideMobile: true },
    { shape: "plus", style: { top: "64%", left: "1%" }, width: 24, dur: 7.5, delay: -6.5, hideMobile: true },
    { shape: "sparkle", style: { top: "12%", right: "40%" }, width: 16, twinkle: true, className: "text-brand-500", hideMobile: true },
    { shape: "bolt", style: { left: "30%", bottom: "8%" }, width: 18, dur: 10.5, delay: -9.1, hideMobile: true },
  ],
  section: [
    { shape: "triangle", style: { top: "6%", left: "4%" }, width: 44, rot: -10, dur: 6, hideMobile: true },
    { shape: "cone", style: { top: "10%", right: "6%" }, width: 36, rot: 14, dur: 7.5, delay: -1.3, hideMobile: true },
    { shape: "sparkle", style: { top: "4%", right: "30%" }, width: 18, twinkle: true, className: "text-accent-500" },
    { shape: "helmet", style: { right: "3%", bottom: "6%" }, width: 46, rot: 10, dur: 10.5, delay: -3.9, hideMobile: true },
    { shape: "plus", style: { left: "6%", bottom: "10%" }, width: 22, dur: 7.5, delay: -6.5, hideMobile: true },
  ],
  dark: [
    { shape: "sparkle", style: { top: "12%", left: "18%" }, width: 16, twinkle: true, className: "text-accent-300" },
    { shape: "sparkle", style: { right: "22%", bottom: "26%" }, width: 12, twinkle: true, delay: -1, className: "text-brand-300" },
    { shape: "triangle", style: { top: "10%", right: "7%" }, width: 44, rot: 10, dur: 9, hideMobile: true, className: "opacity-50" },
    { shape: "helmet", style: { left: "6%", bottom: "12%" }, width: 44, rot: -12, dur: 7.5, hideMobile: true, className: "opacity-50" },
  ],
};

export function FloatingDecor({ preset = "section" }: { preset?: keyof typeof presets }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {presets[preset].map((item, i) => (
        <div
          key={i}
          className={cn("parallax absolute", item.hideMobile && "hidden md:block", item.className)}
          style={{ ...item.style, width: item.width, ["--px" as string]: "40px" }}
        >
          <div
            className={item.twinkle ? "anim-twinkle" : "anim-float"}
            style={{
              ["--rot" as string]: `${item.rot ?? 0}deg`,
              ["--dur" as string]: `${item.dur ?? 7}s`,
              ["--delay" as string]: `${item.delay ?? 0}s`,
              ["--spin" as string]: i % 2 ? "-12deg" : "12deg",
              transform: `rotate(${item.rot ?? 0}deg)`,
            }}
          >
            <ShapeSvg shape={item.shape} />
          </div>
        </div>
      ))}
    </div>
  );
}
