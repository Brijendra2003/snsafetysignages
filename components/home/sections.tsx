import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Factory,
  Flame,
  Fuel,
  HardHat,
  Headset,
  Hospital,
  IndianRupee,
  Landmark,
  MessageSquareText,
  Paintbrush,
  PenTool,
  Quote,
  Ship,
  Star,
  Train,
  Truck,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/site/product-card";
import { ButtonLink } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { FloatingDecor } from "@/components/ui/floating-decor";
import { Marquee } from "@/components/ui/marquee";
import { ProductVisual } from "@/components/ui/product-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCategories,
  getClients,
  getFeaturedProducts,
  getProducts,
  getSettings,
  getTestimonials,
} from "@/lib/data/public";
import { cldUrl, initials } from "@/lib/utils";

/* ---------------- Promise strip ---------------- */

const promises = [
  { icon: BadgeCheck, title: "ISO & BIS Compliant", text: "Symbols and colours as per ISO 7010 and IS 9457, ready for audits." },
  { icon: Factory, title: "Made In-House", text: "Printed, cut and assembled at our own Vasai factory. Factory prices." },
  { icon: Truck, title: "48–72 hr Dispatch", text: "Bulk orders packed and shipped anywhere in India within days." },
];

export function PromiseStrip() {
  return (
    <div className="container-page pb-6 sm:pb-8">
      <ul aria-label="Our promise" className="grid divide-ink-100 sm:grid-cols-3 sm:divide-x">
        {promises.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className={`reveal flex flex-col items-center px-6 py-6 text-center sm:py-2 ${i ? "border-t border-ink-100 sm:border-t-0" : ""}`}>
            <span className="grid size-14 place-items-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-1.5 max-w-[17rem] text-sm leading-relaxed text-ink-500">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Marquee bands ---------------- */

export async function MarqueeBands() {
  const products = await getProducts();
  const productNames = products.slice(0, 12).map((p) => p.name);
  const tick = <span aria-hidden className="size-2.5 rotate-45 bg-safety-400" />;

  return (
    <section aria-label="What we make" className="relative z-10 -my-2 overflow-hidden py-10">
      <div className="-rotate-[1.5deg] bg-brand-900 py-4 shadow-lift sm:py-5">
        <Marquee
          duration={45}
          items={productNames}
          separator={tick}
          itemClassName="font-display text-xl font-bold text-white sm:text-2xl"
        />
      </div>
      <div className="relative -mt-2 rotate-[1deg] bg-white py-3 shadow-soft ring-1 ring-ink-100 sm:py-4">
        <Marquee
          duration={55}
          reverse
          items={["ISO 7010 symbols", "IS 9457 colours", "NBC 2016 ready", "Fire NOC compliant", "IMO marine grade", "BIS standard", "Custom sizes", "Bilingual signs"]}
          separator={<span aria-hidden className="text-accent-600">✦</span>}
          itemClassName="font-display text-lg font-bold text-ink-900 sm:text-xl"
        />
      </div>
    </section>
  );
}

/* ---------------- Categories ---------------- */

export async function CategoryGrid() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const counts = new Map<string, number>();
  for (const p of products) if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);

  return (
    <section aria-labelledby="categories-title" className="relative overflow-hidden bg-brand-50 py-20 sm:py-24">
      <FloatingDecor />
      <div className="container-page relative">
        <SectionHeading
          id="categories-title"
          eyebrow="What we make"
          title={
            <>
              Everything your site needs to be <span className="text-accent-600">audit-ready</span>
            </>
          }
          description="From a single no-smoking sign to a full plant fit-out, we design, print and dispatch every safety signage product from one factory."
        />
        <ul className="stagger mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <li key={c.id} style={{ ["--i" as string]: i }} className={i === 0 ? "lg:row-span-2" : ""}>
              <Link
                href={`/products?category=${c.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <ProductVisual
                  image={c.image_url}
                  slug={c.slug}
                  name={c.name}
                  className={i === 0 ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : "aspect-[16/9]"}
                  artClassName={i === 0 ? "w-[60%]" : "w-[42%]"}
                />
                <div className="flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">
                      {counts.get(c.id) ?? 0} products{c.tagline ? ` · ${c.tagline}` : ""}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold">{c.name}</h3>
                    {i === 0 && c.description && <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.description}</p>}
                  </div>
                  <span className="wiggle-target grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-accent-600 group-hover:text-white">
                    <ArrowRight className="size-5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Featured products ---------------- */

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  return (
    <section aria-labelledby="featured-title" className="py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="featured-title"
            align="left"
            eyebrow="Best sellers"
            title={
              <>
                Popular with <span className="text-accent-600">safety officers</span>
              </>
            }
            description="Add products to your quote basket and get one consolidated price for your whole site."
          />
          <ButtonLink href="/products" variant="secondary" className="reveal shrink-0">
            View all products <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <ul className="stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.id} style={{ ["--i" as string]: i }}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */

const steps = [
  { icon: MessageSquareText, title: "Share your requirement", text: "Send a list, a photo of your site or your floor plan by form, call or WhatsApp." },
  { icon: PenTool, title: "Design & quote", text: "We suggest the right signs and sizes, share artwork proofs and a clear quotation." },
  { icon: Factory, title: "Manufacture", text: "Once approved, your order is printed and assembled at our Vasai factory." },
  { icon: Truck, title: "Dispatch & install", text: "Packed safely and shipped across India. Installation support in Mumbai region." },
];

export function ProcessSteps() {
  return (
    <section aria-labelledby="process-title" className="relative overflow-hidden bg-brand-900 py-20 text-brand-100 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-brand-700/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 size-80 rounded-full bg-accent-600/20 blur-3xl" />
      <FloatingDecor preset="dark" />
      <div className="container-page relative">
        <SectionHeading
          id="process-title"
          dark
          eyebrow="How it works"
          title={
            <>
              From enquiry to install in <span className="text-accent-500">4 simple steps</span>
            </>
          }
          description="No guesswork and no surprise bills. You approve the design and price before we print."
        />
        <ol className="stagger relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <svg aria-hidden className="absolute top-12 right-[12%] left-[12%] hidden h-2 lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
            <line x1="0" y1="1" x2="100" y2="1" stroke="#ffffff33" strokeWidth="2" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          </svg>
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              style={{ ["--i" as string]: i }}
              className="group relative rounded-2xl bg-brand-900/80 p-6 ring-1 ring-white/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:bg-brand-800 hover:ring-accent-500/50"
            >
              <div className="flex items-center justify-between">
                <span className="anim-pulse-ring grid size-12 place-items-center rounded-xl bg-accent-600 text-white shadow-cta" style={{ ["--delay" as string]: `${i * 0.6}s` }}>
                  <Icon className="size-5.5" />
                </span>
                <span aria-hidden className="font-display text-5xl font-extrabold text-white/10">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white!">
                <span className="sr-only">Step {i + 1}: </span>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-200/85">{text}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-12 flex justify-center">
          <ButtonLink href="/contact" size="lg" className="btn-shine">
            Start with step 1 <ArrowRight className="size-5" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Industries ---------------- */

const industries = [
  { icon: Factory, name: "Manufacturing" },
  { icon: HardHat, name: "Construction" },
  { icon: Fuel, name: "Oil & Gas" },
  { icon: Flame, name: "Fire Safety" },
  { icon: Train, name: "Railways & Metro" },
  { icon: Landmark, name: "Government / PSU" },
  { icon: Hospital, name: "Hospitals" },
  { icon: Warehouse, name: "Warehousing" },
  { icon: Building2, name: "Offices & Malls" },
  { icon: Ship, name: "Marine & Ports" },
];

export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries we serve"
          title={
            <>
              Trusted on <span className="text-accent-600">shop floors to metro stations</span>
            </>
          }
          description="Every industry has its own hazards and its own regulations. We know which signs each one needs."
        />
        <ul className="stagger mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map(({ icon: Icon, name }, i) => (
            <li
              key={name}
              style={{ ["--i" as string]: i }}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-6 text-center shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift hover:ring-accent-200"
            >
              <span className="wiggle-target grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-accent-600 group-hover:text-white">
                <Icon className="size-6" />
              </span>
              <span className="text-sm font-bold text-ink-900">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Why us + stats ---------------- */

const reasons = [
  { icon: Factory, title: "In-house manufacturing", text: "No middlemen. Better control on quality, timelines and price." },
  { icon: ClipboardCheck, title: "Compliance ready", text: "IS 9457, ISO 7010, NBC India and Factory Act norms built in." },
  { icon: Truck, title: "All-India shipping", text: "Safe packaging and reliable courier and transport partners." },
  { icon: Paintbrush, title: "Custom designs", text: "Your logo, language, size and material. Any quantity." },
  { icon: IndianRupee, title: "Best pricing", text: "Factory-direct rates with slab discounts on bulk orders." },
  { icon: Headset, title: "Dedicated support", text: "Real people on call and WhatsApp, in Hindi, Marathi and English." },
];

export async function WhyUs() {
  const settings = await getSettings();
  return (
    <section aria-labelledby="why-title" className="relative overflow-hidden bg-ink-50 py-20 sm:py-24">
      <div aria-hidden className="dot-grid absolute inset-0 text-ink-200/70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-page relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            id="why-title"
            align="left"
            eyebrow="Why choose us"
            title={
              <>
                Why <span className="text-accent-600">650+ businesses</span> trust SN Safety
              </>
            }
            description="We started in 2021 with one belief: safety is not just a product we sell, it is our responsibility. That shows in every sign we ship."
          />
          <dl className="reveal mt-10 grid grid-cols-2 gap-4">
            {settings.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-100">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-extrabold text-ink-900 sm:text-5xl">
                  <CountUp value={Number(s.value)} suffix={s.suffix} />
                </dd>
                <dd className="mt-1 text-sm font-medium text-ink-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="stagger grid gap-4 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <li key={title} style={{ ["--i" as string]: i }} className="group rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="wiggle-target grid size-11 place-items-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Clients ---------------- */

export async function Clients() {
  const clients = await getClients();
  if (!clients.length) return null;

  return (
    <section aria-labelledby="clients-title" className="py-16 sm:py-20">
      <div className="container-page">
        <p id="clients-title" className="reveal text-center text-sm font-semibold tracking-[0.2em] text-ink-500 uppercase">
          Our valued clients
        </p>
      </div>
      <div className="mt-8 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <Marquee
          duration={35}
          items={clients.map((c) =>
            c.logo_url ? (
              // Logos come from Cloudinary in many aspect ratios, so a plain img keeps them crisp at a fixed height.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c.id}
                src={cldUrl(c.logo_url, 320)}
                alt={c.name}
                loading="lazy"
                className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span key={c.id} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-soft ring-1 ring-ink-100">
                <span className="grid size-9 place-items-center rounded-lg bg-brand-900 text-xs font-bold text-white">{initials(c.name)}</span>
                <span className="font-display text-lg font-bold text-ink-700">{c.name}</span>
              </span>
            ),
          )}
          itemClassName="px-2"
        />
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (!testimonials.length) return null;

  return (
    <section aria-labelledby="testimonials-title" className="relative overflow-hidden bg-brand-50 py-20 sm:py-24">
      <FloatingDecor />
      <div className="container-page relative">
        <SectionHeading
          id="testimonials-title"
          eyebrow="What clients say"
          title={
            <>
              Rated <span className="text-accent-600">4.9★</span> by the people who use our signs
            </>
          }
        />
        <ul className="stagger mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <li key={t.id} style={{ ["--i" as string]: i }}>
              <figure className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink-100">
                <Quote className="size-8 text-accent-200" />
                <div className="mt-3 flex gap-0.5 text-safety-400" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className={`size-4 ${s < t.rating ? "fill-current" : "text-ink-200"}`} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
                  <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-900 text-sm font-bold text-white">
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block font-bold text-ink-900">{t.name}</span>
                    <span className="block text-sm text-ink-500">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
