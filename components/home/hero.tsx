import { ArrowRight, BadgeCheck, MapPin, Phone, Truck, Zap } from "lucide-react";
import { Character } from "@/components/site/character";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { FloatingDecor } from "@/components/ui/floating-decor";
import { SignArt } from "@/components/ui/sign-art";
import { characters } from "@/lib/characters";
import { getSettings } from "@/lib/data/public";
import { standards, telLink, whatsappLink } from "@/lib/site";

/** Vector stage shown until a 3D hero character is supplied. */
function HeroScene() {
  return (
    <div className="relative aspect-[1/1.02] w-full">
      <div className="blob absolute inset-[6%] bg-gradient-to-br from-brand-100 via-white to-accent-100" />
      <div className="absolute inset-[14%] rounded-full border-2 border-dashed border-brand-200" />
      <div className="anim-float absolute top-[6%] left-[16%] w-[60%]" style={{ ["--dur" as string]: "7s", ["--dy" as string]: "-12px", ["--spin" as string]: "0deg" }}>
        <div className="drop-shadow-[0_24px_30px_rgba(22,163,74,0.35)]">
          <SignArt kind="exit" title="LED exit light" />
        </div>
      </div>
      <div className="anim-float absolute top-[48%] left-[2%] w-[34%]" style={{ ["--rot" as string]: "-8deg", ["--dur" as string]: "8s", ["--delay" as string]: "-2s", ["--spin" as string]: "4deg" }}>
        <div className="drop-shadow-[0_18px_24px_rgba(15,23,42,0.25)]">
          <SignArt kind="warning" title="Warning sign" />
        </div>
      </div>
      <div className="anim-float absolute top-[54%] right-[4%] w-[28%]" style={{ ["--rot" as string]: "7deg", ["--dur" as string]: "9s", ["--delay" as string]: "-4s", ["--spin" as string]: "-4deg" }}>
        <div className="drop-shadow-[0_18px_24px_rgba(15,23,42,0.22)]">
          <SignArt kind="prohibition" title="Prohibition sign" />
        </div>
      </div>
      <div className="anim-float absolute bottom-[0%] left-[36%] w-[30%]" style={{ ["--dur" as string]: "6.5s", ["--delay" as string]: "-1s", ["--spin" as string]: "6deg" }}>
        <SignArt kind="tape-hazard" title="Hazard tape" />
      </div>
    </div>
  );
}

export async function Hero() {
  const settings = await getSettings();

  return (
    <section aria-labelledby="hero-title" className="relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[22rem] rounded-full bg-accent-100/60 blur-3xl" />
      <FloatingDecor preset="hero" />

      <div className="container-page relative grid items-center gap-8 pt-8 pb-12 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-14 lg:pb-20">
        <div className="max-w-xl">
          <p
            className="eyebrow anim-intro inline-flex items-center gap-2 rounded-full bg-accent-50 py-1.5 pr-3.5 pl-2 ring-1 ring-accent-100"
            style={{ ["--d" as string]: "0ms" }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-600" />
            </span>
            Manufacturer · Vasai, Mumbai
          </p>

          <h1
            id="hero-title"
            className="mt-5 text-[2.6rem] leading-[0.98] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-[3.9rem] xl:text-[4.3rem]"
          >
            <span className="anim-intro block" style={{ ["--d" as string]: "100ms" }}>
              Safety Signs
            </span>
            <span className="anim-intro block" style={{ ["--d" as string]: "160ms" }}>
              &amp; Exit Lights
            </span>
            <span className="anim-intro relative inline-block text-accent-600" style={{ ["--d" as string]: "220ms" }}>
              made to be seen.
              <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-safety-400">
                <path className="anim-draw" pathLength={1} d="M4 14 C 80 4, 200 4, 296 12" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="anim-intro mt-7 text-xl leading-snug font-semibold text-ink-900 sm:text-2xl" style={{ ["--d" as string]: "340ms" }}>
            ISO 7010 compliant, made in-house, delivered across India.
          </p>
          <p className="anim-intro mt-4 text-base leading-relaxed text-ink-500 sm:text-lg" style={{ ["--d" as string]: "440ms" }}>
            Safety signages, LED emergency &amp; exit lights, glow-in-the-dark signs, evacuation plans and floor marking
            tapes for factories, hospitals, offices, metros and construction sites. Bulk orders dispatched in 48–72 hours.
          </p>

          <div className="anim-intro mt-8 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "540ms" }}>
            <ButtonLink href="/contact" size="lg" className="btn-shine">
              Get Free Quote
              <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonAnchor href={telLink(settings.phone)} variant="secondary" size="lg">
              <Phone className="size-4.5" /> Call Now
            </ButtonAnchor>
            <ButtonAnchor
              href={whatsappLink(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="max-sm:hidden"
            >
              <WhatsAppIcon className="size-5" /> WhatsApp
            </ButtonAnchor>
          </div>

          <ul className="anim-intro mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-700" style={{ ["--d" as string]: "640ms" }}>
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4 text-accent-600" /> Pan-India delivery
            </li>
            <li className="flex items-center gap-1.5">
              <Zap className="size-4 text-accent-600" /> Bulk &amp; custom orders welcome
            </li>
          </ul>

          <ul aria-label="Standards we comply with" className="mt-6 flex flex-wrap items-center gap-2">
            {standards.map((s, i) => (
              <li
                key={s}
                className="anim-pop rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink-900 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:ring-accent-500"
                style={{ ["--d" as string]: `${760 + i * 70}ms` }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="anim-intro relative mx-auto w-full max-w-[600px] lg:-mr-6" style={{ ["--d" as string]: "250ms" }}>
          <Character slot={characters.hero} priority fallback={<HeroScene />} />

          <div className="anim-float absolute top-[20%] right-0 sm:right-2" style={{ ["--dur" as string]: "6s", ["--dy" as string]: "-10px", ["--spin" as string]: "0deg" }}>
            <div className="anim-pop flex items-center gap-2.5 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 shadow-lift ring-1 ring-ink-100 backdrop-blur" style={{ ["--d" as string]: "1100ms" }}>
              <span className="grid size-9 place-items-center rounded-xl bg-success-50 text-success-600">
                <BadgeCheck className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.8rem] font-bold text-ink-900">ISO 7010 compliant</span>
                <span className="block text-[0.7rem] text-ink-500">Audit &amp; Fire NOC ready</span>
              </span>
            </div>
          </div>
          <div className="anim-float absolute right-0 bottom-[6%] sm:right-4" style={{ ["--dur" as string]: "7s", ["--dy" as string]: "-12px", ["--delay" as string]: "-2s", ["--spin" as string]: "0deg" }}>
            <div className="anim-pop flex items-center gap-2.5 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 shadow-lift ring-1 ring-ink-100 backdrop-blur" style={{ ["--d" as string]: "1300ms" }}>
              <span className="grid size-9 place-items-center rounded-xl bg-accent-50 text-accent-600">
                <Truck className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.8rem] font-bold text-ink-900">Dispatch in 48–72 hrs</span>
                <span className="block text-[0.7rem] text-ink-500">Bulk orders, all India</span>
              </span>
            </div>
          </div>
          <div className="anim-float absolute bottom-[2%] left-0 hidden sm:block lg:-left-6" style={{ ["--dur" as string]: "8s", ["--dy" as string]: "-8px", ["--delay" as string]: "-4s", ["--spin" as string]: "0deg" }}>
            <div className="anim-pop flex items-center gap-2 rounded-full bg-brand-900 py-1.5 pr-3.5 pl-1.5 text-white shadow-lift" style={{ ["--d" as string]: "1500ms" }}>
              <span className="grid size-7 place-items-center rounded-full bg-accent-600 text-xs font-bold">★</span>
              <span className="text-[0.75rem] font-semibold">4.9 Google rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
