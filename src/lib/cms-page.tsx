import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getSettings } from "@/data/public";
import { buildMetadata } from "./seo";
import { Sections } from "@/components/public/sections";
import type { MediaRef } from "./types";
import { SYSTEM_PAGE_PATHS, pagePath } from "./paths";

export { SYSTEM_PAGE_PATHS, pagePath };

export async function cmsMetadata(slug: string, fallbackTitle: string, fallbackDescription?: string): Promise<Metadata> {
  const page = await getPage(slug);
  const settings = await getSettings();
  const hero = page?.sections.find((s) => s.type === "hero" && s.enabled);
  const heroImage = (hero?.data?.image as MediaRef | undefined) ?? null;
  const meta = await buildMetadata({
    title: slug === "home" ? settings.defaultSeoTitle : page?.title ?? fallbackTitle,
    description: fallbackDescription,
    path: pagePath(slug),
    seo: page?.seo,
    image: heroImage,
  });
  if (slug === "home") meta.title = { absolute: page?.seo?.title || settings.defaultSeoTitle };
  return meta;
}

export async function CmsPage({ slug, fallbackTitle, listing, requirePage = true }: {
  slug: string; fallbackTitle: string; listing?: React.ReactNode; requirePage?: boolean;
}) {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page && requirePage) notFound();
  return <Sections sections={page?.sections ?? []} settings={settings} listing={listing} pageTitle={page?.title ?? fallbackTitle} />;
}
