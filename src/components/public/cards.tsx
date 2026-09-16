import Link from "next/link";
import { SmartImage } from "./smart-image";
import type { BlogPost, Destination, Service, Tour } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export function TourCard({ tour, priority, headingLevel = "h3" }: { tour: Tour; priority?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-line">
        <SmartImage
          image={tour.heroImage}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          priority={priority}
          imgClassName="transition-transform duration-[1200ms] ease-[var(--ease-quiet)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-ink">{tour.duration || `${tour.durationDays} days`}</span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <H className="text-2xl sm:text-[1.7rem]">
          <Link href={`/tours/${tour.slug}`} className="after:absolute after:inset-0">
            {tour.title}
          </Link>
        </H>
      </div>
      <p className="mt-2 line-clamp-2 text-ink-soft">{tour.shortDescription}</p>
      <p className="mt-3 text-sm">
        {tour.priceFrom != null && (
          <>
            <span className="text-ink-soft">From </span>
            <span className="font-medium">{formatPrice(tour.priceFrom, tour.currency)}</span>
            <span className="text-ink-soft"> per person</span>
          </>
        )}
      </p>
    </article>
  );
}

export function DestinationCard({ destination, size = "md", priority }: { destination: Destination; size?: "md" | "lg"; priority?: boolean }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-sm bg-ink text-white">
      <div className={size === "lg" ? "relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[34rem]" : "relative aspect-[4/5]"}>
        <SmartImage
          image={destination.heroImage}
          sizes={size === "lg" ? "(min-width: 768px) 50vw, 92vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 92vw"}
          priority={priority}
          imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-quiet)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          {destination.region && <p className="text-sm text-white/75">{destination.region}</p>}
          <h3 className="mt-1 text-3xl sm:text-4xl">
            <Link href={`/destinations/${destination.slug}`} className="after:absolute after:inset-0">
              {destination.name}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 max-w-sm text-sm text-white/85 opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            {destination.shortDescription}
          </p>
        </div>
      </div>
    </article>
  );
}

export function ServiceRow({ service }: { service: Service }) {
  return (
    <article className="group relative grid gap-3 border-t border-line py-8 md:grid-cols-12 md:items-baseline md:gap-8">
      <h3 className="text-3xl md:col-span-4">
        <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
          {service.title}
        </Link>
      </h3>
      <p className="text-ink-soft md:col-span-6">{service.shortDescription}</p>
      <span className="text-sm font-medium text-accent md:col-span-2 md:text-right">Details</span>
    </article>
  );
}

export function PostCard({ post, variant = "default", priority }: { post: BlogPost; variant?: "default" | "compact"; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      {variant === "default" && (
        <div className="relative mb-5 aspect-[3/2] overflow-hidden rounded-sm bg-line">
          <SmartImage image={post.coverImage} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" priority={priority} imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
        </div>
      )}
      <p className="flex gap-3 text-sm text-ink-soft">
        <span className="text-moss">{post.category}</span>
        {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
      </p>
      <h3 className="mt-2 text-2xl sm:text-[1.7rem]">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
          {post.title}
        </Link>
      </h3>
      {variant === "default" && <p className="mt-2 line-clamp-3 text-ink-soft">{post.excerpt}</p>}
    </article>
  );
}
