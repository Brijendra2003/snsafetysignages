import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Vector illustrations of our product types. Used wherever a product or
 * category has no uploaded photo yet, so the catalogue always looks complete.
 */
export type ArtKind =
  | "prohibition"
  | "mandatory"
  | "warning"
  | "fire"
  | "marine"
  | "exit"
  | "twin-beam"
  | "bulkhead"
  | "beam"
  | "glow"
  | "glow-strip"
  | "glow-fire"
  | "plan"
  | "assembly"
  | "direction"
  | "tape-floor"
  | "tape-hazard"
  | "tape-antiskid"
  | "tape-reflective";

const bySlug: Record<string, ArtKind> = {
  "prohibition-signs": "prohibition",
  "mandatory-signs": "mandatory",
  "warning-signs": "warning",
  "fire-safety-signs": "fire",
  "imo-marine-signs": "marine",
  "sleek-led-exit-light": "exit",
  "twin-beam-emergency-light": "twin-beam",
  "bulkhead-emergency-light": "bulkhead",
  "beam-light": "beam",
  "glow-in-dark-exit-signs": "glow",
  "photoluminescent-way-finding-strips": "glow-strip",
  "glow-fire-equipment-markers": "glow-fire",
  "floor-wise-evacuation-plans": "plan",
  "assembly-point-signs": "assembly",
  "emergency-direction-signs": "direction",
  "floor-marking-tapes": "tape-floor",
  "hazard-warning-tapes": "tape-hazard",
  "anti-skid-tapes": "tape-antiskid",
  "reflective-tapes": "tape-reflective",
  // categories
  "safety-signages": "warning",
  "exit-lights": "exit",
  "photoluminescent-signages": "glow",
  "evacuation-plans": "plan",
  "safety-tapes": "tape-hazard",
};

const keywordKinds: [RegExp, ArtKind][] = [
  [/prohibit|no[- ]/i, "prohibition"],
  [/mandatory|ppe|wear/i, "mandatory"],
  [/fire|extinguish|hydrant/i, "fire"],
  [/marine|imo|ship/i, "marine"],
  [/exit/i, "exit"],
  [/twin/i, "twin-beam"],
  [/bulkhead/i, "bulkhead"],
  [/beam|emergency light/i, "beam"],
  [/glow|photolum/i, "glow"],
  [/evacuation|plan|map/i, "plan"],
  [/assembly/i, "assembly"],
  [/direction|arrow/i, "direction"],
  [/anti[- ]?skid|grip/i, "tape-antiskid"],
  [/reflect/i, "tape-reflective"],
  [/floor|marking/i, "tape-floor"],
  [/tape|hazard/i, "tape-hazard"],
  [/warning|danger|caution/i, "warning"],
];

export function artFor(slug?: string | null, categorySlug?: string | null, name?: string | null): ArtKind {
  if (slug && bySlug[slug]) return bySlug[slug];
  if (name) for (const [re, kind] of keywordKinds) if (re.test(name)) return kind;
  if (categorySlug && bySlug[categorySlug]) return bySlug[categorySlug];
  return "warning";
}

const backgrounds: Record<ArtKind, string> = {
  prohibition: "from-accent-50 to-white",
  mandatory: "from-brand-50 to-white",
  warning: "from-safety-300/30 to-white",
  fire: "from-accent-50 to-white",
  marine: "from-brand-50 to-white",
  exit: "from-success-50 to-white",
  "twin-beam": "from-ink-100 to-white",
  bulkhead: "from-ink-100 to-white",
  beam: "from-ink-100 to-white",
  glow: "from-ink-900 to-brand-950",
  "glow-strip": "from-ink-900 to-brand-950",
  "glow-fire": "from-ink-900 to-brand-950",
  plan: "from-brand-50 to-white",
  assembly: "from-success-50 to-white",
  direction: "from-success-50 to-white",
  "tape-floor": "from-safety-300/25 to-white",
  "tape-hazard": "from-safety-300/25 to-white",
  "tape-antiskid": "from-ink-100 to-white",
  "tape-reflective": "from-accent-50 to-white",
};

export function artBackground(kind: ArtKind) {
  return cn("bg-gradient-to-br", backgrounds[kind]);
}

function RunningMan({ x = 0, y = 0, s = 1, color = "#fff" }: { x?: number; y?: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="64" cy="14" r="9" fill={color} stroke="none" />
      <path d="M58 30 L46 56" />
      <path d="M57 32 L70 44 L80 38" />
      <path d="M56 32 L42 38 L32 32" />
      <path d="M46 56 L60 68 L56 86" />
      <path d="M46 56 L36 72 L20 74" />
    </g>
  );
}

function Label({ text, y = 178, color = "#0f172a" }: { text: string; y?: number; color?: string }) {
  return (
    <text x="100" y={y} textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="15" letterSpacing="1.5" fill={color}>
      {text}
    </text>
  );
}

function TapeRoll({ id, fill, strip }: { id: string; fill: string; strip?: string }) {
  return (
    <g>
      <path d="M92 132 L188 150 L188 178 L92 160 Z" fill={strip ?? fill} stroke="#0f172a" strokeOpacity=".15" />
      <circle cx="78" cy="112" r="56" fill="#0f172a" opacity=".12" transform="translate(4 6)" />
      <circle cx="78" cy="112" r="56" fill={fill} />
      <circle cx="78" cy="112" r="56" fill={`url(#${id}-shade)`} />
      <circle cx="78" cy="112" r="24" fill="#fff" />
      <circle cx="78" cy="112" r="24" fill="none" stroke="#cbd5e1" strokeWidth="4" />
    </g>
  );
}

export function SignArt({ kind, className, title }: { kind: ArtKind; className?: string; title?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");

  return (
    <svg viewBox="0 0 200 200" className={cn("h-full w-full", className)} role="img" aria-label={title ?? kind}>
      <defs>
        <pattern id={`${uid}-haz`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="20" height="20" fill="#facc15" />
          <rect width="10" height="20" fill="#0f172a" />
        </pattern>
        <pattern id={`${uid}-refl`} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="24" height="24" fill="#fff" />
          <rect width="12" height="24" fill="#dc2626" />
        </pattern>
        <pattern id={`${uid}-grit`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#1f2937" />
          <circle cx="2" cy="2" r=".9" fill="#64748b" />
          <circle cx="5" cy="4.5" r=".7" fill="#475569" />
        </pattern>
        <radialGradient id={`${uid}-shade`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {kind === "prohibition" && (
        <g>
          <rect x="34" y="20" width="132" height="168" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="100" cy="88" r="50" fill="#fff" stroke="#dc2626" strokeWidth="13" />
          <rect x="64" y="86" width="62" height="12" rx="2" fill="#0f172a" />
          <rect x="120" y="86" width="10" height="12" rx="1" fill="#f97316" />
          <path d="M126 82 q6 -10 0 -18 q-6 -8 2 -16" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M65 53 L135 123" stroke="#dc2626" strokeWidth="13" strokeLinecap="round" />
          <path d="M34 150 h132 v28 a10 10 0 0 1 -10 10 h-112 a10 10 0 0 1 -10 -10 z" fill="#dc2626" />
          <Label text="NO SMOKING" y={174} color="#fff" />
        </g>
      )}

      {kind === "mandatory" && (
        <g>
          <rect x="34" y="20" width="132" height="168" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="100" cy="88" r="56" fill="#1e3fd8" />
          <path d="M66 100 q0 -40 34 -42 q34 2 34 42 z" fill="#fff" />
          <rect x="58" y="98" width="84" height="10" rx="5" fill="#fff" />
          <rect x="96" y="58" width="8" height="40" rx="3" fill="#1e3fd8" opacity=".35" />
          <path d="M34 150 h132 v28 a10 10 0 0 1 -10 10 h-112 a10 10 0 0 1 -10 -10 z" fill="#1e3fd8" />
          <Label text="WEAR HELMET" y={174} color="#fff" />
        </g>
      )}

      {kind === "warning" && (
        <g>
          <path d="M100 18 L184 162 H16 Z" fill="#0f172a" strokeLinejoin="round" stroke="#0f172a" strokeWidth="10" />
          <path d="M100 38 L166 152 H34 Z" fill="#facc15" />
          <path d="M106 70 L84 112 H100 L92 140 L120 96 H104 L114 70 Z" fill="#0f172a" />
          <Label text="HIGH VOLTAGE" y={190} />
        </g>
      )}

      {kind === "fire" && (
        <g>
          <rect x="40" y="24" width="120" height="120" rx="10" fill="#dc2626" />
          <rect x="88" y="62" width="30" height="68" rx="8" fill="#fff" />
          <rect x="96" y="50" width="14" height="14" rx="2" fill="#fff" />
          <path d="M110 54 h18 l8 -6" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M88 74 q-18 6 -20 34" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M60 46 q8 10 2 20 q10 -4 10 -14 q6 8 2 16" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <Label text="FIRE EXTINGUISHER" y={172} color="#b91c1c" />
        </g>
      )}

      {kind === "marine" && (
        <g>
          <rect x="34" y="24" width="132" height="132" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="100" cy="90" r="48" fill="#f97316" />
          <circle cx="100" cy="90" r="24" fill="#fff" />
          {[0, 90, 180, 270].map((r) => (
            <path key={r} d="M100 42 a48 48 0 0 1 20 4 l-10 23 a24 24 0 0 0 -10 -3 z" fill="#fff" transform={`rotate(${r + 20} 100 90)`} />
          ))}
          <Label text="IMO · LIFEBUOY" y={180} color="#1a33ae" />
        </g>
      )}

      {kind === "exit" && (
        <g>
          <ellipse cx="100" cy="112" rx="88" ry="46" fill="#22c55e" opacity=".35" filter={`url(#${uid}-glow)`} />
          <rect x="22" y="58" width="156" height="12" rx="4" fill={`url(#${uid}-metal)`} stroke="#94a3b8" />
          <rect x="26" y="70" width="148" height="88" rx="6" fill="#16a34a" stroke="#cbd5e1" strokeWidth="4" />
          <RunningMan x={36} y={78} s={0.78} />
          <rect x="104" y="86" width="16" height="56" fill="#fff" opacity=".9" />
          <text x="146" y="122" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="22" fill="#fff">EXIT</text>
          <path d="M132 134 h28 m-8 -7 l8 7 l-8 7" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {(kind === "twin-beam" || kind === "beam") && (
        <g>
          <ellipse cx="100" cy="150" rx="70" ry="10" fill="#0f172a" opacity=".1" />
          <rect x="40" y="96" width="120" height="50" rx="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="146" cy="110" r="4" fill="#16a34a" className="anim-glow" />
          <rect x="54" y="120" width="60" height="6" rx="3" fill="#cbd5e1" />
          {(kind === "twin-beam" ? [70, 130] : [100]).map((cx, i) => (
            <g key={cx}>
              <path d={`M${cx} 74 L${cx + (i === 0 && kind === "twin-beam" ? -60 : 60)} 20 L${cx + (i === 0 && kind === "twin-beam" ? -20 : 90)} 10 Z`} fill="#fde047" opacity=".35" filter={`url(#${uid}-glow)`} />
              <rect x={cx - 6} y="82" width="12" height="16" fill="#64748b" />
              <circle cx={cx} cy="70" r="20" fill="#334155" />
              <circle cx={cx} cy="70" r="13" fill="#fef9c3" />
              <circle cx={cx} cy="70" r="7" fill="#fde047" />
            </g>
          ))}
        </g>
      )}

      {kind === "bulkhead" && (
        <g>
          <ellipse cx="100" cy="100" rx="78" ry="54" fill="#fde047" opacity=".3" filter={`url(#${uid}-glow)`} />
          <ellipse cx="100" cy="100" rx="70" ry="46" fill="#334155" />
          <ellipse cx="100" cy="100" rx="58" ry="36" fill="#fef9c3" />
          {[-24, -8, 8, 24].map((dy) => (
            <line key={dy} x1="46" x2="154" y1={100 + dy} y2={100 + dy} stroke="#334155" strokeWidth="4" />
          ))}
          <line x1="100" x2="100" y1="64" y2="136" stroke="#334155" strokeWidth="4" />
          <Label text="IP65" y={176} color="#334155" />
        </g>
      )}

      {kind === "glow" && (
        <g>
          <rect x="24" y="54" width="152" height="92" rx="8" fill="#bef264" opacity=".55" filter={`url(#${uid}-glow)`} className="anim-glow" />
          <rect x="28" y="58" width="144" height="84" rx="6" fill="#d9f99d" />
          <RunningMan x={38} y={62} s={0.78} color="#15803d" />
          <rect x="104" y="72" width="16" height="56" fill="#15803d" />
          <path d="M132 100 h30 m-9 -8 l9 8 l-9 8" stroke="#15803d" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Label text="GLOWS 8+ HOURS" y={176} color="#d9f99d" />
        </g>
      )}

      {kind === "glow-strip" && (
        <g>
          <path d="M10 150 L190 100 L190 124 L10 174 Z" fill="#bef264" opacity=".5" filter={`url(#${uid}-glow)`} className="anim-glow" />
          <path d="M10 150 L190 100 L190 124 L10 174 Z" fill="#d9f99d" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${36 + i * 40} ${152 - i * 11} l14 -4 l-4 -6 m4 6 l-6 6`} stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" transform={`rotate(-15 ${36 + i * 40} ${152 - i * 11})`} />
          ))}
          <path d="M30 40 h60 v24 h40 v24 h40" stroke="#d9f99d" strokeWidth="6" fill="none" opacity=".6" />
        </g>
      )}

      {kind === "glow-fire" && (
        <g>
          <rect x="44" y="30" width="112" height="112" rx="10" fill="#bef264" opacity=".5" filter={`url(#${uid}-glow)`} className="anim-glow" />
          <rect x="48" y="34" width="104" height="104" rx="8" fill="#d9f99d" />
          <rect x="88" y="64" width="26" height="60" rx="7" fill="#b91c1c" />
          <rect x="95" y="54" width="12" height="12" rx="2" fill="#b91c1c" />
          <path d="M107 58 h16 l7 -5" stroke="#b91c1c" strokeWidth="5" fill="none" strokeLinecap="round" />
          <Label text="VISIBLE IN BLACKOUT" y={174} color="#d9f99d" />
        </g>
      )}

      {kind === "plan" && (
        <g>
          <rect x="22" y="24" width="156" height="152" rx="8" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="22" y="24" width="156" height="22" rx="8" fill="#16a34a" />
          <text x="100" y="40" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="11" fill="#fff" letterSpacing="1">EVACUATION PLAN</text>
          <g stroke="#94a3b8" strokeWidth="2.5" fill="none">
            <rect x="34" y="56" width="132" height="108" />
            <path d="M34 100 h50 M84 56 v44 M118 56 v34 M118 90 h48 M34 130 h40 M100 130 v34 M130 120 v44" />
          </g>
          <path d="M58 82 V114 H108 V146 H160" stroke="#dc2626" strokeWidth="4" fill="none" strokeDasharray="7 6" strokeLinecap="round" />
          <circle cx="58" cy="80" r="7" fill="#1e3fd8" />
          <circle cx="58" cy="80" r="13" fill="#1e3fd8" opacity=".25" />
          <rect x="150" y="140" width="22" height="14" rx="2" fill="#16a34a" />
          <path d="M155 147 h12 m-4 -4 l4 4 l-4 4" stroke="#fff" strokeWidth="2" fill="none" />
        </g>
      )}

      {kind === "assembly" && (
        <g>
          <rect x="36" y="16" width="128" height="148" rx="10" fill="#16a34a" />
          {[
            [70, 54], [130, 54], [70, 106], [130, 106],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`} fill="#fff">
              <circle cx={cx} cy={cy - 12} r="7" />
              <rect x={cx - 7} y={cy - 3} width="14" height="20" rx="5" />
            </g>
          ))}
          <path d="M84 64 L96 76 M116 64 L104 76 M84 96 L96 84 M116 96 L104 84" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <rect x="94" y="164" width="12" height="30" fill="#94a3b8" />
          <Label text="ASSEMBLY POINT" y={152} color="#fff" />
        </g>
      )}

      {kind === "direction" && (
        <g>
          <rect x="18" y="56" width="164" height="88" rx="8" fill="#16a34a" />
          <RunningMan x={24} y={62} s={0.78} />
          <path d="M100 100 h60 m-20 -22 l22 22 l-22 22" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {kind === "tape-floor" && <TapeRoll id={uid} fill="#facc15" />}
      {kind === "tape-hazard" && <TapeRoll id={uid} fill={`url(#${uid}-haz)`} />}
      {kind === "tape-antiskid" && <TapeRoll id={uid} fill={`url(#${uid}-grit)`} />}
      {kind === "tape-reflective" && <TapeRoll id={uid} fill={`url(#${uid}-refl)`} />}
    </svg>
  );
}
