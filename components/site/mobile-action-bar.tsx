import { FileText, Phone } from "lucide-react";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { telLink, whatsappLink } from "@/lib/site";

/** Sticky call / WhatsApp / quote bar on small screens. */
export function MobileActionBar({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_#0f172a33] backdrop-blur md:hidden">
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
        <a href={telLink(phone)} className="flex flex-col items-center gap-1 rounded-xl py-2 text-ink-900 active:bg-ink-100">
          <Phone className="size-5" /> Call
        </a>
        <a
          href={whatsappLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl py-2 text-whatsapp-dark active:bg-ink-100"
        >
          <WhatsAppIcon className="size-5" /> WhatsApp
        </a>
        <Link href="/contact" className="flex flex-col items-center gap-1 rounded-xl bg-accent-600 py-2 text-white active:bg-accent-700">
          <FileText className="size-5" /> Get Quote
        </Link>
      </div>
    </div>
  );
}
