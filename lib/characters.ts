/**
 * 3D character artwork slots.
 *
 * To use your own render: export a transparent PNG/WebP, drop it in
 * /public/characters/ with the file name below, then set `src` to its path,
 * e.g. src: "/characters/hero-engineer.png". Until then, each slot shows a
 * built-in vector illustration, so the layout never looks empty.
 */
export type CharacterSlot = {
  src: string | null;
  width: number;
  height: number;
  alt: string;
  /** What the artwork should show (for the illustrator / 3D artist). */
  brief: string;
};

export const characters = {
  hero: {
    src: null,
    width: 1000,
    height: 1100,
    alt: "Safety engineer in a hard hat holding an exit sign",
    brief:
      "hero-engineer.png: friendly Indian safety engineer, yellow hard hat, hi-vis vest, holding a green EXIT sign or giving a thumbs up. Full body or knees-up, facing slightly left.",
  },
  about: {
    src: null,
    width: 900,
    height: 1000,
    alt: "Factory technician installing a safety sign",
    brief:
      "about-installer.png: technician on a small ladder or standing, fixing a yellow warning sign to a wall, tool belt, hard hat.",
  },
  quote: {
    src: null,
    width: 800,
    height: 900,
    alt: "Site supervisor holding a clipboard",
    brief: "quote-supervisor.png: supervisor with clipboard/tablet, pointing to it, hi-vis vest. Used in the quote CTA.",
  },
  contact: {
    src: null,
    width: 800,
    height: 900,
    alt: "Customer support executive with a headset",
    brief: "contact-support.png: support executive with headset, waving, wearing a branded red/blue polo or vest.",
  },
  notFound: {
    src: null,
    width: 700,
    height: 800,
    alt: "Confused worker next to a traffic cone",
    brief: "404-worker.png: worker scratching head next to a traffic cone and a fallen sign. Used on the 404 page.",
  },
} satisfies Record<string, CharacterSlot>;
