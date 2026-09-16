import Link from "next/link";
import type { LinkItem, MediaRef, PageSection, SiteSettings } from "@/lib/types";
import { cn, safeHref } from "@/lib/utils";
import {
  getDestinationsByIds, getFaqs, getFeaturedDestinations, getFeaturedTours, getLatestPosts, getPostsByIds,
  getServices, getServicesByIds, getTestimonials, getToursByIds,
} from "@/data/public";
import { SmartImage } from "./smart-image";
import { Prose } from "./prose";
import { Ridge } from "./ridge";
import { SectionHeading } from "./section-heading";
import { DestinationCard, PostCard, ServiceRow, TourCard } from "./cards";
import { FaqList } from "./faq-list";
import { InquiryForm } from "./inquiry-form";
import { ContactForm } from "./contact-form";
import { JsonLd } from "./json-ld";
import { faqLd } from "@/lib/jsonld";

type D = Record<string, unknown>;
const s = (d: D, k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");
const ids = (d: D, k: string) => (Array.isArray(d[k]) ? (d[k] as unknown[]).filter((x): x is string => typeof x === "string") : []);
const img = (d: D, k: string) => (d[k] && typeof d[k] === "object" ? (d[k] as MediaRef) : null);
const lnk = (d: D, k: string) => (d[k] && typeof d[k] === "object" ? (d[k] as LinkItem) : null);

interface Ctx {
  settings: SiteSettings;
  /** true for the first rendered section — its heading becomes the page H1 */
  isFirst: boolean;
  listing?: React.ReactNode;
  pageTitle: string;
}

export function Sections({ sections, settings, listing, pageTitle }: { sections: PageSection[]; settings: SiteSettings; listing?: React.ReactNode; pageTitle: string }) {
  const enabled = sections.filter((x) => x.enabled);
  const hasListing = enabled.some((x) => x.type === "listing");
  const firstHasHeading = Boolean(enabled[0] && s(enabled[0].data ?? {}, "heading"));
  return (
    <>
      {!firstHasHeading && <h1 className="sr-only">{pageTitle}</h1>}
      {enabled.map((sec, i) => (
        <Section key={sec._key} section={sec} ctx={{ settings, isFirst: i === 0 && firstHasHeading, listing, pageTitle }} />
      ))}
      {listing && !hasListing && <div className="container-x section-y pt-0">{listing}</div>}
    </>
  );
}

async function Section({ section, ctx }: { section: PageSection; ctx: Ctx }) {
  const d = section.data ?? {};
  const H = ctx.isFirst ? "h1" : "h2";
  switch (section.type) {
    case "hero":
      return <Hero d={d} isFirst={ctx.isFirst} />;

    case "intro":
      return (
        <section className="container-x section-y">
          <div className="grid gap-8 md:grid-cols-12">
            {s(d, "heading") && <H className="text-4xl sm:text-5xl md:col-span-5 lg:text-6xl">{s(d, "heading")}</H>}
            <Prose markdown={s(d, "body")} className={cn("md:col-span-7", s(d, "heading") ? "" : "md:col-start-4")} />
          </div>
        </section>
      );

    case "featuredTours": {
      const picked = ids(d, "items");
      const tours = picked.length ? await getToursByIds(picked) : await getFeaturedTours(6);
      if (!tours.length) return null;
      return (
        <section className="container-x section-y">
          <SectionHeading heading={s(d, "heading")} intro={s(d, "intro")} link={lnk(d, "link")} as={H} />
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => (<li key={t._id}><TourCard tour={t} /></li>))}
          </ul>
        </section>
      );
    }

    case "destinations": {
      const picked = ids(d, "items");
      const items = picked.length ? await getDestinationsByIds(picked) : await getFeaturedDestinations(5);
      if (!items.length) return null;
      const [lead, ...rest] = items;
      return (
        <section className="bg-raised">
          <div className="container-x section-y">
            <SectionHeading heading={s(d, "heading")} intro={s(d, "intro")} link={lnk(d, "link")} as={H} />
            <div className="grid gap-4 md:grid-cols-2">
              <DestinationCard destination={lead} size="lg" />
              <div className="grid gap-4 sm:grid-cols-2">
                {rest.slice(0, 4).map((x) => (<DestinationCard key={x._id} destination={x} />))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "services": {
      const picked = ids(d, "items");
      const items = picked.length ? await getServicesByIds(picked) : await getServices();
      if (!items.length) return null;
      return (
        <section className="container-x section-y">
          <SectionHeading heading={s(d, "heading")} intro={s(d, "intro")} link={lnk(d, "link")} as={H} />
          <div className="border-b border-line">{items.map((x) => (<ServiceRow key={x._id} service={x} />))}</div>
        </section>
      );
    }

    case "features": {
      const items = Array.isArray(d.items) ? (d.items as { title?: string; description?: string }[]) : [];
      const image = img(d, "image");
      return (
        <section className="container-x section-y">
          <div className={cn("grid gap-12", image && "lg:grid-cols-12 lg:gap-16")}>
            {image && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:col-span-5 lg:aspect-auto lg:min-h-[36rem]">
                <SmartImage image={image} sizes="(min-width: 1024px) 40vw, 92vw" />
              </div>
            )}
            <div className={image ? "lg:col-span-7" : ""}>
              {s(d, "heading") && <H className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{s(d, "heading")}</H>}
              {s(d, "intro") && <p className="mt-6 max-w-2xl text-lg text-ink-soft">{s(d, "intro")}</p>}
              <dl className={cn("mt-12 grid gap-x-10 gap-y-10", image ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
                {items.map((it) => (
                  <div key={it.title} className="border-t border-accent/60 pt-5">
                    <dt className="font-display text-2xl">{it.title}</dt>
                    <dd className="mt-2 text-ink-soft">{it.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      );
    }

    case "testimonials": {
      const items = await getTestimonials(ids(d, "items"));
      if (!items.length) return null;
      return (
        <section className="bg-moss text-[#f3f1ea] dark:bg-raised dark:text-ink">
          <div className="container-x section-y">
            {s(d, "heading") && <H className="mb-12 max-w-2xl text-4xl sm:text-5xl">{s(d, "heading")}</H>}
            <ul className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {items.slice(0, 6).map((t) => (
                <li key={t._id} className="w-[85%] shrink-0 snap-start md:w-auto">
                  <figure className="flex h-full flex-col">
                    <blockquote className="font-display text-2xl leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-6 text-sm opacity-80">
                      <span className="block font-medium opacity-100">{t.name}</span>
                      {[t.location, t.tripName].filter(Boolean).join(", ")}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    case "posts": {
      const picked = ids(d, "items");
      const posts = picked.length ? await getPostsByIds(picked) : await getLatestPosts(3);
      if (!posts.length) return null;
      return (
        <section className="container-x section-y">
          <SectionHeading heading={s(d, "heading")} intro={s(d, "intro")} link={lnk(d, "link")} as={H} />
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {posts.map((p) => (<li key={p._id}><PostCard post={p} /></li>))}
          </ul>
        </section>
      );
    }

    case "cta": {
      const cta = lnk(d, "cta");
      const image = img(d, "image");
      return (
        <section className="relative isolate overflow-hidden bg-ink text-white">
          {image && <SmartImage image={image} sizes="100vw" className="-z-10" />}
          <div className="absolute inset-0 -z-10 bg-black/55" />
          <div className="container-x py-24 sm:py-32">
            <div className="max-w-2xl">
              {s(d, "heading") && <H className="text-4xl sm:text-6xl">{s(d, "heading")}</H>}
              {s(d, "body") && <p className="mt-5 text-lg text-white/85">{s(d, "body")}</p>}
              {cta?.label && <Link href={safeHref(cta.href)} className="btn btn-light mt-8">{cta.label}</Link>}
            </div>
          </div>
        </section>
      );
    }

    case "faq": {
      const cat = s(d, "category") || undefined;
      const limit = Number(d.limit) || 0;
      const all = await getFaqs(cat);
      const faqs = limit ? all.slice(0, limit) : all;
      if (!faqs.length) return null;
      return (
        <section className="container-x section-y">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">{s(d, "heading") && <H className="text-4xl sm:text-5xl">{s(d, "heading")}</H>}</div>
            <div className="lg:col-span-8"><FaqList items={faqs} headingLevel={H === "h1" ? "h2" : "h3"} /></div>
          </div>
          <JsonLd data={faqLd(faqs)} />
        </section>
      );
    }

    case "imageText": {
      const image = img(d, "image");
      const cta = lnk(d, "cta");
      const right = Boolean(d.imageRight);
      return (
        <section className="container-x section-y">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className={cn("relative aspect-[4/3] overflow-hidden rounded-sm lg:col-span-6", right && "lg:order-2")}>
              <SmartImage image={image} sizes="(min-width: 1024px) 50vw, 92vw" />
            </div>
            <div className="lg:col-span-6">
              {s(d, "heading") && <H className="text-4xl sm:text-5xl">{s(d, "heading")}</H>}
              <Prose markdown={s(d, "body")} className="mt-6" />
              {cta?.label && <Link href={safeHref(cta.href)} className="btn btn-ghost mt-8">{cta.label}</Link>}
            </div>
          </div>
        </section>
      );
    }

    case "inquiryForm": {
      const o = ctx.settings.inquiryOptions;
      return (
        <section className="container-x section-y" id="plan">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                {s(d, "heading") && <H className="text-4xl sm:text-5xl">{s(d, "heading")}</H>}
                {s(d, "intro") && <p className="mt-5 text-lg text-ink-soft">{s(d, "intro")}</p>}
                <ContactDetails settings={ctx.settings} />
              </div>
            </div>
            <div className="lg:col-span-8">
              <InquiryForm destinations={o.destinations} experiences={o.experiences} interests={o.interests} />
            </div>
          </div>
        </section>
      );
    }

    case "contactForm":
      return (
        <section className="container-x section-y">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {s(d, "heading") && <H className="text-4xl sm:text-5xl">{s(d, "heading")}</H>}
              {s(d, "intro") && <p className="mt-5 text-lg text-ink-soft">{s(d, "intro")}</p>}
              <ContactDetails settings={ctx.settings} />
            </div>
            <div className="lg:col-span-7"><ContactForm /></div>
          </div>
        </section>
      );

    case "listing":
      if (!ctx.listing) return null;
      return (
        <section className="container-x section-y pt-0">
          {s(d, "heading") && <h2 className="mb-10 text-4xl">{s(d, "heading")}</h2>}
          {ctx.listing}
        </section>
      );

    default:
      return null;
  }
}

function Hero({ d, isFirst }: { d: D; isFirst: boolean }) {
  const H = isFirst ? "h1" : "h2";
  const compact = Boolean(d.compact);
  const cta = lnk(d, "cta");
  const cta2 = lnk(d, "secondaryCta");
  const video = s(d, "videoUrl");
  const safeVideo = /^https:\/\/.+\.(mp4|webm)(\?.*)?$/i.test(video) ? video : "";
  return (
    <section className={cn("relative isolate grain overflow-hidden bg-ink text-white", compact ? "min-h-[58svh]" : "min-h-[92svh]")}>
      <SmartImage image={img(d, "image")} sizes="100vw" priority={isFirst} quality={85} className="-z-20" imgClassName="img-reveal" />
      {safeVideo && (
        <video className="absolute inset-0 -z-20 hidden size-full object-cover motion-safe:block" autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src={safeVideo} />
        </video>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
      <div className={cn("container-x flex flex-col justify-end", compact ? "min-h-[58svh] pb-14 pt-32" : "min-h-[92svh] pb-16 pt-40 sm:pb-24")}>
        <div className="max-w-4xl">
          {s(d, "heading") && (
            <H className={cn("hero-rise", compact ? "text-5xl sm:text-7xl" : "text-[clamp(3.5rem,11vw,9.5rem)] leading-[0.92]")}>
              {s(d, "heading")}
            </H>
          )}
          {s(d, "subtitle") && (
            <p className="hero-rise mt-6 max-w-xl text-lg text-white/88 sm:text-xl [animation-delay:150ms]">{s(d, "subtitle")}</p>
          )}
          {(cta?.label || cta2?.label) && (
            <div className="hero-rise mt-9 flex flex-wrap gap-3 [animation-delay:300ms]">
              {cta?.label && <Link href={safeHref(cta.href)} className="btn btn-light">{cta.label}</Link>}
              {cta2?.label && <Link href={safeHref(cta2.href)} className="btn btn-ghost text-white">{cta2.label}</Link>}
            </div>
          )}
        </div>
      </div>
      <Ridge variant="fill" className="absolute inset-x-0 -bottom-px h-8 text-paper sm:h-12" />
    </section>
  );
}

function ContactDetails({ settings }: { settings: SiteSettings }) {
  const items = [
    settings.email && { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.whatsapp && { label: "WhatsApp", value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}` },
    settings.address && { label: "Office", value: settings.address, href: settings.googleMapsUrl || undefined },
    settings.businessHours && { label: "Hours", value: settings.businessHours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];
  if (!items.length) return null;
  return (
    <dl className="mt-10 space-y-4 border-t border-line pt-8">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-sm text-ink-soft">{i.label}</dt>
          <dd className="mt-0.5">
            {i.href ? <a className="link-underline" href={safeHref(i.href)} {...(i.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{i.value}</a> : i.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
