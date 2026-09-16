import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getService, getServices, getFeaturedTours } from "@/data/public";
import { buildMetadata } from "@/lib/seo";
import { safeHref } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site-url";
import { SmartImage } from "@/components/public/smart-image";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { Prose } from "@/components/public/prose";
import { JsonLd } from "@/components/public/json-ld";
import { TourCard } from "@/components/public/cards";

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({ title: s.title, description: s.shortDescription, path: `/services/${s.slug}`, seo: s.seo, image: s.image, noindex: s.status !== "published" });
}

export default async function ServicePage({ params }: Props) {
  const s = await getService((await params).slug);
  if (!s) notFound();
  const [others, tours] = await Promise.all([getServices(), getFeaturedTours(3)]);
  const ctaHref = s.cta?.href && s.cta.href !== "/plan-your-trip" ? safeHref(s.cta.href) : `/plan-your-trip?service=${encodeURIComponent(s.title)}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.shortDescription,
    url: absoluteUrl(`/services/${s.slug}`),
    areaServed: { "@type": "Country", name: "Georgia" },
    provider: { "@id": absoluteUrl("/#organization") },
  };

  return (
    <article>
      <div className="container-x pt-10">
        <Breadcrumbs items={[{ name: "Services", href: "/services" }, { name: s.title, href: `/services/${s.slug}` }]} />
      </div>
      <header className="container-x grid gap-10 py-10 lg:grid-cols-12 lg:items-end lg:py-16">
        <div className="lg:col-span-6">
          <h1 className="hero-rise text-5xl sm:text-7xl">{s.title}</h1>
          <p className="hero-rise mt-6 max-w-xl text-xl text-ink-soft [animation-delay:120ms]">{s.shortDescription}</p>
          <Link href={ctaHref} className="btn btn-primary mt-8">{s.cta?.label || "Request this service"}</Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:col-span-6">
          <SmartImage image={s.image} sizes="(min-width: 1024px) 50vw, 92vw" priority imgClassName="img-reveal" />
        </div>
      </header>

      <div className="container-x grid gap-14 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-7"><Prose markdown={s.description} /></div>
        {s.benefits.length > 0 && (
          <aside className="lg:col-span-5">
            <div className="rounded-sm border border-line bg-raised p-8 lg:sticky lg:top-28">
              <h2 className="text-3xl">What you can expect</h2>
              <ul className="mt-6 space-y-4">
                {s.benefits.map((b) => (<li key={b} className="flex gap-3"><Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />{b}</li>))}
              </ul>
              <Link href={ctaHref} className="btn btn-primary mt-8 w-full">{s.cta?.label || "Request this service"}</Link>
            </div>
          </aside>
        )}
      </div>

      {tours.length > 0 && (
        <section className="bg-raised">
          <div className="container-x section-y">
            <h2 className="mb-10 text-4xl sm:text-5xl">Pair it with a journey</h2>
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{tours.map((t) => (<li key={t._id}><TourCard tour={t} /></li>))}</ul>
          </div>
        </section>
      )}

      <nav aria-label="Other services" className="container-x section-y">
        <h2 className="mb-6 text-3xl">Other services</h2>
        <ul className="flex flex-wrap gap-2">
          {others.filter((o) => o._id !== s._id).map((o) => (
            <li key={o._id}><Link href={`/services/${o.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-accent hover:text-accent">{o.title}</Link></li>
          ))}
        </ul>
      </nav>
      <JsonLd data={ld} />
    </article>
  );
}
