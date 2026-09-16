import { z } from "zod";
import { INQUIRY_STATUSES } from "./types";

const str = (max = 300) => z.string().trim().max(max);
const optStr = (max = 300) => str(max).optional().default("");
const longText = (max = 60_000) => z.string().max(max).optional().default("");
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(96)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens");
const objectId = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid reference");
const ids = z.array(objectId).max(50).optional().default([]);
const stringList = (max = 60) => z.array(str(500)).max(max).optional().default([]);
const status = z.enum(["draft", "published"]).default("draft");
const safeUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v) || /^(mailto|tel):/i.test(v) || v.startsWith("#"), "Use a relative path or an http(s) URL")
  .optional()
  .default("");

export const mediaRefSchema = z.object({
  url: z.string().trim().min(1).max(1000).refine((v) => v.startsWith("/") || v.startsWith("https://"), "Image URL must be https or a local path"),
  publicId: optStr(300),
  width: z.coerce.number().int().positive().max(20000).optional(),
  height: z.coerce.number().int().positive().max(20000).optional(),
  alt: str(300).default(""),
  caption: optStr(500),
});
const media = mediaRefSchema.nullable().optional().default(null);

export const seoSchema = z
  .object({
    title: optStr(120),
    description: optStr(320),
    canonical: safeUrl,
    ogImage: media,
    noindex: z.boolean().optional().default(false),
  })
  .optional()
  .default({ title: "", description: "", canonical: "", ogImage: null, noindex: false });

const link = z.object({ label: str(80), href: safeUrl });

export const tourSchema = z.object({
  title: str(160).min(2, "Title is required"),
  slug,
  shortDescription: optStr(400),
  description: longText(),
  status,
  featured: z.boolean().default(false),
  category: str(60).default("Culture"),
  experiences: stringList(20),
  priceFrom: z.coerce.number().min(0).max(1_000_000).optional(),
  currency: z.enum(["EUR", "USD", "GBP", "GEL"]).default("EUR"),
  durationDays: z.coerce.number().int().min(1).max(60).default(1),
  duration: optStr(60),
  groupSize: optStr(60),
  difficulty: z.enum(["easy", "moderate", "challenging"]).default("easy"),
  meetingPoint: optStr(200),
  destinations: ids,
  heroImage: media,
  gallery: z.array(mediaRefSchema).max(40).optional().default([]),
  itinerary: z
    .array(z.object({ title: str(160), description: longText(5000), overnight: optStr(120), meals: optStr(120) }))
    .max(30)
    .optional()
    .default([]),
  included: stringList(),
  excluded: stringList(),
  highlights: stringList(),
  faq: z.array(z.object({ question: str(300), answer: longText(3000) })).max(30).optional().default([]),
  relatedTours: ids,
  structuredData: z
    .object({ touristTrip: z.boolean().default(true), faqPage: z.boolean().default(true) })
    .optional()
    .default({ touristTrip: true, faqPage: true }),
  order: z.coerce.number().int().default(0),
  seo: seoSchema,
});

export const destinationSchema = z.object({
  name: str(120).min(2, "Name is required"),
  slug,
  region: optStr(120),
  shortDescription: optStr(400),
  description: longText(),
  status,
  featured: z.boolean().default(false),
  heroImage: media,
  gallery: z.array(mediaRefSchema).max(40).optional().default([]),
  thingsToDo: z.array(z.object({ title: str(160), description: longText(3000) })).max(30).optional().default([]),
  bestTimeToVisit: longText(10000),
  howToGetThere: longText(10000),
  travelTips: stringList(),
  relatedTours: ids,
  order: z.coerce.number().int().default(0),
  seo: seoSchema,
});

export const serviceSchema = z.object({
  title: str(120).min(2, "Title is required"),
  slug,
  shortDescription: optStr(400),
  description: longText(),
  status,
  image: media,
  benefits: stringList(),
  cta: link.optional().default({ label: "Request this service", href: "/plan-your-trip" }),
  order: z.coerce.number().int().default(0),
  seo: seoSchema,
});

export const blogPostSchema = z.object({
  title: str(180).min(2, "Title is required"),
  slug,
  excerpt: optStr(500),
  content: longText(120_000),
  coverImage: media,
  author: str(120).default("GeorgiaGuided Editors"),
  category: str(60).default("Travel Guide"),
  tags: stringList(20),
  publishedAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .refine((d) => !d || !Number.isNaN(d.getTime()), "Invalid date"),
  status,
  featured: z.boolean().default(false),
  relatedPosts: ids,
  relatedTours: ids,
  relatedDestinations: ids,
  seo: seoSchema,
});

export const testimonialSchema = z.object({
  name: str(120).min(1, "Name is required"),
  location: optStr(120),
  quote: str(1500).min(5, "Quote is required"),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  tripName: optStr(160),
  isDemo: z.boolean().default(false),
  status,
  order: z.coerce.number().int().default(0),
});

export const faqSchema = z.object({
  question: str(300).min(5, "Question is required"),
  answer: longText(5000).refine((v) => v.length > 0, "Answer is required"),
  category: str(60).default("General"),
  status,
  order: z.coerce.number().int().default(0),
});

export const SECTION_TYPES = [
  "hero", "intro", "featuredTours", "destinations", "services", "features", "testimonials",
  "posts", "cta", "faq", "imageText", "inquiryForm", "contactForm", "listing",
] as const;

export const pageSchema = z.object({
  title: str(160).min(2, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(96)
    .regex(/^(home|[a-z0-9]+(?:-[a-z0-9]+)*)$/, "Use lowercase letters, numbers and hyphens"),
  kind: z.enum(["system", "custom", "legal"]).default("custom"),
  status,
  sections: z
    .array(
      z.object({
        _key: str(40).min(1),
        type: z.enum(SECTION_TYPES),
        enabled: z.boolean().default(true),
        data: z.record(z.string(), z.unknown()).default({}),
      }),
    )
    .max(40)
    .default([]),
  seo: seoSchema,
});

export const settingsSchema = z.object({
  companyName: str(120).min(1),
  tagline: optStr(200),
  logo: media,
  favicon: media,
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).optional().default(""),
  phone: optStr(60),
  whatsapp: optStr(60),
  address: optStr(400),
  googleMapsUrl: safeUrl,
  businessHours: optStr(300),
  socialLinks: z.array(link).max(12).default([]),
  navigation: z.array(link).max(10).default([]),
  headerCta: link,
  footerDescription: optStr(600),
  footerColumns: z.array(z.object({ title: str(60), links: z.array(link).max(12).default([]) })).max(5).default([]),
  legalLinks: z.array(link).max(8).default([]),
  defaultSeoTitle: str(120).min(1),
  defaultSeoDescription: optStr(320),
  defaultOgImage: media,
  gaId: z.union([z.literal(""), z.string().trim().regex(/^G-[A-Z0-9]+$/i, "GA4 IDs look like G-XXXXXXX")]).optional().default(""),
  plausibleDomain: optStr(200),
  inquiryOptions: z.object({
    destinations: stringList(40),
    experiences: stringList(40),
    interests: stringList(40),
  }),
});

/* ─── Public forms ─── */
const tokenList = z.array(z.string().trim().max(80)).max(30).default([]);
const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? new Date(`${v}T00:00:00Z`) : undefined))
  .refine((d) => !d || !Number.isNaN(d.getTime()), "Please enter a valid date");

export const tripInquirySchema = z
  .object({
    name: str(120).min(2, "Please tell us your name"),
    email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
    phone: z.string().trim().max(40).regex(/^[+()\d\s.-]*$/, "Use digits, spaces and + only").optional().default(""),
    country: str(80).min(2, "Please tell us where you're travelling from"),
    arrivalDate: optionalDate,
    departureDate: optionalDate,
    travelers: z.coerce.number().int("Whole numbers only").min(1, "At least one traveler").max(200),
    destinations: tokenList,
    experiences: tokenList,
    interests: tokenList,
    accommodationNeeded: z.boolean().default(false),
    airportTransferNeeded: z.boolean().default(false),
    message: str(5000).min(10, "A few words about your plans help us reply properly"),
    sourcePath: optStr(300),
  })
  .refine((d) => !d.arrivalDate || !d.departureDate || d.departureDate >= d.arrivalDate, {
    path: ["departureDate"],
    message: "Departure must be after arrival",
  });

export const contactSchema = z.object({
  name: str(120).min(2, "Please tell us your name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  subject: optStr(160),
  message: str(5000).min(10, "Please write a slightly longer message"),
  sourcePath: optStr(300),
});

export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);

/** Map zod issues to { "field.path": "message" } */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
