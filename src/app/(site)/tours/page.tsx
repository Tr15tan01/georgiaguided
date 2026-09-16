import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";
import { getDestinations, getTours } from "@/data/public";
import { TourFilters } from "@/components/public/tour-filters";
import { JsonLd } from "@/components/public/json-ld";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("tours", "Georgia tours", "Private tours and multi-day journeys across Georgia.");
}

export default async function ToursPage() {
  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tours.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/tours/${t.slug}`), name: t.title })),
  };
  return (
    <>
      <CmsPage
        slug="tours"
        fallbackTitle="Georgia tours"
        listing={<TourFilters tours={tours} destinations={destinations.map((d) => ({ _id: d._id, name: d.name }))} />}
      />
      <JsonLd data={listLd} />
    </>
  );
}
