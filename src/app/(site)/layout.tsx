import type { Metadata } from "next";
import { getSettings } from "@/data/public";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { PlanCta } from "@/components/public/plan-cta";
import { Analytics } from "@/components/public/analytics";
import { JsonLd } from "@/components/public/json-ld";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { safeHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.defaultSeoTitle, template: `%s | ${s.companyName}` },
    description: s.defaultSeoDescription,
    applicationName: s.companyName,
    icons: s.favicon?.url ? { icon: s.favicon.url } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-dvh flex-col">
      <Header settings={settings} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={settings} />
      <PlanCta label={settings.headerCta?.label || "Plan your trip"} href={safeHref(settings.headerCta?.href, "/plan-your-trip")} />
      <JsonLd data={[organizationLd(settings), websiteLd(settings)]} />
      <Analytics gaId={settings.gaId} plausibleDomain={settings.plausibleDomain} />
    </div>
  );
}
