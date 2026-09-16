import { Schema, model, models, type Model, Types } from "mongoose";
import { mediaRefSchema, seoSchema, linkSchema, statusField, slugField } from "./shared";

// Documents are typed at the call site (see src/lib/types.ts). Inferring schema types for every
// model makes the TypeScript checker extremely slow and memory hungry, so models are loosely typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = Record<string, any>;
function getModel(name: string, schema: Schema): Model<AnyDoc> {
  return (models[name] as Model<AnyDoc>) ?? model<AnyDoc>(name, schema);
}
const ref = (name: string) => [{ type: Types.ObjectId, ref: name }];

/* ─── Admin ─── */
const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: Date,
  },
  { timestamps: true },
);
export const Admin = getModel("Admin", adminSchema);

/* ─── Tour ─── */
const tourSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: slugField,
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    status: statusField,
    featured: { type: Boolean, default: false, index: true },
    category: { type: String, default: "Culture", index: true },
    experiences: [String],
    priceFrom: Number,
    currency: { type: String, default: "EUR" },
    durationDays: { type: Number, default: 1 },
    duration: { type: String, default: "" },
    groupSize: String,
    difficulty: { type: String, enum: ["easy", "moderate", "challenging"], default: "easy" },
    meetingPoint: String,
    destinations: ref("Destination"),
    heroImage: { type: mediaRefSchema, default: null },
    gallery: [mediaRefSchema],
    itinerary: [{ _id: false, title: String, description: String, overnight: String, meals: String }],
    included: [String],
    excluded: [String],
    highlights: [String],
    faq: [{ _id: false, question: String, answer: String }],
    relatedTours: ref("Tour"),
    structuredData: {
      touristTrip: { type: Boolean, default: true },
      faqPage: { type: Boolean, default: true },
    },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);
tourSchema.index({ status: 1, order: 1 });
tourSchema.index({ createdAt: -1 });
export const Tour = getModel("Tour", tourSchema);

/* ─── Destination ─── */
const destinationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: slugField,
    region: String,
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    status: statusField,
    featured: { type: Boolean, default: false },
    heroImage: { type: mediaRefSchema, default: null },
    gallery: [mediaRefSchema],
    thingsToDo: [{ _id: false, title: String, description: String }],
    bestTimeToVisit: { type: String, default: "" },
    howToGetThere: { type: String, default: "" },
    travelTips: [String],
    relatedTours: ref("Tour"),
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);
destinationSchema.index({ createdAt: -1 });
export const Destination = getModel("Destination", destinationSchema);

/* ─── Service ─── */
const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: slugField,
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    status: statusField,
    image: { type: mediaRefSchema, default: null },
    benefits: [String],
    cta: { type: linkSchema, default: () => ({ label: "Request this service", href: "/plan-your-trip" }) },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);
serviceSchema.index({ createdAt: -1 });
export const Service = getModel("Service", serviceSchema);

/* ─── BlogPost ─── */
const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: slugField,
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: mediaRefSchema, default: null },
    author: { type: String, default: "GeorgiaGuided Editors" },
    category: { type: String, default: "Travel Guide", index: true },
    tags: [String],
    publishedAt: { type: Date, index: true },
    status: statusField,
    featured: { type: Boolean, default: false },
    relatedPosts: ref("BlogPost"),
    relatedTours: ref("Tour"),
    relatedDestinations: ref("Destination"),
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ createdAt: -1 });
export const BlogPost = getModel("BlogPost", blogPostSchema);

/* ─── Testimonial ─── */
const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    location: String,
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    tripName: String,
    isDemo: { type: Boolean, default: false },
    status: statusField,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Testimonial = getModel("Testimonial", testimonialSchema);

/* ─── FAQ ─── */
const faqSchema = new Schema(
  {
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General", index: true },
    status: statusField,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const FAQ = getModel("FAQ", faqSchema);

/* ─── Page ─── */
const pageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: slugField,
    kind: { type: String, enum: ["system", "custom", "legal"], default: "custom" },
    status: statusField,
    sections: [
      {
        _id: false,
        _key: { type: String, required: true },
        type: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        data: { type: Schema.Types.Mixed, default: {} },
      },
    ],
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true, minimize: false },
);
export const Page = getModel("Page", pageSchema);

/* ─── SiteSettings (singleton) ─── */
const settingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },
    companyName: { type: String, default: "GeorgiaGuided" },
    tagline: String,
    logo: { type: mediaRefSchema, default: null },
    favicon: { type: mediaRefSchema, default: null },
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
    googleMapsUrl: String,
    businessHours: String,
    socialLinks: [linkSchema],
    navigation: [linkSchema],
    headerCta: { type: linkSchema, default: () => ({ label: "Plan your trip", href: "/plan-your-trip" }) },
    footerDescription: String,
    footerColumns: [{ _id: false, title: String, links: [linkSchema] }],
    legalLinks: [linkSchema],
    defaultSeoTitle: { type: String, default: "GeorgiaGuided" },
    defaultSeoDescription: { type: String, default: "" },
    defaultOgImage: { type: mediaRefSchema, default: null },
    gaId: String,
    plausibleDomain: String,
    inquiryOptions: {
      destinations: [String],
      experiences: [String],
      interests: [String],
    },
  },
  { timestamps: true },
);
export const SiteSettings = getModel("SiteSettings", settingsSchema);

/* ─── Inquiry ─── */
const inquirySchema = new Schema(
  {
    type: { type: String, enum: ["trip", "contact"], default: "trip" },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: String,
    country: String,
    arrivalDate: Date,
    departureDate: Date,
    travelers: Number,
    destinations: [String],
    experiences: [String],
    interests: [String],
    accommodationNeeded: Boolean,
    airportTransferNeeded: Boolean,
    subject: String,
    message: { type: String, default: "" },
    sourcePath: String,
    ipHash: { type: String, select: false },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED", "ARCHIVED"],
      default: "NEW",
      index: true,
    },
    contactedAt: Date,
    notes: [{ body: String, author: String, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true },
);
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });
export const Inquiry = getModel("Inquiry", inquirySchema);

/* ─── Media ─── */
const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    alt: { type: String, default: "" },
    caption: String,
  },
  { timestamps: true },
);
mediaSchema.index({ createdAt: -1 });
export const Media = getModel("Media", mediaSchema);

/* ─── Activity log ─── */
const activitySchema = new Schema(
  {
    action: { type: String, required: true },
    entity: String,
    entityId: String,
    label: String,
    actor: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
activitySchema.index({ createdAt: -1 });
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });
export const Activity = getModel("Activity", activitySchema);

/* ─── Rate limit buckets (TTL) ─── */
const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = getModel("RateLimit", rateLimitSchema);
