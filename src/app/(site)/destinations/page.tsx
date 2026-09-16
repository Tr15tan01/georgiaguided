import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";
import { getDestinations } from "@/data/public";
import { DestinationCard } from "@/components/public/cards";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("destinations", "Destinations in Georgia");
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <CmsPage
      slug="destinations"
      fallbackTitle="Destinations in Georgia"
      listing={
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <li key={d._id} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
              <DestinationCard destination={d} size={i === 0 ? "lg" : "md"} priority={i < 2} />
            </li>
          ))}
        </ul>
      }
    />
  );
}
