import { absoluteUrl } from "./site-url";
import type { BlogPost, Destination, FaqItem, SiteSettings, Tour } from "./types";
import { stripMarkdownLite } from "./text";

type Json = Record<string, unknown>;

const img = (url?: string) => (url ? absoluteUrl(url) : undefined);

export function organizationLd(s: SiteSettings): Json {
  const sameAs = s.socialLinks.map((l) => l.href).filter((h) => /^https?:\/\//.test(h));
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": absoluteUrl("/#organization"),
    name: s.companyName,
    url: absoluteUrl("/"),
    description: s.defaultSeoDescription || undefined,
    logo: img(s.logo?.url),
    image: img(s.defaultOgImage?.url),
    email: s.email || undefined,
    telephone: s.phone || undefined,
    address: s.address ? { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "GE" } : undefined,
    areaServed: { "@type": "Country", name: "Georgia" },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteLd(s: SiteSettings): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: s.companyName,
    url: absoluteUrl("/"),
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function faqLd(items: FaqItem[]): Json | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: stripMarkdownLite(f.answer) },
    })),
  };
}

export function touristTripLd(t: Tour, destinations: Destination[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t.title,
    description: t.shortDescription,
    url: absoluteUrl(`/tours/${t.slug}`),
    image: img(t.heroImage?.url),
    touristType: t.experiences.length ? t.experiences : undefined,
    provider: { "@id": absoluteUrl("/#organization") },
    itinerary: destinations.length
      ? {
          "@type": "ItemList",
          itemListElement: destinations.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "TouristDestination", name: d.name, url: absoluteUrl(`/destinations/${d.slug}`) },
          })),
        }
      : undefined,
    offers:
      t.priceFrom != null
        ? { "@type": "Offer", price: t.priceFrom, priceCurrency: t.currency, url: absoluteUrl(`/tours/${t.slug}`), availability: "https://schema.org/InStock" }
        : undefined,
  };
}

export function destinationLd(d: Destination): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.shortDescription,
    url: absoluteUrl(`/destinations/${d.slug}`),
    image: img(d.heroImage?.url),
    containedInPlace: { "@type": "Country", name: "Georgia" },
  };
}

export function articleLd(p: BlogPost): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    image: img(p.coverImage?.url),
    datePublished: p.publishedAt,
    dateModified: p.updatedAt ?? p.publishedAt,
    author: { "@type": "Organization", name: p.author },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`),
    keywords: p.tags.join(", ") || undefined,
  };
}
