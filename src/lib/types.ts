/** Plain (serialized) content types shared by server and client code. */

export type Status = "draft" | "published";

export interface MediaRef {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt: string;
  caption?: string;
}

export interface Seo {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: MediaRef | null;
  noindex?: boolean;
}

export interface ItineraryDay { title: string; description: string; overnight?: string; meals?: string }
export interface FaqItem { question: string; answer: string }
export interface TitledText { title: string; description: string }
export interface LinkItem { label: string; href: string }

interface Base {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RefLite { _id: string; slug: string; title?: string; name?: string }

export interface Tour extends Base {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: Status;
  featured: boolean;
  category: string;
  experiences: string[];
  priceFrom?: number;
  currency: string;
  durationDays: number;
  duration: string;
  groupSize?: string;
  difficulty?: "easy" | "moderate" | "challenging";
  meetingPoint?: string;
  destinations: string[];
  heroImage?: MediaRef | null;
  gallery: MediaRef[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  highlights: string[];
  faq: FaqItem[];
  relatedTours: string[];
  structuredData: { touristTrip: boolean; faqPage: boolean };
  order: number;
  seo: Seo;
}

export interface Destination extends Base {
  name: string;
  slug: string;
  region?: string;
  shortDescription: string;
  description: string;
  status: Status;
  featured: boolean;
  heroImage?: MediaRef | null;
  gallery: MediaRef[];
  thingsToDo: TitledText[];
  bestTimeToVisit: string;
  howToGetThere: string;
  travelTips: string[];
  relatedTours: string[];
  order: number;
  seo: Seo;
}

export interface Service extends Base {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: Status;
  image?: MediaRef | null;
  benefits: string[];
  cta: LinkItem;
  order: number;
  seo: Seo;
}

export interface BlogPost extends Base {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: MediaRef | null;
  author: string;
  category: string;
  tags: string[];
  publishedAt?: string;
  status: Status;
  featured: boolean;
  relatedPosts: string[];
  relatedTours: string[];
  relatedDestinations: string[];
  seo: Seo;
}

export interface Testimonial extends Base {
  name: string;
  location?: string;
  quote: string;
  rating?: number;
  tripName?: string;
  isDemo: boolean;
  status: Status;
  order: number;
}

export interface Faq extends Base {
  question: string;
  answer: string;
  category: string;
  status: Status;
  order: number;
}

export interface PageSection {
  _key: string;
  type: SectionType;
  enabled: boolean;
  data: Record<string, unknown>;
}

export type SectionType =
  | "hero"
  | "intro"
  | "featuredTours"
  | "destinations"
  | "services"
  | "features"
  | "testimonials"
  | "posts"
  | "cta"
  | "faq"
  | "imageText"
  | "inquiryForm"
  | "contactForm"
  | "listing";

export interface Page extends Base {
  title: string;
  slug: string;
  kind: "system" | "custom" | "legal";
  status: Status;
  sections: PageSection[];
  seo: Seo;
}

export interface SiteSettings {
  companyName: string;
  tagline?: string;
  logo?: MediaRef | null;
  favicon?: MediaRef | null;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  googleMapsUrl?: string;
  businessHours?: string;
  socialLinks: LinkItem[];
  navigation: LinkItem[];
  headerCta: LinkItem;
  footerDescription?: string;
  footerColumns: { title: string; links: LinkItem[] }[];
  legalLinks: LinkItem[];
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImage?: MediaRef | null;
  gaId?: string;
  plausibleDomain?: string;
  inquiryOptions: { destinations: string[]; experiences: string[]; interests: string[] };
}

export const INQUIRY_STATUSES = ["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED", "ARCHIVED"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface Inquiry extends Base {
  type: "trip" | "contact";
  name: string;
  email: string;
  phone?: string;
  country?: string;
  arrivalDate?: string;
  departureDate?: string;
  travelers?: number;
  destinations: string[];
  experiences: string[];
  interests: string[];
  accommodationNeeded?: boolean;
  airportTransferNeeded?: boolean;
  subject?: string;
  message: string;
  sourcePath?: string;
  status: InquiryStatus;
  contactedAt?: string;
  notes: { _id: string; body: string; author: string; createdAt: string }[];
}

export interface MediaItem extends Base {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format?: string;
  bytes?: number;
  alt: string;
  caption?: string;
}
