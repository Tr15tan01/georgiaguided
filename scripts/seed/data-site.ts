import type { SeedImageKey } from "./types";

type MediaRef = { url: string; publicId: string; width: number; height: number; alt: string };
export interface Helpers {
  img: (key: SeedImageKey) => MediaRef;
  tourIds: (slugs: string[]) => string[];
  destIds: (slugs: string[]) => string[];
  postIds: (slugs: string[]) => string[];
}

let k = 0;
const sec = (type: string, data: Record<string, unknown>, enabled = true) => ({ _key: `s${(++k).toString(36)}`, type, enabled, data });

export const settings = (h: Helpers) => ({
  companyName: "GeorgiaGuided",
  tagline: "Private journeys through Georgia",
  // Placeholder contact details — replace in Admin → Settings before launch.
  email: "hello@georgiaguided.com",
  phone: "+995 500 00 00 00",
  whatsapp: "+995500000000",
  address: "Tbilisi, Georgia (placeholder address — update in Admin → Settings)",
  googleMapsUrl: "https://maps.google.com/?q=Tbilisi,Georgia",
  businessHours: "Monday–Saturday, 9:00–19:00 (GMT+4)",
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
  ],
  navigation: [
    { label: "Why Georgia", href: "/why-georgia" },
    { label: "Tours", href: "/tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "Services", href: "/services" },
    { label: "Journal", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  headerCta: { label: "Plan your trip", href: "/plan-your-trip" },
  footerDescription: "Private tours, drivers and tailor-made journeys through Georgia, planned by people who live here.",
  footerColumns: [
    {
      title: "Explore",
      links: [
        { label: "All tours", href: "/tours" },
        { label: "Destinations", href: "/destinations" },
        { label: "Why Georgia", href: "/why-georgia" },
        { label: "Journal", href: "/blog" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Airport transfer", href: "/services/airport-transfer" },
        { label: "Private driver", href: "/services/private-driver" },
        { label: "Private guide", href: "/services/private-guide" },
        { label: "Custom trips", href: "/services/custom-trips" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
        { label: "Plan your trip", href: "/plan-your-trip" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms and conditions", href: "/terms-and-conditions" },
    { label: "Cookie policy", href: "/cookie-policy" },
  ],
  defaultSeoTitle: "GeorgiaGuided — Private Tours and Tailor-Made Trips in Georgia",
  defaultSeoDescription: "Private tours, drivers and custom itineraries in Georgia: Tbilisi, Kazbegi, Kakheti wine country, Svaneti and the Black Sea — planned by local experts.",
  defaultOgImage: h.img("heroHome"),
  gaId: "",
  plausibleDomain: "",
  inquiryOptions: {
    destinations: [],
    experiences: ["Mountains", "Wine", "Food", "Culture", "History", "Adventure", "Relaxation", "Beach", "Skiing", "Photography"],
    interests: ["Private guide", "Private driver", "Wine tastings", "Cooking class", "Hiking", "Luxury hotels"],
  },
});

const hero = (h: Helpers, heading: string, subtitle: string, image: SeedImageKey, compact = true, cta?: { label: string; href: string }) =>
  sec("hero", { heading, subtitle, image: h.img(image), compact, ...(cta ? { cta } : {}) });

const closingCta = (h: Helpers, image: SeedImageKey = "road") =>
  sec("cta", {
    heading: "Your Georgia, planned around you",
    body: "Tell us your dates and what you love. We'll reply within one working day with ideas, not a sales script.",
    image: h.img(image),
    cta: { label: "Plan your trip", href: "/plan-your-trip" },
  });

export const pages = (h: Helpers) => [
  {
    slug: "home",
    title: "Home",
    kind: "system",
    seo: {
      title: "GeorgiaGuided — Private Tours and Tailor-Made Trips in Georgia",
      description: "Discover Georgia with private tours, drivers and custom itineraries: Tbilisi, Kazbegi, Kakheti wine country, Svaneti and the Black Sea coast.",
    },
    sections: [
      sec("hero", {
        heading: "Georgia, beautifully guided",
        subtitle: "Private journeys through the Caucasus — ancient monasteries, glacier views, qvevri wine and tables that never seem to empty.",
        image: h.img("heroHome"),
        cta: { label: "Plan your trip", href: "/plan-your-trip" },
        secondaryCta: { label: "Explore tours", href: "/tours" },
        compact: false,
      }),
      sec("intro", {
        heading: "A small country with a very long story",
        body: "Georgia sits where Europe meets Asia, between the Black Sea and the Caspian. In a single week you can walk the lanes of an ancient capital, stand beneath 5,000-metre peaks and share wine made the way it has been for eight thousand years.\n\nWe are a local team who plan **private, unhurried travel** for guests from the US, UK and Europe — with thoughtful guides, comfortable hotels and every detail handled.",
      }),
      sec("featuredTours", {
        heading: "Tours our guests love",
        intro: "Every tour is private and can start on the date that suits you.",
        items: h.tourIds(["georgia-highlights-7-days", "mtskheta-and-kazbegi-day-trip", "kakheti-wine-region-tour", "svaneti-mountain-adventure", "tbilisi-old-town-walking-tour", "borjomi-and-vardzia-tour"]),
        link: { label: "See all tours", href: "/tours" },
      }),
      sec("destinations", {
        heading: "Where to go",
        intro: "From the capital to the high Caucasus and the Black Sea coast.",
        items: h.destIds(["kazbegi", "tbilisi", "kakheti", "svaneti", "batumi"]),
        link: { label: "All destinations", href: "/destinations" },
      }),
      sec("features", {
        heading: "Why Georgia",
        intro: "Few places pack so much into so little space.",
        image: h.img("kazbegi"),
        items: [
          { title: "The cradle of wine", description: "An 8,000-year winemaking tradition and a UNESCO-listed qvevri method." },
          { title: "The high Caucasus", description: "Glaciers, alpine meadows and medieval towers within a day of the capital." },
          { title: "Ancient faith and art", description: "Monasteries, frescoes and a unique alphabet shaped over sixteen centuries." },
          { title: "Legendary hospitality", description: "Here, a guest is considered a gift — and treated like one." },
        ],
      }),
      sec("services", {
        heading: "Travel, taken care of",
        intro: "Book a single transfer or let us plan every day of your journey.",
        items: [],
        link: { label: "All services", href: "/services" },
      }),
      sec("features", {
        heading: "Why travel with GeorgiaGuided",
        items: [
          { title: "Local, not outsourced", description: "Our team lives in Georgia and personally knows every guide, driver and host we work with." },
          { title: "Private by design", description: "No crowded coaches — just your party, at your pace." },
          { title: "Honest advice", description: "We'll tell you when a road is closed, a hotel isn't right, or a day is too long." },
          { title: "Support on the ground", description: "A real person is available throughout your trip, not a call centre." },
        ],
      }),
      sec("testimonials", { heading: "What travelers say", items: [] }),
      sec("posts", {
        heading: "From the journal",
        intro: "Practical guides and stories to help you plan.",
        items: h.postIds(["best-time-to-visit-georgia", "georgian-wine-guide", "georgia-7-day-itinerary"]),
        link: { label: "Read the journal", href: "/blog" },
      }),
      closingCta(h, "road"),
    ],
  },
  {
    slug: "about",
    title: "About us",
    kind: "system",
    seo: { title: "About GeorgiaGuided — Local Travel Specialists", description: "Meet GeorgiaGuided, a local team planning private tours and tailor-made trips in Georgia for travelers from the US, UK and Europe." },
    sections: [
      hero(h, "About GeorgiaGuided", "A local team helping travelers discover Georgia the way we love it.", "mtskheta"),
      sec("intro", {
        heading: "Who we are",
        body: "GeorgiaGuided was founded by people who grew up between Tbilisi's courtyards and the mountain villages of their grandparents. We kept meeting visitors who had fallen in love with Georgia but found it hard to plan — and decided to help.\n\nToday we design private tours and tailor-made journeys for travelers from the United States, the United Kingdom and across Europe. We work with a small, trusted circle of guides, drivers, winemakers and hosts, and we visit every place we recommend.\n\n*This text is placeholder content. Replace it with your own story in Admin → Pages → About us.*",
      }),
      sec("imageText", {
        heading: "How we work",
        body: "- **We listen first.** Every trip starts with a conversation about what you enjoy.\n- **We plan in detail.** Realistic driving times, hand-picked hotels, and room to breathe.\n- **We stay close.** Our team is available throughout your trip.\n- **We travel responsibly.** We work with family-run businesses and pay fairly.",
        image: h.img("kakheti"),
        imageRight: true,
        cta: { label: "Meet us — plan a trip", href: "/plan-your-trip" },
      }),
      sec("features", {
        heading: "What we value",
        items: [
          { title: "Warmth", description: "Georgian hospitality, from the first email to the airport goodbye." },
          { title: "Honesty", description: "Clear prices and straight answers." },
          { title: "Care", description: "Safety, comfort and the small details that make a trip." },
          { title: "Respect", description: "For local communities, traditions and landscapes." },
        ],
      }),
      sec("testimonials", { heading: "Kind words from our guests", items: [] }),
      closingCta(h, "highlands"),
    ],
  },
  {
    slug: "why-georgia",
    title: "Why visit Georgia",
    kind: "system",
    seo: { title: "Why Visit Georgia? 8 Reasons to Go Now", description: "Wine, mountains, history, food and hospitality — discover why Georgia is one of the most rewarding destinations for travelers from the US and Europe." },
    sections: [
      hero(h, "Why Georgia?", "Mountains, monasteries, wine and a welcome you won't forget.", "highlands"),
      sec("intro", {
        heading: "Europe's best-kept secret, hiding in plain sight",
        body: "Georgia is about the size of Ireland, yet it holds snowy peaks above 5,000 metres, subtropical beaches, semi-desert monasteries and some of the oldest vineyards on earth. Its cities are lively and creative, its villages timeless — and it's easy to reach from Europe.",
      }),
      sec("features", {
        heading: "Eight reasons to go",
        items: [
          { title: "Wine with 8,000 years of history", description: "Taste amber wines from buried clay qvevri in Kakheti." },
          { title: "Dramatic mountains", description: "Kazbegi and Svaneti offer some of the most accessible high-mountain scenery anywhere." },
          { title: "A cuisine all its own", description: "Khachapuri, khinkali, walnuts, herbs and fresh bread." },
          { title: "Living history", description: "Cave cities, fortresses and UNESCO-listed monasteries." },
          { title: "Tbilisi", description: "Sulfur baths, carved balconies and a thriving arts scene." },
          { title: "The Black Sea", description: "Batumi's promenades and green Adjarian hills." },
          { title: "Great value", description: "High-quality travel at prices that compare well to Western Europe." },
          { title: "Hospitality", description: "A guest is a gift — and Georgians mean it." },
        ],
      }),
      sec("imageText", {
        heading: "Easy to reach, easy to love",
        body: "Direct flights connect Tbilisi and Kutaisi with many European cities, and travelers from the US connect easily via major hubs. Citizens of the US, UK and EU can currently visit without a visa for up to a year — always check the latest official guidance before you travel.\n\nRead our [first-timer's guide](/blog/georgia-travel-guide-first-time) for everything you need to know.",
        image: h.img("tbilisi"),
        imageRight: false,
      }),
      sec("destinations", { heading: "Start with these places", items: [], link: { label: "All destinations", href: "/destinations" } }),
      sec("faq", { heading: "Planning questions", category: "Planning", limit: 4 }),
      closingCta(h, "kazbegi"),
    ],
  },
  {
    slug: "tours",
    title: "Private tours in Georgia",
    kind: "system",
    seo: { title: "Private Tours in Georgia — Day Trips and Multi-Day Journeys", description: "Browse private tours in Georgia: Tbilisi walks, Kazbegi and Kakheti day trips, Svaneti adventures and week-long itineraries." },
    sections: [
      hero(h, "Private tours in Georgia", "Day trips and multi-day journeys, always private and always flexible.", "road"),
      sec("listing", {}),
      closingCta(h, "heroHome"),
    ],
  },
  {
    slug: "destinations",
    title: "Destinations in Georgia",
    kind: "system",
    seo: { title: "Georgia Destinations — Where to Go", description: "Explore Georgia's top destinations: Tbilisi, Kazbegi, Kakheti, Svaneti, Mtskheta, Kutaisi, Borjomi and Batumi." },
    sections: [
      hero(h, "Where to go in Georgia", "From the capital to the high Caucasus and the Black Sea.", "svaneti"),
      sec("listing", {}),
      closingCta(h, "kakheti"),
    ],
  },
  {
    slug: "services",
    title: "Travel services in Georgia",
    kind: "system",
    seo: { title: "Travel Services in Georgia — Transfers, Drivers, Guides", description: "Airport transfers, private drivers, local guides, hotel assistance and custom trips across Georgia." },
    sections: [
      hero(h, "Travel services", "Everything you need for a smooth trip — book one service or let us plan it all.", "service"),
      sec("listing", {}),
      sec("faq", { heading: "Questions about our services", category: "Tours", limit: 0 }),
      closingCta(h, "road"),
    ],
  },
  {
    slug: "blog",
    title: "Georgia travel journal",
    kind: "system",
    seo: { title: "Georgia Travel Journal — Guides and Tips", description: "Practical guides to Georgia: when to go, what to eat, Georgian wine, Kazbegi, Svaneti, itineraries and travel tips." },
    sections: [
      hero(h, "The journal", "Guides, stories and practical advice for travel in Georgia.", "fortress"),
      sec("listing", {}),
    ],
  },
  {
    slug: "faq",
    title: "Frequently asked questions",
    kind: "system",
    seo: { title: "Georgia Travel FAQ", description: "Answers to common questions about travel to Georgia: visas, the best time to visit, safety, money and how our private tours work." },
    sections: [
      hero(h, "Questions, answered", "Everything travelers usually ask us before a trip to Georgia.", "mtskheta"),
      sec("faq", { heading: "Frequently asked questions", category: "", limit: 0 }),
      closingCta(h, "highlands"),
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    kind: "system",
    seo: { title: "Contact GeorgiaGuided", description: "Get in touch with GeorgiaGuided by email, phone or WhatsApp, or send us a message." },
    sections: [
      hero(h, "Get in touch", "We usually reply within one working day.", "tbilisi"),
      sec("contactForm", { heading: "Send us a message", intro: "Questions about Georgia or our services? Write to us — a real person will answer." }),
    ],
  },
  {
    slug: "plan-your-trip",
    title: "Plan your trip",
    kind: "system",
    seo: { title: "Plan Your Trip to Georgia — Free Custom Itinerary", description: "Tell us your dates and interests and receive a tailor-made Georgia itinerary with private guides, drivers and hand-picked hotels." },
    sections: [
      hero(h, "Plan your trip", "Share a few details and we'll design a journey around you — no obligation.", "heroHome"),
      sec("inquiryForm", {
        heading: "Tell us about your trip",
        intro: "The more you share, the better our first proposal will be. We'll reply within one working day. There's no payment on this website.",
      }),
      sec("features", {
        heading: "What happens next",
        items: [
          { title: "1. We read your request", description: "A member of our team — not a bot — reviews every inquiry." },
          { title: "2. We send ideas", description: "A first itinerary and price, usually within two working days." },
          { title: "3. We refine together", description: "Adjust anything until it feels right." },
          { title: "4. You travel", description: "With local support throughout your trip." },
        ],
      }),
    ],
  },
  ...legalPages(h),
];

const legalNote = "> **Template notice:** this page is a starting point only and must be reviewed by a qualified legal professional before the website goes live. Replace all bracketed details.";

function legalPages(h: Helpers) {
  void h;
  return [
    {
      slug: "privacy-policy",
      title: "Privacy policy",
      kind: "legal",
      seo: { title: "Privacy Policy", description: "How GeorgiaGuided collects, uses and protects personal data." },
      sections: [
        sec("intro", {
          heading: "Privacy policy",
          body: `${legalNote}

## Who we are

GeorgiaGuided ("we", "us") is [legal company name], registered at [address]. You can contact us about privacy at [privacy email].

## What we collect

When you use our inquiry or contact forms, we collect the information you provide: your name, email address, phone number, country, travel dates, number of travelers, preferences and your message. We also record the page you sent the form from and a one-way hashed version of your IP address to prevent spam and abuse.

If you consent to analytics cookies, our analytics provider collects anonymous usage data such as pages visited and device type.

## How we use it

- To reply to your inquiry and prepare travel proposals.
- To arrange services you book with us.
- To protect our website from spam and misuse.
- To understand how our website is used and improve it (analytics).

We do not sell your personal data.

## Legal basis (EU/UK visitors)

We process inquiry data to take steps at your request before entering into a contract, and based on our legitimate interest in running a secure website. Analytics is based on your consent.

## Sharing

We share data only with service providers who help us operate — for example our hosting, database, email and image-hosting providers — and, when you book, with the guides, drivers and hotels needed to deliver your trip.

## International transfers

Some providers may process data outside your country. Where required, we rely on appropriate safeguards such as standard contractual clauses.

## Retention

We keep inquiry data for [period] after our last contact, unless you book with us, in which case we keep records as required by law.

## Your rights

Depending on where you live, you may have the right to access, correct, delete or restrict the use of your data, to object to processing and to data portability. Contact us at [privacy email]. You may also complain to your local data protection authority.

## Changes

We may update this policy. The date at the bottom shows the latest version.`,
        }),
      ],
    },
    {
      slug: "terms-and-conditions",
      title: "Terms and conditions",
      kind: "legal",
      seo: { title: "Terms and Conditions", description: "Terms for using the GeorgiaGuided website and booking our services." },
      sections: [
        sec("intro", {
          heading: "Terms and conditions",
          body: `${legalNote}

## About these terms

These terms apply to your use of this website. Separate booking conditions, sent with every confirmed itinerary, govern the travel services you book with us.

## Information on this website

We take care to keep information accurate, but tour descriptions, prices and availability are indicative and may change. Prices are shown as "from" prices and are confirmed in your personal proposal.

## Inquiries

Sending an inquiry does not create a booking or any obligation. No payment is taken on this website. A booking is confirmed only when you accept our written proposal and complete the steps described in it.

## Travel documents and insurance

You are responsible for holding valid passports, any visas and adequate travel insurance.

## Liability

Nothing in these terms excludes liability that cannot be excluded by law. We are not responsible for losses caused by events beyond our reasonable control.

## Intellectual property

Content on this website belongs to [company name] or its licensors and may not be reused without permission.

## Governing law

These terms are governed by the laws of [jurisdiction].

## Contact

[Company name], [address], [email].`,
        }),
      ],
    },
    {
      slug: "cookie-policy",
      title: "Cookie policy",
      kind: "legal",
      seo: { title: "Cookie Policy", description: "How GeorgiaGuided uses cookies and similar technologies." },
      sections: [
        sec("intro", {
          heading: "Cookie policy",
          body: `${legalNote}

## What are cookies?

Cookies are small text files stored on your device when you visit a website.

## Cookies we use

- **Essential:** remember your light or dark theme preference (stored in your browser's local storage) and keep the website secure. These do not track you.
- **Analytics (optional):** if enabled, our analytics provider may set cookies to measure how the website is used.

Visitors do not need an account, so we do not use login cookies on the public website.

## Managing cookies

You can block or delete cookies in your browser settings. [Describe your consent banner here if you use one.]

## Contact

Questions? Email [privacy email].`,
        }),
      ],
    },
  ];
}
