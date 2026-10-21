import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { whatsappLink } from "@/lib/site";

/** Floating WhatsApp button on desktop (mobile uses the bottom action bar). */
export function WhatsAppFab({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={whatsappLink(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-6 bottom-6 z-40 hidden items-center gap-3 md:flex"
    >
      <span className="pointer-events-none translate-x-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-ink-900 opacity-0 shadow-lift ring-1 ring-ink-100 transition group-hover:translate-x-0 group-hover:opacity-100">
        Chat on WhatsApp
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift transition group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-30 [animation-duration:2.4s]" />
        <WhatsAppIcon className="relative size-7" />
      </span>
    </a>
  );
}
