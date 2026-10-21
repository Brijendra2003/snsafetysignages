import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export const defaultFaqs = [
  {
    q: "Do your signs comply with ISO 7010 and Indian standards?",
    a: "Yes. Our pictograms follow ISO 7010, and colours and layouts follow IS 9457. We also make signs to NBC 2016 and Factory Act requirements, so they are ready for fire NOC and safety audits.",
  },
  {
    q: "What is the minimum order quantity?",
    a: "There is no strict minimum. We happily make a single sign, and bulk orders get slab-wise discounts. Custom-printed tapes and evacuation plans are made to order.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard catalogue items are dispatched within 48–72 hours. Custom designs and evacuation plans usually take 3–5 working days after artwork approval. We ship across India.",
  },
  {
    q: "Can you make custom signs with our logo or in local languages?",
    a: "Absolutely. We print bilingual and trilingual signs (English, Hindi, Marathi and more), add your logo, and make any size or shape you need.",
  },
  {
    q: "What materials do you offer?",
    a: "Sunboard, ACP, aluminium, rigid PVC, self-adhesive vinyl, reflective sheeting and photoluminescent (glow-in-the-dark) material. We will recommend the right one for indoor, outdoor or marine use.",
  },
  {
    q: "Do you provide installation?",
    a: "Yes, our team installs signs, exit lights and evacuation plans in the Mumbai, Thane and Palghar region. For other locations we share mounting guides and hardware with the order.",
  },
  {
    q: "How do I get a quotation?",
    a: "Add products to your quote basket, fill the contact form, or simply WhatsApp us a list or a photo of your site. You will get a detailed quotation within one working day.",
  },
];

export function Faq({ items = defaultFaqs, title = true }: { items?: { q: string; a: string }[]; title?: boolean }) {
  return (
    <section aria-labelledby={title ? "faq-title" : undefined} className="py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {title && (
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow="FAQ"
            title={
              <>
                Questions? <span className="text-accent-600">Answered.</span>
              </>
            }
            description="Can't find what you're looking for? Call or WhatsApp us, and a real person will help."
            className="lg:sticky lg:top-28 lg:self-start"
          />
        )}
        <div className="reveal space-y-3">
          {items.map((item, i) => (
            <details
              key={item.q}
              name="faq"
              open={i === 0}
              className="group rounded-2xl bg-white shadow-soft ring-1 ring-ink-100 transition open:ring-accent-200"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-bold text-ink-900">
                {item.q}
                <span className="details-icon grid size-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-700 transition group-open:bg-accent-600 group-open:text-white">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function faqJsonLd(items = defaultFaqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
