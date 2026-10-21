import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { PageHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getAdminSettings();
  return (
    <>
      <PageHeader title="Website settings" description="Contact details, links and numbers used across the website." />
      <SettingsForm settings={settings} />
    </>
  );
}
