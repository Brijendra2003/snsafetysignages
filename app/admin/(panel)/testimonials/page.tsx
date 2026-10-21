import type { Metadata } from "next";
import { TestimonialsManager } from "@/components/admin/content-managers";
import { PageHeader } from "@/components/admin/ui";
import { listTestimonials } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const testimonials = await listTestimonials();
  return (
    <>
      <PageHeader title="Testimonials" description="Customer quotes shown on the home page." />
      <TestimonialsManager testimonials={testimonials} />
    </>
  );
}
