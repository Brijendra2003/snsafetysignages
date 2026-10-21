import { Clock, Download, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/brand-icons";
import { getCategories, getSettings } from "@/lib/data/public";
import { mainNav, site, standards, telLink, whatsappLink } from "@/lib/site";

export async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  const socials = [
    { href: settings.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { href: settings.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon },
    { href: settings.youtube_url, label: "YouTube", Icon: YoutubeIcon },
    { href: whatsappLink(settings.whatsapp), label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter((s) => s.href);

  return (
    <footer className="relative bg-brand-950 pb-28 text-brand-100 md:pb-0">
      <div aria-hidden className="hazard-stripes h-2 w-full opacity-90" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Link href="/" aria-label={`${site.name}, home`} className="inline-block">
            <Image src="/brand/logo-light.png" alt={site.name} width={640} height={414} className="h-20 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200/80">
            Manufacturer of safety signages, emergency lights and evacuation plans. Made in Vasai, delivered across India.
          </p>
          <p className="hand mt-4 text-2xl text-accent-300">“Safety is our responsibility.”</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-accent-600 hover:ring-accent-600"
                  >
                    <Icon className="size-4.5 text-white" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white! uppercase">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="transition hover:text-white">
                Quote Basket
              </Link>
            </li>
            {settings.catalog_url && (
              <li>
                <a href={settings.catalog_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-white">
                  <Download className="size-3.5" /> Download Catalogue
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white! uppercase">Products</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.slug}`} className="transition hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <address className="not-italic">
          <h3 className="text-sm font-bold tracking-wider text-white! uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent-300" />
              <a href={telLink(settings.phone)} className="font-semibold text-white hover:text-accent-200">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent-300" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-300" />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent-300" />
              {settings.hours}
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-brand-200/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.founded}–<CopyrightYear /> {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            {standards.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
