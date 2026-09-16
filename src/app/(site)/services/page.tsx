import type { Metadata } from "next";
import Link from "next/link";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";
import { getServices } from "@/data/public";
import { SmartImage } from "@/components/public/smart-image";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("services", "Travel services in Georgia");
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <CmsPage
      slug="services"
      fallbackTitle="Travel services"
      listing={
        <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s._id} className={`group relative ${i % 2 === 1 ? "md:mt-24" : ""}`}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-line">
                <SmartImage image={s.image} sizes="(min-width: 768px) 45vw, 92vw" priority={i < 2} imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              </div>
              <h2 className="mt-6 text-4xl">
                <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">{s.title}</Link>
              </h2>
              <p className="mt-3 max-w-lg text-ink-soft">{s.shortDescription}</p>
            </li>
          ))}
        </ul>
      }
    />
  );
}
