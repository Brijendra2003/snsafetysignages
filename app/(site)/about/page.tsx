import { ArrowRight, Eye, Gem, HeartHandshake, ShieldCheck, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import { Clients, Industries } from "@/components/home/sections";
import { Character } from "@/components/site/character";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { SectionHeading } from "@/components/ui/section-heading";
import { SignArt } from "@/components/ui/sign-art";
import { characters } from "@/lib/characters";
import { getSettings } from "@/lib/data/public";
import { standards } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founded in 2021 in Vasai, Mumbai, SN Safety & Signages manufactures ISO 7010 compliant safety signs, exit lights and evacuation plans for 650+ businesses across India.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: ShieldCheck, title: "Quality products", text: "Every sign is checked for colour accuracy, adhesion and finish before it leaves the factory." },
  { icon: Users, title: "Expert team", text: "Designers, printers and installers who understand compliance as well as craft." },
  { icon: HeartHandshake, title: "Customer first", text: "Clear quotes, honest timelines and quick support on call and WhatsApp." },
  { icon: Gem, title: "Fair pricing", text: "Factory-direct rates with no middlemen, and better slabs for bulk orders." },
];

const timeline = [
  { year: "2021", title: "Founded in Mumbai", text: "Started with a small print unit making safety signs for local factories." },
  { year: "2022", title: "Exit & emergency lights", text: "Added LED exit lights and emergency lighting to the range." },
  { year: "2023", title: "Vasai manufacturing unit", text: "Moved to a larger unit at Dewan Industrial Estate for in-house production." },
  { year: "2024", title: "650+ happy customers", text: "Serving metros, banks, hotels, PSUs and construction majors across India." },
  { year: "Today", title: "Pan-India supply", text: "Bulk orders dispatched in 48–72 hours, with custom design and installation." },
];

function AboutScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="blob absolute inset-4 bg-gradient-to-br from-white to-accent-100" />
      <div className="anim-float absolute top-[4%] left-[8%] w-[56%]" style={{ ["--rot" as string]: "-5deg" }}>
        <SignArt kind="plan" />
      </div>
      <div className="anim-float absolute right-[4%] bottom-[6%] w-[48%]" style={{ ["--rot" as string]: "6deg", ["--delay" as string]: "-3s" }}>
        <SignArt kind="fire" />
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="About us"
        crumbs={[{ href: "/", label: "Home" }, { label: "About us" }]}
        title={
          <>
            Safety is not just a product. <span className="text-accent-600">It&apos;s our responsibility.</span>
          </>
        }
        description="SN Safety & Signages is a Mumbai-based manufacturer of industrial safety signages, emergency lighting and evacuation solutions. Since 2021 we have helped 650+ businesses make their workplaces safer and audit-ready."
        aside={<Character slot={characters.about} fallback={<AboutScene />} />}
      >
        <ButtonLink href="/products" variant="brand">
          Explore products <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHero>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="reveal-scale relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 p-8 text-brand-100 shadow-lift sm:p-10">
              <div aria-hidden className="absolute -top-16 -right-16 size-60 rounded-full bg-accent-600/30 blur-3xl" />
              <p className="hand text-3xl text-safety-400">Est. 2021</p>
              <p className="mt-4 text-xl leading-relaxed text-white">
                “We started SN Safety because we saw too many sites with faded, non-compliant signs. People deserve
                to find the exit in the dark, and businesses deserve signs they can trust in an audit.”
              </p>
              <p className="mt-6 text-sm font-semibold text-brand-200">— Founder, SN Safety &amp; Signages</p>
            </div>
            <div className="absolute -right-4 -bottom-6 hidden rounded-2xl bg-white px-5 py-4 shadow-lift ring-1 ring-ink-100 sm:block">
              <p className="font-display text-3xl font-extrabold text-accent-600">
                <CountUp value={650} suffix="+" />
              </p>
              <p className="text-sm font-medium text-ink-500">businesses served</p>
            </div>
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title={
                <>
                  Made in Vasai, <span className="text-accent-600">trusted across India</span>
                </>
              }
            />
            <div className="reveal mt-6 space-y-4 leading-relaxed text-ink-500">
              <p>
                We design and manufacture everything in-house at our unit in Dewan Industrial Estate, Vasai East:
                prohibition, mandatory and warning signs, photoluminescent escape signs, LED exit and emergency
                lights, floor-wise evacuation plans and floor marking tapes.
              </p>
              <p>
                Owning the full process, from artwork to printing, cutting and assembly, lets us control quality,
                keep prices fair and dispatch bulk orders in 48–72 hours. Our signs follow ISO 7010 and IS 9457, so
                they are ready for fire NOC inspections and safety audits.
              </p>
              <p>
                Today we supply manufacturers, construction companies, banks, hotels, hospitals, metro projects and
                government bodies, and we&apos;re a registered vendor for several PSUs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section aria-label="Company in numbers" className="bg-brand-900 py-14">
        <dl className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {settings.stats.map((s) => (
            <div key={s.label} className="reveal">
              <dd className="font-display text-5xl font-extrabold text-white">
                <CountUp value={Number(s.value)} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm font-medium tracking-wide text-brand-200 uppercase">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Mission & vision */}
      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-5 md:grid-cols-2">
          <article className="reveal group rounded-3xl bg-white p-8 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift sm:p-10">
            <span className="wiggle-target grid size-14 place-items-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
              <Target className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold">Our mission</h2>
            <p className="mt-3 leading-relaxed text-ink-500">
              To make every workplace in India safer with signage and emergency products that are compliant, durable
              and easy to understand, delivered quickly and at a fair price.
            </p>
          </article>
          <article className="reveal group rounded-3xl bg-white p-8 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift sm:p-10">
            <span className="wiggle-target grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Eye className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold">Our vision</h2>
            <p className="mt-3 leading-relaxed text-ink-500">
              To be India&apos;s most trusted name in safety signages, known for quality you can see in a blackout
              and service you can count on in an audit.
            </p>
          </article>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink-50 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we stand for"
            title={
              <>
                Values behind <span className="text-accent-600">every sign</span>
              </>
            }
          />
          <ul className="stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <li key={title} style={{ ["--i" as string]: i }} className="group rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="wiggle-target grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-accent-600 group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="Our journey"
            title={
              <>
                Growing one <span className="text-accent-600">safe site</span> at a time
              </>
            }
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ol className="relative space-y-6 border-l-2 border-dashed border-ink-200 pl-8">
            {timeline.map((t) => (
              <li key={t.year} className="reveal relative">
                <span className="absolute top-1 -left-[2.6rem] grid size-5 place-items-center rounded-full bg-accent-600 ring-4 ring-accent-100" />
                <p className="font-display text-sm font-extrabold tracking-wider text-accent-600 uppercase">{t.year}</p>
                <h3 className="mt-1 text-xl font-bold">{t.title}</h3>
                <p className="mt-1 text-ink-500">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Standards */}
      <section className="pb-8">
        <div className="container-page">
          <div className="reveal flex flex-col items-center gap-6 rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-ink-100 sm:p-10">
            <p className="eyebrow">Compliance built in</p>
            <ul className="flex flex-wrap justify-center gap-3">
              {standards.map((s) => (
                <li key={s} className="rounded-xl bg-ink-50 px-5 py-3 font-display text-lg font-bold text-ink-900 ring-1 ring-ink-100">
                  {s}
                </li>
              ))}
            </ul>
            <p className="max-w-2xl text-ink-500">
              Our products follow international pictogram standards and Indian colour codes, and are made to meet
              National Building Code and Factory Act requirements for fire and workplace safety.
            </p>
          </div>
        </div>
      </section>

      <Industries />
      <Clients />
      <CtaSection />
    </>
  );
}
