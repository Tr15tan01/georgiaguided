import type { Tab } from "./fields";

export const EXPERIENCES = ["Mountains", "Wine", "Food", "Culture", "History", "Adventure", "Relaxation", "Beach", "Skiing", "Photography"];
export const TOUR_CATEGORIES = ["City", "Mountains", "Wine & Food", "Culture & History", "Nature", "Coast", "Multi-day"];

const statusField = {
  name: "status",
  label: "Status",
  type: "select" as const,
  options: [
    { value: "draft", label: "Draft — hidden from the website" },
    { value: "published", label: "Published — visible on the website" },
  ],
};
const seoTab: Tab = { label: "SEO", fields: [{ name: "seo", label: "Search & social", type: "seo" }] };

export type ResourceKey = "tours" | "destinations" | "services" | "blog" | "testimonials" | "faqs";

export interface ResourceDef {
  key: ResourceKey;
  label: string;
  singular: string;
  titleField: string;
  hasSlug: boolean;
  publicPath?: (slug: string) => string;
  columns: { key: string; label: string; kind?: "status" | "bool" | "date" | "text" | "price" }[];
  searchFields: string[];
  defaultSort: Record<string, 1 | -1>;
  tabs: Tab[];
  defaults: Record<string, unknown>;
}

export const RESOURCES: Record<ResourceKey, ResourceDef> = {
  tours: {
    key: "tours",
    label: "Tours",
    singular: "tour",
    titleField: "title",
    hasSlug: true,
    publicPath: (s) => `/tours/${s}`,
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "priceFrom", label: "From", kind: "price" },
      { key: "featured", label: "Featured", kind: "bool" },
      { key: "status", label: "Status", kind: "status" },
      { key: "updatedAt", label: "Updated", kind: "date" },
    ],
    searchFields: ["title", "slug", "category"],
    defaultSort: { order: 1, createdAt: -1 },
    defaults: {
      title: "", slug: "", shortDescription: "", description: "", status: "draft", featured: false,
      category: "Culture & History", experiences: [], currency: "EUR", durationDays: 1, duration: "Full day",
      groupSize: "Private, 1–8 travelers", difficulty: "easy", meetingPoint: "", destinations: [], heroImage: null,
      gallery: [], itinerary: [], included: [], excluded: [], highlights: [], faq: [], relatedTours: [],
      structuredData: { touristTrip: true, faqPage: true }, order: 0, seo: {},
    },
    tabs: [
      {
        label: "Basic information",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, wide: true },
          { name: "slug", label: "URL slug", type: "slug", from: "title", required: true, help: "Appears in the address: /tours/your-slug" },
          { name: "category", label: "Category", type: "select", options: TOUR_CATEGORIES.map((c) => ({ value: c, label: c })) },
          { name: "shortDescription", label: "Short description", type: "textarea", wide: true, help: "Shown on tour cards and in search results (about 160 characters)." },
          { name: "priceFrom", label: "Price from", type: "number" },
          { name: "currency", label: "Currency", type: "select", options: ["EUR", "USD", "GBP", "GEL"].map((c) => ({ value: c, label: c })) },
          { name: "durationDays", label: "Duration in days", type: "number", help: "Used for filtering. Use 1 for day trips." },
          { name: "duration", label: "Duration label", type: "text", placeholder: "e.g. Full day, 10 hours" },
          { name: "groupSize", label: "Group size", type: "text" },
          { name: "difficulty", label: "Difficulty", type: "select", options: [{ value: "easy", label: "Easy" }, { value: "moderate", label: "Moderate" }, { value: "challenging", label: "Challenging" }] },
          { name: "meetingPoint", label: "Meeting point", type: "text", wide: true },
          { name: "experiences", label: "Experiences", type: "tags", suggestions: EXPERIENCES, wide: true, help: "Used by the experience filter on /tours." },
        ],
      },
      {
        label: "Media",
        fields: [
          { name: "heroImage", label: "Hero image", type: "image", wide: true },
          { name: "gallery", label: "Gallery", type: "gallery", wide: true, help: "Drag to reorder." },
        ],
      },
      { label: "Description", fields: [{ name: "description", label: "Full description", type: "markdown", wide: true }, { name: "highlights", label: "Highlights", type: "stringList", itemLabel: "highlight", wide: true }] },
      {
        label: "Itinerary",
        fields: [
          {
            name: "itinerary", label: "Itinerary", type: "repeater", itemLabel: "stop or day", titleKey: "title", wide: true,
            fields: [
              { name: "title", label: "Title", type: "text", wide: true },
              { name: "description", label: "Description", type: "textarea", wide: true },
              { name: "meals", label: "Meals", type: "text" },
              { name: "overnight", label: "Overnight", type: "text" },
            ],
          },
        ],
      },
      {
        label: "What's included",
        fields: [
          { name: "included", label: "Included", type: "stringList", itemLabel: "item", wide: true },
          { name: "excluded", label: "Not included", type: "stringList", itemLabel: "item", wide: true },
        ],
      },
      {
        label: "FAQ",
        fields: [
          {
            name: "faq", label: "Questions", type: "repeater", itemLabel: "question", titleKey: "question", wide: true,
            fields: [
              { name: "question", label: "Question", type: "text", wide: true },
              { name: "answer", label: "Answer", type: "textarea", wide: true },
            ],
          },
        ],
      },
      {
        label: "Related content",
        fields: [
          { name: "destinations", label: "Destinations visited", type: "refs", resource: "destinations", wide: true },
          { name: "relatedTours", label: "Related tours", type: "refs", resource: "tours", wide: true },
        ],
      },
      {
        label: "SEO",
        fields: [
          { name: "seo", label: "Search & social", type: "seo" },
          { name: "structuredData.touristTrip", label: "Add TouristTrip structured data", type: "checkbox" },
          { name: "structuredData.faqPage", label: "Add FAQPage structured data when FAQs exist", type: "checkbox" },
        ],
      },
      {
        label: "Publishing",
        fields: [
          statusField,
          { name: "featured", label: "Feature on the homepage when no tours are hand-picked", type: "checkbox" },
          { name: "order", label: "Sort order", type: "number", help: "Lower numbers appear first." },
        ],
      },
    ],
  },

  destinations: {
    key: "destinations",
    label: "Destinations",
    singular: "destination",
    titleField: "name",
    hasSlug: true,
    publicPath: (s) => `/destinations/${s}`,
    columns: [
      { key: "name", label: "Name" },
      { key: "region", label: "Region" },
      { key: "status", label: "Status", kind: "status" },
      { key: "updatedAt", label: "Updated", kind: "date" },
    ],
    searchFields: ["name", "slug", "region"],
    defaultSort: { order: 1, name: 1 },
    defaults: {
      name: "", slug: "", region: "", shortDescription: "", description: "", status: "draft", featured: false,
      heroImage: null, gallery: [], thingsToDo: [], bestTimeToVisit: "", howToGetThere: "", travelTips: [],
      relatedTours: [], order: 0, seo: {},
    },
    tabs: [
      {
        label: "Basic information",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "URL slug", type: "slug", from: "name", required: true },
          { name: "region", label: "Region", type: "text" },
          { name: "shortDescription", label: "Short description", type: "textarea", wide: true },
        ],
      },
      { label: "Media", fields: [{ name: "heroImage", label: "Hero image", type: "image", wide: true }, { name: "gallery", label: "Gallery", type: "gallery", wide: true }] },
      { label: "Description", fields: [{ name: "description", label: "Description", type: "markdown", wide: true }] },
      {
        label: "Things to do",
        fields: [
          {
            name: "thingsToDo", label: "Things to do", type: "repeater", itemLabel: "activity", titleKey: "title", wide: true,
            fields: [
              { name: "title", label: "Title", type: "text", wide: true },
              { name: "description", label: "Description", type: "textarea", wide: true },
            ],
          },
        ],
      },
      {
        label: "Practical info",
        fields: [
          { name: "bestTimeToVisit", label: "Best time to visit", type: "markdown", wide: true },
          { name: "howToGetThere", label: "How to get there", type: "markdown", wide: true },
          { name: "travelTips", label: "Travel tips", type: "stringList", itemLabel: "tip", wide: true },
        ],
      },
      { label: "Related content", fields: [{ name: "relatedTours", label: "Tours for this destination", type: "refs", resource: "tours", wide: true }] },
      seoTab,
      {
        label: "Publishing",
        fields: [statusField, { name: "featured", label: "Feature on homepage when none are hand-picked", type: "checkbox" }, { name: "order", label: "Sort order", type: "number" }],
      },
    ],
  },

  services: {
    key: "services",
    label: "Services",
    singular: "service",
    titleField: "title",
    hasSlug: true,
    publicPath: (s) => `/services/${s}`,
    columns: [
      { key: "title", label: "Title" },
      { key: "status", label: "Status", kind: "status" },
      { key: "order", label: "Order" },
      { key: "updatedAt", label: "Updated", kind: "date" },
    ],
    searchFields: ["title", "slug"],
    defaultSort: { order: 1, title: 1 },
    defaults: {
      title: "", slug: "", shortDescription: "", description: "", status: "draft", image: null, benefits: [],
      cta: { label: "Request this service", href: "/plan-your-trip" }, order: 0, seo: {},
    },
    tabs: [
      {
        label: "Basic information",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "URL slug", type: "slug", from: "title", required: true },
          { name: "shortDescription", label: "Short description", type: "textarea", wide: true },
          { name: "image", label: "Image", type: "image", wide: true },
        ],
      },
      {
        label: "Content",
        fields: [
          { name: "description", label: "Description", type: "markdown", wide: true },
          { name: "benefits", label: "Benefits", type: "stringList", itemLabel: "benefit", wide: true },
          { name: "cta", label: "Call to action", type: "link", wide: true },
        ],
      },
      seoTab,
      { label: "Publishing", fields: [statusField, { name: "order", label: "Sort order", type: "number" }] },
    ],
  },

  blog: {
    key: "blog",
    label: "Journal",
    singular: "article",
    titleField: "title",
    hasSlug: true,
    publicPath: (s) => `/blog/${s}`,
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status", kind: "status" },
      { key: "publishedAt", label: "Publish date", kind: "date" },
    ],
    searchFields: ["title", "slug", "category", "tags"],
    defaultSort: { publishedAt: -1, createdAt: -1 },
    defaults: {
      title: "", slug: "", excerpt: "", content: "", coverImage: null, author: "GeorgiaGuided Editors",
      category: "Travel Guide", tags: [], publishedAt: "", status: "draft", featured: false,
      relatedPosts: [], relatedTours: [], relatedDestinations: [], seo: {},
    },
    tabs: [
      {
        label: "Article",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, wide: true },
          { name: "slug", label: "URL slug", type: "slug", from: "title", required: true },
          { name: "author", label: "Author", type: "text" },
          { name: "excerpt", label: "Excerpt", type: "textarea", wide: true },
          { name: "content", label: "Content", type: "markdown", wide: true, help: "Use ## for section headings; they build the table of contents." },
        ],
      },
      { label: "Media", fields: [{ name: "coverImage", label: "Cover image", type: "image", wide: true }] },
      {
        label: "Organisation",
        fields: [
          { name: "category", label: "Category", type: "select", options: ["Travel Guide", "Destinations", "Food & Wine", "Itineraries", "Practical Tips", "Seasons"].map((c) => ({ value: c, label: c })) },
          { name: "tags", label: "Tags", type: "tags", wide: true },
        ],
      },
      {
        label: "Related content",
        fields: [
          { name: "relatedDestinations", label: "Related destinations", type: "refs", resource: "destinations", wide: true },
          { name: "relatedTours", label: "Related tours", type: "refs", resource: "tours", wide: true },
          { name: "relatedPosts", label: "Related articles", type: "refs", resource: "blog", wide: true },
        ],
      },
      seoTab,
      {
        label: "Publishing",
        fields: [
          statusField,
          { name: "publishedAt", label: "Publish date", type: "datetime", help: "Published articles with a future date stay hidden until that time." },
          { name: "featured", label: "Featured article", type: "checkbox" },
        ],
      },
    ],
  },

  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    titleField: "name",
    hasSlug: false,
    columns: [
      { key: "name", label: "Name" },
      { key: "location", label: "From" },
      { key: "isDemo", label: "Demo", kind: "bool" },
      { key: "status", label: "Status", kind: "status" },
    ],
    searchFields: ["name", "quote", "tripName"],
    defaultSort: { order: 1, createdAt: -1 },
    defaults: { name: "", location: "", quote: "", rating: 5, tripName: "", isDemo: false, status: "draft", order: 0 },
    tabs: [
      {
        label: "Testimonial",
        fields: [
          { name: "name", label: "Guest name", type: "text", required: true },
          { name: "location", label: "Guest location", type: "text" },
          { name: "quote", label: "Quote", type: "textarea", required: true, wide: true },
          { name: "tripName", label: "Trip", type: "text" },
          { name: "rating", label: "Rating (1–5)", type: "number" },
          { name: "isDemo", label: "Demo content — replace with a genuine review before launch", type: "checkbox", wide: true },
          statusField,
          { name: "order", label: "Sort order", type: "number" },
        ],
      },
    ],
  },

  faqs: {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    titleField: "question",
    hasSlug: false,
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status", kind: "status" },
      { key: "order", label: "Order" },
    ],
    searchFields: ["question", "answer", "category"],
    defaultSort: { category: 1, order: 1 },
    defaults: { question: "", answer: "", category: "General", status: "draft", order: 0 },
    tabs: [
      {
        label: "FAQ",
        fields: [
          { name: "question", label: "Question", type: "text", required: true, wide: true },
          { name: "answer", label: "Answer", type: "markdown", required: true, wide: true },
          { name: "category", label: "Category", type: "select", options: ["General", "Planning", "Practical", "Tours"].map((c) => ({ value: c, label: c })) },
          statusField,
          { name: "order", label: "Sort order", type: "number" },
        ],
      },
    ],
  },
};

export function isResourceKey(k: string): k is ResourceKey {
  return k in RESOURCES;
}
