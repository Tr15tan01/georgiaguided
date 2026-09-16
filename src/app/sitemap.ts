import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/data/public";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const SYSTEM_PATHS: Record<string, string> = {
  home: "/", about: "/about", contact: "/contact", "why-georgia": "/why-georgia", services: "/services",
  tours: "/tours", destinations: "/destinations", blog: "/blog", faq: "/faq", "plan-your-trip": "/plan-your-trip",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const e = await getSitemapEntries();
  const live = <T extends { seo?: { noindex?: boolean } }>(items: T[]) => items.filter((i) => !i.seo?.noindex);
  const map = (prefix: string, items: { slug: string; updatedAt?: string; seo?: { noindex?: boolean } }[], priority: number) =>
    live(items).map((i) => ({ url: absoluteUrl(`${prefix}/${i.slug}`), lastModified: i.updatedAt ? new Date(i.updatedAt) : undefined, priority }));

  const pages = live(e.pages).map((p) => ({
    url: absoluteUrl(SYSTEM_PATHS[p.slug] ?? `/${p.slug}`),
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    priority: p.slug === "home" ? 1 : p.kind === "legal" ? 0.2 : 0.7,
  }));

  return [
    ...pages,
    ...map("/tours", e.tours, 0.9),
    ...map("/destinations", e.destinations, 0.8),
    ...map("/services", e.services, 0.7),
    ...map("/blog", e.posts, 0.7),
  ];
}
