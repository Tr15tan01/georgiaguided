import type { Field } from "./fields";
import type { SectionType } from "@/lib/types";

export const SECTION_DEFS: Record<SectionType, { label: string; description: string; fields: Field[] }> = {
  hero: {
    label: "Hero",
    description: "Large opening image with heading and buttons.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "subtitle", label: "Subtitle", type: "textarea", wide: true },
      { name: "image", label: "Background image", type: "image", wide: true },
      { name: "videoUrl", label: "Background video URL (optional, MP4 over https)", type: "url", wide: true },
      { name: "cta", label: "Primary button", type: "link" },
      { name: "secondaryCta", label: "Secondary button", type: "link" },
      { name: "compact", label: "Compact height (for inner pages)", type: "checkbox" },
    ],
  },
  intro: {
    label: "Text block",
    description: "Heading with rich text.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "body", label: "Body", type: "markdown", wide: true },
    ],
  },
  featuredTours: {
    label: "Tours",
    description: "Hand-picked tours. Leave empty to show featured tours.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
      { name: "items", label: "Tours", type: "refs", resource: "tours", wide: true },
      { name: "link", label: "Link below the tours", type: "link" },
    ],
  },
  destinations: {
    label: "Destinations",
    description: "Hand-picked destinations. Leave empty to show featured ones.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
      { name: "items", label: "Destinations", type: "refs", resource: "destinations", wide: true },
      { name: "link", label: "Link", type: "link" },
    ],
  },
  services: {
    label: "Services",
    description: "Hand-picked services. Leave empty to show all.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
      { name: "items", label: "Services", type: "refs", resource: "services", wide: true },
      { name: "link", label: "Link", type: "link" },
    ],
  },
  features: {
    label: "Feature list",
    description: "Heading with a set of short points — e.g. Why Georgia, Why choose us.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
      { name: "image", label: "Side image (optional)", type: "image", wide: true },
      {
        name: "items", label: "Points", type: "repeater", itemLabel: "point", titleKey: "title", wide: true,
        fields: [
          { name: "title", label: "Title", type: "text", wide: true },
          { name: "description", label: "Description", type: "textarea", wide: true },
        ],
      },
    ],
  },
  testimonials: {
    label: "Testimonials",
    description: "Guest quotes. Leave empty to show all published testimonials.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "items", label: "Testimonials", type: "refs", resource: "testimonials", wide: true },
    ],
  },
  posts: {
    label: "Journal articles",
    description: "Hand-picked articles. Leave empty to show the latest.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
      { name: "items", label: "Articles", type: "refs", resource: "blog", wide: true },
      { name: "link", label: "Link", type: "link" },
    ],
  },
  cta: {
    label: "Call to action",
    description: "Closing band with a button.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "body", label: "Text", type: "textarea", wide: true },
      { name: "image", label: "Background image", type: "image", wide: true },
      { name: "cta", label: "Button", type: "link" },
    ],
  },
  faq: {
    label: "FAQ",
    description: "Questions from the FAQ library.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "category", label: "Only this category (optional)", type: "select", options: [{ value: "", label: "All categories" }, ...["General", "Planning", "Practical", "Tours"].map((c) => ({ value: c, label: c }))] },
      { name: "limit", label: "Maximum questions (0 = all)", type: "number" },
    ],
  },
  imageText: {
    label: "Image and text",
    description: "Photograph beside a block of text.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "body", label: "Body", type: "markdown", wide: true },
      { name: "image", label: "Image", type: "image", wide: true },
      { name: "imageRight", label: "Image on the right", type: "checkbox" },
      { name: "cta", label: "Link", type: "link" },
    ],
  },
  inquiryForm: {
    label: "Trip inquiry form",
    description: "The full plan-your-trip form.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
    ],
  },
  contactForm: {
    label: "Contact form",
    description: "Short general contact form with company details.",
    fields: [
      { name: "heading", label: "Heading", type: "text", wide: true },
      { name: "intro", label: "Intro", type: "textarea", wide: true },
    ],
  },
  listing: {
    label: "Listing position",
    description: "On Tours, Destinations, Services and Journal pages, marks where the list appears.",
    fields: [{ name: "heading", label: "Heading (optional)", type: "text", wide: true }],
  },
};
