import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getSettings } from "@/data/public";
import { buildMetadata } from "@/lib/seo";
import { Sections } from "@/components/public/sections";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

/** Custom and legal pages created in the admin. System pages have dedicated routes. */
async function load(slug: string) {
  const page = await getPage(slug);
  if (!page || page.kind === "system") return null;
  return page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await load((await params).slug);
  if (!page) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({ title: page.title, path: `/${page.slug}`, seo: page.seo, noindex: page.status !== "published" });
}

export default async function CustomPage({ params }: Props) {
  const page = await load((await params).slug);
  if (!page) notFound();
  const settings = await getSettings();
  const hasHero = page.sections.some((s) => s.enabled && s.type === "hero");
  return (
    <>
      {!hasHero && (
        <header className="container-x pb-4 pt-10">
          <Breadcrumbs items={[{ name: page.title, href: `/${page.slug}` }]} />
          {page.kind === "legal" && page.updatedAt && <p className="mt-10 text-sm text-ink-soft">Last updated {formatDate(page.updatedAt)}</p>}
        </header>
      )}
      <div className={page.kind === "legal" ? "[&_.prose]:max-w-3xl" : ""}>
        <Sections sections={page.sections} settings={settings} pageTitle={page.title} />
      </div>
    </>
  );
}
