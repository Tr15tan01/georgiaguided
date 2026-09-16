/**
 * Idempotent seed: `npm run db:seed`
 *
 * By default only creates content that doesn't exist yet (matched by slug/question/name),
 * so it is safe to run against a live database — editor changes are never overwritten.
 * `npm run db:seed -- --reset` overwrites seeded documents with the original content.
 */
import "./load-env";
import path from "node:path";
import mongoose, { type Model } from "mongoose";
import { Activity, BlogPost, Destination, FAQ, Media, Page, Service, SiteSettings, Testimonial, Tour } from "../src/models";
import { IMAGES, writeArtwork } from "./seed/art";
import type { SeedImageKey } from "./seed/types";
import { TOURS } from "./seed/data-tours";
import { DESTINATIONS, FAQS, SERVICES, TESTIMONIALS } from "./seed/data-catalog";
import { POSTS } from "./seed/data-blog";
import { pages, settings, type Helpers } from "./seed/data-site";
import { ensureAdmin } from "./create-admin";

const SEO_TITLES: Record<string, string> = {
  "best-time-to-visit-georgia": "Best Time to Visit Georgia — Seasonal Guide",
  "georgia-travel-guide-first-time": "Georgia Travel Guide for First-Time Visitors",
  "tbilisi-travel-guide": "Tbilisi Travel Guide: What to Do, See and Eat",
  "georgian-wine-guide": "Georgian Wine Guide: Qvevri, Grapes, Regions",
  "georgian-food-guide": "What to Eat in Georgia: 15 Must-Try Dishes",
  "kazbegi-travel-guide": "Kazbegi Travel Guide: Gergeti Church & Hikes",
  "svaneti-travel-guide": "Svaneti Travel Guide: Mestia and Ushguli",
  "georgia-7-day-itinerary": "7-Day Georgia Itinerary: The Perfect Week",
  "getting-around-georgia": "Getting Around Georgia: Transport Guide",
  "practical-travel-tips-georgia": "Georgia Travel Tips: Money, Safety, Etiquette",
};

const RESET = process.argv.includes("--reset");
const stats = { created: 0, updated: 0, skipped: 0 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsert(model: Model<any>, filter: Record<string, unknown>, doc: Record<string, unknown>) {
  const existing = await model.findOne(filter).select("_id").lean<{ _id: mongoose.Types.ObjectId }>();
  if (existing && !RESET) {
    stats.skipped++;
    return existing._id;
  }
  if (existing) {
    await model.updateOne({ _id: existing._id }, { $set: doc }, { runValidators: true });
    stats.updated++;
    return existing._id;
  }
  const created = await model.create(doc);
  stats.created++;
  return created._id as mongoose.Types.ObjectId;
}

function img(key: SeedImageKey) {
  const i = IMAGES[key];
  return { url: `/seed/${i.file}`, publicId: `seed/${i.file.replace(/\.svg$/, "")}`, width: 1600, height: 1000, alt: i.alt };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.");
  console.log(`Seeding ${uri.replace(/\/\/[^@]*@/, "//***@")} ${RESET ? "(reset mode)" : "(insert-missing mode)"}`);
  await mongoose.connect(uri);
  await Promise.all([Tour, Destination, Service, BlogPost, FAQ, Page, Media].map((m) => m.syncIndexes()));

  // 1. Artwork + media library entries
  writeArtwork(path.join(process.cwd(), "public", "seed"));
  for (const key of Object.keys(IMAGES) as SeedImageKey[]) {
    const r = img(key);
    await upsert(Media, { publicId: r.publicId }, { ...r, format: "svg", bytes: 0 });
  }

  // 2. Destinations & tours (two passes to resolve cross references)
  const destId = new Map<string, string>();
  for (const d of DESTINATIONS) {
    const id = await upsert(Destination, { slug: d.slug }, {
      name: d.name, slug: d.slug, region: d.region, shortDescription: d.shortDescription, description: d.description,
      status: "published", featured: d.featured, heroImage: img(d.hero), gallery: d.gallery.map(img),
      thingsToDo: d.thingsToDo, bestTimeToVisit: d.bestTimeToVisit, howToGetThere: d.howToGetThere, travelTips: d.travelTips,
      order: d.order, seo: { title: `${d.name} Travel Guide`, description: d.shortDescription },
    });
    destId.set(d.slug, String(id));
  }

  const tourId = new Map<string, string>();
  for (const [i, t] of TOURS.entries()) {
    const id = await upsert(Tour, { slug: t.slug }, {
      title: t.title, slug: t.slug, shortDescription: t.shortDescription, description: t.description, status: "published",
      featured: t.featured, category: t.category, experiences: t.experiences, priceFrom: t.priceFrom, currency: "EUR",
      durationDays: t.durationDays, duration: t.duration, groupSize: t.groupSize, difficulty: t.difficulty, meetingPoint: t.meetingPoint,
      destinations: t.destinations.map((s) => destId.get(s)).filter(Boolean),
      heroImage: img(t.hero), gallery: t.gallery.map(img), itinerary: t.itinerary, included: t.included, excluded: t.excluded,
      highlights: t.highlights, faq: t.faq, structuredData: { touristTrip: true, faqPage: true }, order: i, seo: t.seo,
    });
    tourId.set(t.slug, String(id));
  }
  const ids = (map: Map<string, string>, slugs: string[]) => slugs.map((s) => map.get(s)).filter((x): x is string => Boolean(x));

  // Cross references only set when the document was just created or in reset mode (never clobber edits).
  for (const t of TOURS) {
    await Tour.updateOne({ slug: t.slug, ...(RESET ? {} : { relatedTours: { $size: 0 } }) }, { $set: { relatedTours: ids(tourId, t.related) } });
  }
  for (const d of DESTINATIONS) {
    await Destination.updateOne({ slug: d.slug, ...(RESET ? {} : { relatedTours: { $size: 0 } }) }, { $set: { relatedTours: ids(tourId, d.tours) } });
  }

  // 3. Services
  for (const s of SERVICES) {
    await upsert(Service, { slug: s.slug }, {
      title: s.title, slug: s.slug, shortDescription: s.shortDescription, description: s.description, status: "published",
      image: img(s.image), benefits: s.benefits, cta: s.cta, order: s.order,
      seo: { title: `${s.title} in Georgia`, description: s.shortDescription },
    });
  }

  // 4. Blog
  const postId = new Map<string, string>();
  for (const p of POSTS) {
    const id = await upsert(BlogPost, { slug: p.slug }, {
      title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, coverImage: img(p.cover),
      author: "GeorgiaGuided Editors", category: p.category, tags: p.tags, status: "published",
      publishedAt: new Date(Date.now() - p.daysAgo * 864e5), featured: p.daysAgo < 20,
      relatedDestinations: ids(destId, p.destinations), relatedTours: ids(tourId, p.tours),
      seo: { title: SEO_TITLES[p.slug] ?? p.title, description: p.excerpt },
    });
    postId.set(p.slug, String(id));
  }
  for (const p of POSTS) {
    await BlogPost.updateOne({ slug: p.slug, ...(RESET ? {} : { relatedPosts: { $size: 0 } }) }, { $set: { relatedPosts: ids(postId, p.related) } });
  }

  // 5. FAQs & testimonials
  for (const f of FAQS) await upsert(FAQ, { question: f.question }, { ...f, status: "published" });
  for (const t of TESTIMONIALS) await upsert(Testimonial, { name: t.name, isDemo: true }, { ...t, isDemo: true, status: "published" });

  // 6. Settings & pages
  const helpers: Helpers = {
    img,
    tourIds: (s) => ids(tourId, s),
    destIds: (s) => ids(destId, s),
    postIds: (s) => ids(postId, s),
  };
  await upsert(SiteSettings, { key: "site" }, { key: "site", ...settings(helpers) });
  for (const p of pages(helpers)) {
    await upsert(Page, { slug: p.slug }, { ...p, status: "published" });
  }

  // 7. Admin
  await ensureAdmin();

  if (stats.created) await Activity.create({ action: "seeded", entity: "system", label: `${stats.created} items`, actor: "seed script" });
  console.log(`✓ Done. Created ${stats.created}, updated ${stats.updated}, left unchanged ${stats.skipped}.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("✗ Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
