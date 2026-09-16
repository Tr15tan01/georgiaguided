import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination, getPostsMentioning, getToursForDestination } from "@/data/public";
import { buildMetadata } from "@/lib/seo";
import { destinationLd } from "@/lib/jsonld";
import { SmartImage } from "@/components/public/smart-image";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { Prose } from "@/components/public/prose";
import { Gallery } from "@/components/public/gallery";
import { JsonLd } from "@/components/public/json-ld";
import { PostCard, TourCard } from "@/components/public/cards";
import { Ridge } from "@/components/public/ridge";

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDestination((await params).slug);
  if (!d) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({ title: d.seo?.title || `${d.name}, Georgia: travel guide and tours`, description: d.shortDescription, path: `/destinations/${d.slug}`, seo: d.seo, image: d.heroImage, noindex: d.status !== "published" });
}

export default async function DestinationPage({ params }: Props) {
  const d = await getDestination((await params).slug);
  if (!d) notFound();
  const [tours, posts] = await Promise.all([getToursForDestination(d._id, d.relatedTours), getPostsMentioning("relatedDestinations", d._id)]);

  return (
    <article>
      <header className="relative isolate min-h-[80svh] overflow-hidden bg-ink text-white">
        <SmartImage image={d.heroImage} sizes="100vw" priority quality={85} className="-z-20" imgClassName="img-reveal" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
        <div className="container-x flex min-h-[80svh] flex-col justify-end pb-16 pt-28">
          <Breadcrumbs light items={[{ name: "Destinations", href: "/destinations" }, { name: d.name, href: `/destinations/${d.slug}` }]} />
          {d.region && <p className="hero-rise mt-8 text-white/80">{d.region}</p>}
          <h1 className="hero-rise mt-1 text-[clamp(3.5rem,12vw,9rem)] leading-[0.9]">{d.name}</h1>
          <p className="hero-rise mt-5 max-w-2xl text-lg text-white/85 [animation-delay:120ms]">{d.shortDescription}</p>
        </div>
        <Ridge variant="fill" className="absolute inset-x-0 -bottom-px h-8 text-paper sm:h-12" />
      </header>

      <div className="container-x grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-8"><Prose markdown={d.description} /></div>
        <aside className="space-y-10 lg:col-span-4">
          {d.bestTimeToVisit && (
            <section>
              <h2 className="text-3xl">Best time to visit</h2>
              <Prose markdown={d.bestTimeToVisit} className="prose-base mt-3" />
            </section>
          )}
          {d.howToGetThere && (
            <section>
              <h2 className="text-3xl">Getting there</h2>
              <Prose markdown={d.howToGetThere} className="prose-base mt-3" />
            </section>
          )}
        </aside>
      </div>

      {d.thingsToDo.length > 0 && (
        <section className="bg-raised">
          <div className="container-x section-y">
            <h2 className="max-w-3xl text-4xl sm:text-6xl">Things to do in {d.name}</h2>
            <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {d.thingsToDo.map((t) => (
                <li key={t.title} className="border-t border-brass/60 pt-5">
                  <h3 className="text-2xl">{t.title}</h3>
                  <p className="mt-2 text-ink-soft">{t.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {d.gallery.length > 0 && (
        <section className="container-x section-y">
          <h2 className="mb-8 text-4xl">{d.name} in pictures</h2>
          <Gallery images={d.gallery} title={d.name} />
        </section>
      )}

      {d.travelTips.length > 0 && (
        <section className="container-x pb-16">
          <div className="rounded-sm border border-line p-8 sm:p-12">
            <h2 className="text-4xl">Local tips</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {d.travelTips.map((t) => (<li key={t} className="border-l-2 border-accent pl-4">{t}</li>))}
            </ul>
          </div>
        </section>
      )}

      {tours.length > 0 && (
        <section className="container-x section-y pt-0">
          <h2 className="mb-10 text-4xl sm:text-5xl">Tours that include {d.name}</h2>
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => (<li key={t._id}><TourCard tour={t} /></li>))}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="mb-10 text-4xl">From the journal</h2>
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">{posts.map((p) => (<li key={p._id}><PostCard post={p} /></li>))}</ul>
        </section>
      )}

      <section className="bg-accent text-accent-ink">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <h2 className="max-w-2xl text-4xl">Want {d.name} in your itinerary?</h2>
          <Link href={`/plan-your-trip?destination=${encodeURIComponent(d.name)}`} className="btn btn-light">Plan a trip with {d.name}</Link>
        </div>
      </section>
      <JsonLd data={destinationLd(d)} />
    </article>
  );
}
