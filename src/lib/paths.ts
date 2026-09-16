/** Client-safe public URL helpers for CMS pages. */
export const SYSTEM_PAGE_PATHS: Record<string, string> = {
  home: "/", about: "/about", contact: "/contact", "why-georgia": "/why-georgia", services: "/services",
  tours: "/tours", destinations: "/destinations", blog: "/blog", faq: "/faq", "plan-your-trip": "/plan-your-trip",
};

export function pagePath(slug: string): string {
  return SYSTEM_PAGE_PATHS[slug] ?? `/${slug}`;
}
