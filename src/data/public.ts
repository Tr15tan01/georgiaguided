import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { connectDB, serialize } from "@/lib/db";
import { BlogPost, Destination, FAQ, Page, Service, SiteSettings, Testimonial, Tour } from "@/models";
import type {
  BlogPost as TBlogPost, Destination as TDestination, Faq, Page as TPage, Service as TService,
  SiteSettings as TSettings, Testimonial as TTestimonial, Tour as TTour,
} from "@/lib/types";

const PUBLISHED = { status: "published" } as const;
const livePosts = () => ({ status: "published", publishedAt: { $lte: new Date() } });

async function isPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

export const DEFAULT_SETTINGS: TSettings = {
  companyName: "GeorgiaGuided",
  socialLinks: [],
  navigation: [
    { label: "Explore", href: "/why-georgia" },
    { label: "Tours", href: "/tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "Services", href: "/services" },
    { label: "Journal", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  headerCta: { label: "Plan your trip", href: "/plan-your-trip" },
  footerColumns: [],
  legalLinks: [],
  defaultSeoTitle: "GeorgiaGuided — Private tours and journeys in Georgia",
  defaultSeoDescription: "",
  inquiryOptions: { destinations: [], experiences: [], interests: [] },
};

export const getSettings = cache(async (): Promise<TSettings> => {
  await connectDB();
  const doc = await SiteSettings.findOne({ key: "site" }).lean();
  return doc ? { ...DEFAULT_SETTINGS, ...serialize<TSettings>(doc) } : DEFAULT_SETTINGS;
});

export const getPage = cache(async (slug: string): Promise<TPage | null> => {
  await connectDB();
  const filter = (await isPreview()) ? { slug } : { slug, ...PUBLISHED };
  const doc = await Page.findOne(filter).lean();
  return doc ? serialize<TPage>(doc) : null;
});

/* Tours */
export const getTours = cache(async (): Promise<TTour[]> => {
  await connectDB();
  return serialize(await Tour.find(PUBLISHED).sort({ order: 1, createdAt: -1 }).lean());
});

export async function getToursByIds(ids: string[]): Promise<TTour[]> {
  if (!ids.length) return [];
  await connectDB();
  const docs = serialize<TTour[]>(await Tour.find({ _id: { $in: ids }, ...PUBLISHED }).lean());
  return ids.map((id) => docs.find((d) => d._id === id)).filter((d): d is TTour => Boolean(d));
}

export async function getFeaturedTours(limit = 6): Promise<TTour[]> {
  await connectDB();
  return serialize(await Tour.find({ ...PUBLISHED, featured: true }).sort({ order: 1 }).limit(limit).lean());
}

export const getTour = cache(async (slug: string): Promise<TTour | null> => {
  await connectDB();
  const filter = (await isPreview()) ? { slug } : { slug, ...PUBLISHED };
  const doc = await Tour.findOne(filter).lean();
  return doc ? serialize<TTour>(doc) : null;
});

export async function getToursForDestination(destinationId: string, explicit: string[] = []): Promise<TTour[]> {
  await connectDB();
  const docs = await Tour.find({ ...PUBLISHED, $or: [{ destinations: destinationId }, { _id: { $in: explicit } }] })
    .sort({ order: 1 })
    .limit(8)
    .lean();
  return serialize(docs);
}

/* Destinations */
export const getDestinations = cache(async (): Promise<TDestination[]> => {
  await connectDB();
  return serialize(await Destination.find(PUBLISHED).sort({ order: 1, name: 1 }).lean());
});

export async function getDestinationsByIds(ids: string[]): Promise<TDestination[]> {
  if (!ids.length) return [];
  await connectDB();
  const docs = serialize<TDestination[]>(await Destination.find({ _id: { $in: ids }, ...PUBLISHED }).lean());
  return ids.map((id) => docs.find((d) => d._id === id)).filter((d): d is TDestination => Boolean(d));
}

export async function getFeaturedDestinations(limit = 6): Promise<TDestination[]> {
  await connectDB();
  const featured = await Destination.find({ ...PUBLISHED, featured: true }).sort({ order: 1 }).limit(limit).lean();
  if (featured.length) return serialize(featured);
  return serialize(await Destination.find(PUBLISHED).sort({ order: 1 }).limit(limit).lean());
}

export const getDestination = cache(async (slug: string): Promise<TDestination | null> => {
  await connectDB();
  const filter = (await isPreview()) ? { slug } : { slug, ...PUBLISHED };
  const doc = await Destination.findOne(filter).lean();
  return doc ? serialize<TDestination>(doc) : null;
});

/* Services */
export const getServices = cache(async (): Promise<TService[]> => {
  await connectDB();
  return serialize(await Service.find(PUBLISHED).sort({ order: 1, title: 1 }).lean());
});

export async function getServicesByIds(ids: string[]): Promise<TService[]> {
  if (!ids.length) return [];
  await connectDB();
  const docs = serialize<TService[]>(await Service.find({ _id: { $in: ids }, ...PUBLISHED }).lean());
  return ids.map((id) => docs.find((d) => d._id === id)).filter((d): d is TService => Boolean(d));
}

export const getService = cache(async (slug: string): Promise<TService | null> => {
  await connectDB();
  const filter = (await isPreview()) ? { slug } : { slug, ...PUBLISHED };
  const doc = await Service.findOne(filter).lean();
  return doc ? serialize<TService>(doc) : null;
});

/* Blog */
export const getPosts = cache(async (): Promise<TBlogPost[]> => {
  await connectDB();
  return serialize(await BlogPost.find(livePosts()).select("-content").sort({ publishedAt: -1 }).lean());
});

export async function getLatestPosts(limit = 3): Promise<TBlogPost[]> {
  await connectDB();
  return serialize(await BlogPost.find(livePosts()).select("-content").sort({ featured: -1, publishedAt: -1 }).limit(limit).lean());
}

export async function getPostsByIds(ids: string[]): Promise<TBlogPost[]> {
  if (!ids.length) return [];
  await connectDB();
  const docs = serialize<TBlogPost[]>(await BlogPost.find({ _id: { $in: ids }, ...livePosts() }).select("-content").lean());
  return ids.map((id) => docs.find((d) => d._id === id)).filter((d): d is TBlogPost => Boolean(d));
}

export const getPost = cache(async (slug: string): Promise<TBlogPost | null> => {
  await connectDB();
  const filter = (await isPreview()) ? { slug } : { slug, ...livePosts() };
  const doc = await BlogPost.findOne(filter).lean();
  return doc ? serialize<TBlogPost>(doc) : null;
});

export async function getPostsMentioning(field: "relatedTours" | "relatedDestinations", id: string, limit = 3): Promise<TBlogPost[]> {
  await connectDB();
  return serialize(await BlogPost.find({ ...livePosts(), [field]: id }).select("-content").sort({ publishedAt: -1 }).limit(limit).lean());
}

/* Testimonials & FAQ */
export async function getTestimonials(ids: string[] = []): Promise<TTestimonial[]> {
  await connectDB();
  const filter = ids.length ? { _id: { $in: ids }, ...PUBLISHED } : PUBLISHED;
  return serialize(await Testimonial.find(filter).sort({ order: 1 }).limit(12).lean());
}

export const getFaqs = cache(async (category?: string): Promise<Faq[]> => {
  await connectDB();
  const filter = category ? { ...PUBLISHED, category } : PUBLISHED;
  return serialize(await FAQ.find(filter).sort({ category: 1, order: 1 }).lean());
});

/* Sitemap */
export async function getSitemapEntries() {
  await connectDB();
  const [tours, destinations, services, posts, pages] = await Promise.all([
    Tour.find(PUBLISHED).select("slug updatedAt seo.noindex").lean(),
    Destination.find(PUBLISHED).select("slug updatedAt seo.noindex").lean(),
    Service.find(PUBLISHED).select("slug updatedAt seo.noindex").lean(),
    BlogPost.find(livePosts()).select("slug updatedAt seo.noindex").lean(),
    Page.find(PUBLISHED).select("slug kind updatedAt seo.noindex").lean(),
  ]);
  return serialize<{
    tours: SlugEntry[]; destinations: SlugEntry[]; services: SlugEntry[]; posts: SlugEntry[];
    pages: (SlugEntry & { kind: string })[];
  }>({ tours, destinations, services, posts, pages });
}
type SlugEntry = { slug: string; updatedAt?: string; seo?: { noindex?: boolean } };
