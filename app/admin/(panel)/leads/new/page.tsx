import type { Metadata } from "next";
import { NewLeadForm } from "@/components/admin/lead-forms";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Add lead" };

export default async function NewLeadPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add lead" description="Log an enquiry that came in by phone, WhatsApp or a site visit." back={{ href: "/admin/leads", label: "Leads" }} />
      <Card className="max-w-3xl">
        <NewLeadForm />
      </Card>
    </>
  );
}
