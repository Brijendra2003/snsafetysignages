import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { QuoteBasket } from "@/components/site/quote-basket";

export const metadata: Metadata = {
  title: "Quote Basket",
  description: "Review the products you've selected and request one consolidated quotation.",
  robots: { index: false },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a quotation"
        crumbs={[{ href: "/", label: "Home" }, { href: "/products", label: "Products" }, { label: "Quote basket" }]}
        title={
          <>
            Your <span className="text-accent-600">quote basket</span>
          </>
        }
        description="Adjust quantities, add your details and submit. You'll get a detailed quotation with bulk pricing within one working day."
      />
      <section className="container-page pb-24">
        <QuoteBasket />
      </section>
    </>
  );
}
