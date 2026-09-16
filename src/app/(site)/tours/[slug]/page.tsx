import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Minus } from "lucide-react";
import { getDestinationsByIds, getPostsMentioning, getSettings, getTour, getToursByIds, getServices } from "@/data/public";
import { buildMetadata } from "@/lib/seo";
import { faqLd, touristTripLd } from "@/lib/jsonld";
import { formatPrice } from "@/lib/utils";
import { SmartImage } from "@/components/public/smart-image";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { Prose } from "@/components/public/prose";
import { Itinerary } from "@/components/public/itinerary";
import { Gallery } from "@/components/public/gallery";
import { FaqList } from "@/components/public/faq-list";
import { JsonLd } from "@/components/public/json-ld";
import { PostCard, TourCard } from "@/components/public/cards";
import { Ridge } from "@/components/public/ridge";

export const revalidate = 300;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tour = await getTour((await params).slug);
  if (!tour) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({ title: tour.title, description: tour.shortDescription, path: `/tours/${tour.slug}`, seo: tour.seo, image: tour.heroImage, noindex: tour.status !== "published" });
}

const DIFFICULTY: Record<string, string> = { easy: "Easy", moderate: "Moderate", challenging: "Challenging" };

export default async function TourPage({ params }: Props) {
  const tour = await getTour((await params).slug);
  if (!tour) notFound();
  const [destinations, related, posts, services, settings] = await Promise.all([
    getDestinationsByIds(tour.destinations),
    getToursByIds(tour.relatedTours),
    getPostsMentioning("relatedTours", tour._id),
    getServices(),
    getSettings(),
  ]);
  const planHref = `/plan-your-trip?tour=${encodeURIComponent(tour.title)}`;
  const facts = [
    { label: "Duration", value: tour.duration || `${tour.durationDays} days` },
    { label: "Group", value: tour.groupSize },
    { label: "Difficulty", value: tour.difficulty ? DIFFICULTY[tour.difficulty] : undefined },
    { label: "Style", value: tour.category },
    { label: "Meeting point", value: tour.meetingPoint },
  ].filter((f) => f.value);

  return (
    <article>
      <header className="relative isolate min-h-[78svh] overflow-hidden bg-ink text-white">
        <SmartImage image={tour.heroImage} sizes="100vw" priority quality={85} className="-z-20" imgClassName="img-reveal" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        <div className="container-x flex min-h-[78svh] flex-col justify-end pb-16 pt-28">
          <Breadcrumbs light items={[{ name: "Tours", href: "/tours" }, { name: tour.title, href: `/tours/${tour.slug}` }]} />
          <h1 className="hero-rise mt-6 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">{tour.title}</h1>
          <p className="hero-rise mt-5 max-w-2xl text-lg text-white/85 [animation-delay:120ms]">{tour.shortDescription}</p>
        </div>
        <Ridge variant="fill" className="absolute inset-x-0 -bottom-px h-8 text-paper sm:h-12" />
      </header>

      <div className="container-x grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-8">
          {tour.highlights.length > 0 && (
            <section aria-labelledby="highlights">
              <h2 id="highlights" className="text-4xl">Highlights</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex gap-3"><Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />{h}</li>
                ))}
              </ul>
            </section>
          )}
          <section className="mt-14" aria-label="About this tour"><Prose markdown={tour.description} /></section>

          {tour.itinerary.length > 0 && (
            <section className="mt-16" aria-labelledby="itinerary">
              <h2 id="itinerary" className="mb-6 text-4xl">Itinerary</h2>
              <Itinerary days={tour.itinerary} />
            </section>
          )}

          {(tour.included.length > 0 || tour.excluded.length > 0) && (
            <section className="mt-16 grid gap-10 sm:grid-cols-2" aria-label="What's included">
              <div>
                <h2 className="text-3xl">Included</h2>
                <ul className="mt-5 space-y-3">
                  {tour.included.map((i) => (<li key={i} className="flex gap-3"><Check aria-hidden className="mt-1 size-4 shrink-0 text-moss" />{i}</li>))}
                </ul>
              </div>
              <div>
                <h2 className="text-3xl">Not included</h2>
                <ul className="mt-5 space-y-3 text-ink-soft">
                  {tour.excluded.map((i) => (<li key={i} className="flex gap-3"><Minus aria-hidden className="mt-1 size-4 shrink-0" />{i}</li>))}
                </ul>
              </div>
            </section>
          )}

          {tour.gallery.length > 0 && (
            <section className="mt-16" aria-labelledby="gallery">
              <h2 id="gallery" className="mb-6 text-4xl">Gallery</h2>
              <Gallery images={tour.gallery} title={tour.title} />
            </section>
          )}

          {destinations.length > 0 && (
            <section className="mt-16" aria-labelledby="places">
              <h2 id="places" className="text-4xl">Places on this route</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {destinations.map((d) => (
                  <li key={d._id}><Link href={`/destinations/${d.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-accent hover:text-accent">{d.name}</Link></li>
                ))}
              </ul>
            </section>
          )}

          {tour.faq.length > 0 && (
            <section className="mt-16" aria-labelledby="tour-faq">
              <h2 id="tour-faq" className="mb-6 text-4xl">Questions about this tour</h2>
              <FaqList items={tour.faq} />
            </section>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-sm border border-line bg-raised p-7 lg:sticky lg:top-28">
            {tour.priceFrom != null && (
              <p>
                <span className="text-ink-soft">From</span>{" "}
                <span className="font-display text-5xl">{formatPrice(tour.priceFrom, tour.currency)}</span>
                <span className="block text-sm text-ink-soft">per person, private tour. Final price depends on group size and season.</span>
              </p>
            )}
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 py-3 text-[0.95rem]">
                  <dt className="text-ink-soft">{f.label}</dt><dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link href={planHref} className="btn btn-primary mt-6 w-full">Request this tour</Link>
            <p className="mt-3 text-center text-sm text-ink-soft">No payment now. We reply with a tailored proposal.</p>
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-3 w-full">
                Ask on WhatsApp
              </a>
            )}
            {services.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm font-medium">Add to your trip</p>
                <ul className="mt-3 space-y-1.5 text-[0.95rem]">
                  {services.slice(0, 4).map((s) => (<li key={s._id}><Link className="link-underline text-accent" href={`/services/${s.slug}`}>{s.title}</Link></li>))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-raised">
          <div className="container-x section-y">
            <h2 className="mb-10 text-4xl sm:text-5xl">You may also like</h2>
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((t) => (<li key={t._id}><TourCard tour={t} /></li>))}
            </ul>
          </div>
        </section>
      )}
      {posts.length > 0 && (
        <section className="container-x section-y">
          <h2 className="mb-10 text-4xl sm:text-5xl">Read before you go</h2>
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {posts.map((p) => (<li key={p._id}><PostCard post={p} /></li>))}
          </ul>
        </section>
      )}

      <JsonLd data={[
        tour.structuredData?.touristTrip !== false ? touristTripLd(tour, destinations) : null,
        tour.structuredData?.faqPage !== false ? faqLd(tour.faq) : null,
      ]} />
    </article>
  );
}
