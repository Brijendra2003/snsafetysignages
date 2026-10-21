import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Character } from "@/components/site/character";
import { Faq } from "@/components/site/faq";
import { LeadForm } from "@/components/site/lead-form";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { SignArt } from "@/components/ui/sign-art";
import { characters } from "@/lib/characters";
import { getSettings } from "@/lib/data/public";
import { telLink, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, WhatsApp or visit SN Safety & Signages at Dewan Industrial Estate, Vasai East. Get a free quote for safety signs, exit lights and evacuation plans.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  const channels = [
    {
      icon: Phone,
      title: "Call us",
      value: settings.phone,
      href: telLink(settings.phone),
      hint: settings.hours,
      tone: "bg-brand-50 text-brand-700",
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      value: "Chat with our team",
      href: whatsappLink(settings.whatsapp),
      hint: "Send photos, lists or floor plans",
      tone: "bg-success-50 text-whatsapp-dark",
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      hint: "We reply within one working day",
      tone: "bg-accent-50 text-accent-600",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact us" }]}
        title={
          <>
            Let&apos;s make your site <span className="text-accent-600">safer</span>
          </>
        }
        description="Share your requirement and we'll get back with options and a clear quotation, usually the same day. Prefer to talk? Call or WhatsApp us directly."
        aside={
          <Character
            slot={characters.contact}
            fallback={
              <div className="relative mx-auto aspect-square w-full max-w-sm">
                <div className="blob absolute inset-4 bg-gradient-to-br from-white to-success-50" />
                <div className="anim-float absolute top-[10%] left-[8%] w-[60%]">
                  <SignArt kind="direction" />
                </div>
                <div className="anim-float absolute right-[6%] bottom-[8%] w-[46%]" style={{ ["--delay" as string]: "-3s", ["--rot" as string]: "5deg" }}>
                  <SignArt kind="assembly" />
                </div>
              </div>
            }
          />
        }
      />

      <section className="container-page pb-16">
        <ul className="grid gap-4 md:grid-cols-3">
          {channels.map(({ icon: Icon, title, value, href, hint, tone, external }, i) => (
            <li key={title} className="anim-intro" style={{ ["--d" as string]: `${i * 80}ms` }}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex h-full items-start gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className={`wiggle-target grid size-12 shrink-0 place-items-center rounded-xl ${tone}`}>
                  <Icon className="size-6" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink-500">{title}</span>
                  <span className="mt-0.5 block font-display text-lg font-bold break-words text-ink-900 group-hover:text-accent-700">
                    {value}
                  </span>
                  <span className="mt-1 block text-sm text-ink-500">{hint}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="reveal rounded-3xl bg-white p-6 shadow-lift ring-1 ring-ink-100 sm:p-10">
            <p className="eyebrow">Send an enquiry</p>
            <h2 className="mt-2 text-3xl font-extrabold">Tell us what you need</h2>
            <p className="mt-2 text-ink-500">The more detail you share, the more accurate our quote.</p>
            <LeadForm source="contact" className="mt-8" />
          </div>

          <div className="reveal flex flex-col gap-5">
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100">
              <iframe
                title="SN Safety & Signages location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.map_query)}&output=embed`}
                className="h-72 w-full border-0 lg:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="space-y-4 p-6">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  <span>
                    <span className="block font-bold text-ink-900">Factory &amp; office</span>
                    <span className="text-ink-500">{settings.address}</span>
                  </span>
                </p>
                <p className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-accent-600" />
                  <span>
                    <span className="block font-bold text-ink-900">Working hours</span>
                    <span className="text-ink-500">{settings.hours}</span>
                  </span>
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.map_query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:underline"
                >
                  Get directions →
                </a>
              </div>
            </div>
            <div className="hazard-stripes rounded-3xl p-1.5">
              <div className="rounded-[1.25rem] bg-ink-900 p-6 text-white">
                <p className="font-display text-lg font-bold">Urgent requirement or site audit tomorrow?</p>
                <p className="mt-1 text-sm text-ink-300">Call us now and we&apos;ll prioritise your order.</p>
                <a href={telLink(settings.phone)} className="mt-4 inline-flex items-center gap-2 font-display text-2xl font-extrabold text-safety-400 hover:text-safety-300">
                  <Phone className="size-5" /> {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
