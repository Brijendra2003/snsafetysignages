import type { Metadata } from "next";
import { ClientsManager } from "@/components/admin/content-managers";
import { PageHeader } from "@/components/admin/ui";
import { listClients } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const clients = await listClients();
  return (
    <>
      <PageHeader title="Clients" description="Logos shown in the “Our valued clients” strip." />
      <ClientsManager clients={clients} />
    </>
  );
}
