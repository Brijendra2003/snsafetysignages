import type { Metadata } from "next";
import { OrderForm } from "@/components/admin/order-form";
import { PageHeader } from "@/components/admin/ui";
import { getLead, listProductOptions } from "@/lib/data/admin";

export const metadata: Metadata = { title: "New order" };

export default async function NewOrderPage({ searchParams }: PageProps<"/admin/orders/new">) {
  const { lead: leadId } = await searchParams;
  const [products, leadResult] = await Promise.all([
    listProductOptions(),
    typeof leadId === "string" ? getLead(leadId) : Promise.resolve(null),
  ]);
  const lead = leadResult?.lead ?? null;

  return (
    <>
      <PageHeader
        title="New order"
        description={lead ? `Converting lead from ${lead.name}. Customer details and products are pre-filled.` : "Create an order manually."}
        back={lead ? { href: `/admin/leads/${lead.id}`, label: "Back to lead" } : { href: "/admin/orders", label: "Orders" }}
      />
      <OrderForm lead={lead} products={products} />
    </>
  );
}
