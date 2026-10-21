import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Character } from "@/components/site/character";
import { LeadForm } from "@/components/site/lead-form";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { ButtonAnchor } from "@/components/ui/button";
import { SignArt } from "@/components/ui/sign-art";
import { characters } from "@/lib/characters";
import { getSettings } from "@/lib/data/public";
import { telLink, whatsappLink } from "@/lib/site";

/** Closing "Ready to make your workplace safer?" block with a short lead form. */
export async function CtaSection() {
  const settings = await getSettings();

  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-24">
      <div className="container-page">
        <div className="reveal-scale relative overflow-hidden rounded-[2rem] bg-brand-900 p-6 shadow-lift sm:p-10 lg:p-14">
          <div aria-hidden className="absolute -top-20 -right-20 size-80 rounded-full bg-accent-600/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-10 size-80 rounded-full bg-brand-600/40 blur-3xl" />
          <div aria-hidden className="hazard-stripes absolute top-0 left-0 h-2 w-full opacity-80" />

          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="text-brand-100">
              <p className="eyebrow text-accent-300!">Free quotation</p>
              <h2 id="cta-title" className="mt-3 text-3xl leading-[1.1] font-extrabold text-white! sm:text-4xl lg:text-5xl">
                Ready to make your workplace <span className="text-safety-400">safer?</span>
              </h2>
              <p className="mt-4 max-w-md text-brand-200/90 sm:text-lg">
                Tell us what you need and we&apos;ll call you back with options and a clear price, usually the same day.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-accent-300" />
                  <a href={telLink(settings.phone)} className="font-semibold text-white hover:text-accent-200">{settings.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-accent-300" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent-300" />
                  <span>{settings.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="size-4 text-accent-300" />
                  {settings.hours}
                </li>
              </ul>
              <ButtonAnchor
                href={whatsappLink(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                className="mt-8"
              >
                <WhatsAppIcon className="size-5" /> Send your list on WhatsApp
              </ButtonAnchor>

              <div className="mt-10 hidden w-56 lg:block">
                <Character
                  slot={characters.quote}
                  fallback={
                    <div className="anim-float w-40 opacity-90" style={{ ["--rot" as string]: "-6deg", ["--spin" as string]: "6deg" }}>
                      <SignArt kind="assembly" title="Assembly point sign" />
                    </div>
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl bg-canvas p-6 shadow-lift sm:p-8">
              <h3 className="text-xl font-bold">Request a call back</h3>
              <p className="mt-1 text-sm text-ink-500">Takes less than a minute.</p>
              <LeadForm source="home" compact className="mt-6" submitLabel="Get my quote" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
