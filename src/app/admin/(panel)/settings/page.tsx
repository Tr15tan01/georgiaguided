import type { Metadata } from "next";
import { connectDB, serialize } from "@/lib/db";
import { SiteSettings } from "@/models";
import { DEFAULT_SETTINGS } from "@/data/public";
import { stripMeta } from "@/admin/data";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await connectDB();
  const doc = await SiteSettings.findOne({ key: "site" }).lean();
  const initial = { ...DEFAULT_SETTINGS, ...(doc ? stripMeta(serialize<Record<string, unknown>>(doc)) : {}) } as Record<string, unknown>;
  delete initial.key;
  return (
    <>
      <PageHeader
        title="Site settings"
        description="Company details, navigation, footer, default SEO and analytics used across the website."
        crumbs={[{ href: "/admin/settings", label: "Settings" }]}
      />
      <SettingsForm initial={initial} />
    </>
  );
}
