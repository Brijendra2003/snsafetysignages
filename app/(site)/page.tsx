import { CategoryGrid, Clients, FeaturedProducts, Industries, MarqueeBands, ProcessSteps, PromiseStrip, Testimonials, WhyUs } from "@/components/home/sections";
import { Hero } from "@/components/home/hero";
import { CtaSection } from "@/components/site/cta-section";
import { Faq, faqJsonLd } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { getSettings } from "@/lib/data/public";
import { site } from "@/lib/site";

export default async function HomePage() {
  const settings = await getSettings();

  const organization = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/logo.png`,
    telephone: settings.phone,
    email: settings.email,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Vasai East",
      addressRegion: "Maharashtra",
      postalCode: "401210",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 09:00-18:00",
  };

  return (
    <>
      <JsonLd data={[organization, faqJsonLd()]} />
      <Hero />
      <PromiseStrip />
      <MarqueeBands />
      <CategoryGrid />
      <FeaturedProducts />
      <ProcessSteps />
      <Industries />
      <WhyUs />
      <Clients />
      <Testimonials />
      <Faq />
      <CtaSection />
    </>
  );
}
