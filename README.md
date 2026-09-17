# GeorgiaGuided

A premium travel website and content management system for a company that brings international visitors to Georgia (the country). Visitors browse tours, destinations, services and the journal, then send a trip inquiry. The team manages everything from `/admin`.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · MongoDB + Mongoose · Auth.js v5 (admin only) · Cloudinary · Resend · Zod · Lucide.

---

## Quick start

Requirements: **Node.js 22.12 or newer** and a **MongoDB** database (MongoDB Atlas free tier is fine).

> On Vercel, set the Node.js version to **22.x** under Settings → General → Node.js Version. Older versions cannot load some of the ESM-only dependencies and every admin action fails with a 500. A `.nvmrc` file is included for local use.

```bash
npm install
cp .env.example .env.local      # then fill in the values (see below)
npm run db:seed                 # sample content + the first admin account
npm run dev                     # http://localhost:3000
```

Sign in at **http://localhost:3000/admin** with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript check |
| `npm run db:seed` | Adds any missing sample content and the admin account. **Never overwrites** existing documents, so it is safe on a live database. |
| `npm run db:seed:reset` | Restores all seeded documents to their original content (overwrites edits to those items). |
| `npm run admin:create` | Creates the admin from env vars if missing. Add `-- --reset-password` to reset the password. |

---

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | **Yes** (also at build time) | Connection string. Use a database user limited to this database. |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Public origin without trailing slash, e.g. `https://georgiaguided.com`. Used for canonical URLs, sitemap, Open Graph and email links. |
| `AUTH_SECRET` | **Yes** | `npx auth secret` or `openssl rand -base64 33`. |
| `AUTH_TRUST_HOST` | Outside Vercel | `true` when running behind your own proxy. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | For seeding | Password must be at least 12 characters. Remove from the environment after the first login if you prefer. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For uploads | Without them the site works, but uploads in the media library are disabled. |
| `CLOUDINARY_FOLDER` | No | Upload folder (default `georgiaguided`). |
| `RESEND_API_KEY` | For email | Without it, inquiries are still saved; emails are skipped and a warning is logged. |
| `EMAIL_FROM` | For email | A sender on a domain verified in Resend. |
| `CONTACT_EMAIL` | For email | Inbox for new-inquiry notifications (falls back to the email in Admin → Settings). |
| `NEXT_PUBLIC_GA_ID` | No | GA4 ID. Can also be set in Admin → Settings. |
| `RATE_LIMIT_SALT` | Recommended | Random string used when hashing visitor IPs. |

---

## Deploying to Vercel

1. Push the project to GitHub and import it in Vercel (framework preset: Next.js).
2. Add all environment variables above for **Production** (and Preview if used). `MONGODB_URI` must be available **during the build**, because public pages are pre-rendered from the database and refreshed every 5 minutes (and immediately after admin edits).
3. Set **Node.js Version** to 22.x in Settings → General.
4. In MongoDB Atlas → Network Access, allow Vercel to connect (Vercel's IP ranges, or `0.0.0.0/0` combined with a strong, database-scoped user).
5. Run the seed once against the production database from your machine:
   `MONGODB_URI="…" ADMIN_EMAIL="…" ADMIN_PASSWORD="…" npm run db:seed`
6. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy after adding the domain.
7. In Resend, verify your sending domain and set `EMAIL_FROM`.

The app runs on the Node.js runtime throughout (including `src/proxy.ts`, the Next 16 replacement for middleware).

---

## Before launch — checklist

- [ ] **Admin → Settings:** replace the placeholder email, phone, WhatsApp and address; set social links.
- [ ] **Admin → Media:** upload real photography and replace the illustrated seed images (they are placeholders in `public/seed/`). Write alt text for every image.
- [ ] **Admin → Testimonials:** the four seeded testimonials are **demo content** (marked "Demo"). Replace them with genuine reviews or unpublish them.
- [ ] **Admin → Pages → Legal pages:** the privacy, terms and cookie pages are templates. Have them reviewed by a qualified lawyer and fill in the bracketed details.
- [ ] **Admin → Pages → About us:** replace the placeholder company story.
- [ ] Review tour prices, durations and inclusions.
- [ ] Journal articles contain travel facts (for example visa rules and seasons) that can change — review them before publishing and periodically afterwards.
- [ ] Set up Resend and Cloudinary; submit a test inquiry and check both emails arrive.
- [ ] Add analytics (and a consent banner if your audience requires one).
- [ ] Submit `https://your-domain/sitemap.xml` to Google Search Console.

---

## How it works

### Public site (`src/app/(site)`)
- Pages: `/`, `/tours`, `/tours/[slug]`, `/destinations`, `/destinations/[slug]`, `/services`, `/services/[slug]`, `/blog`, `/blog/[slug]`, `/about`, `/why-georgia`, `/faq`, `/contact`, `/plan-your-trip`, and any custom or legal page at `/[slug]`.
- **Every page is built from CMS sections** (hero, text, tours, destinations, services, feature list, testimonials, articles, call to action, FAQ, image and text, forms, listing position). Sections can be added, reordered and hidden in Admin → Pages.
- Content is cached with incremental static regeneration (5 minutes). Saving anything in the admin refreshes the public site immediately.
- **Draft preview:** the Preview button in the editor opens unpublished content (admins only).
- **Light and dark themes** follow the system setting and can be toggled; the choice is remembered without a flash on load.
- Motion respects `prefers-reduced-motion`.

### Inquiries
- The trip form (`/plan-your-trip`) and contact form save to MongoDB, notify the team by email (with a link to the inquiry in the admin) and send the visitor a confirmation.
- Links such as `/plan-your-trip?tour=kakheti-wine-region-tour` prefill the message.
- **Spam protection:** hidden honeypot field, minimum fill time, and per-IP rate limiting (5 per hour) stored in MongoDB with hashed IPs. Validation runs with Zod on the server.
- In the admin, inquiries move through **New → Contacted → Quoted → Confirmed → Completed → Cancelled → Archived**, with internal notes that are never shown publicly.

### Admin (`/admin`)
- Dashboard with content counts, new inquiries and recent activity.
- Tours, Destinations, Services, Journal, Testimonials and FAQs share one tabbed editor (Basic information, Media, Description, Itinerary, What's included, FAQ, Related content, SEO, Publishing) with drag-and-drop ordering, a Markdown editor with live preview, reference pickers and an SEO panel with a search preview.
- Pages: section builder for the homepage and every other page.
- Media library (Cloudinary): upload, search, alt text, usage count; images in use cannot be deleted.
- Settings: company details, navigation, footer, default SEO, analytics, inquiry form choices.
- **Diagnostics** (`/admin/diagnostics`): one click checks that the server can read your session, reach the database and see its configuration. Start here whenever something in the admin misbehaves — admin actions report readable errors rather than a generic 500.
- **Security:** Auth.js credentials with bcrypt hashes and 8-hour sessions; every admin page and server action checks the session; failed sign-ins are rate-limited (8 per 15 minutes per IP); `/admin` is `noindex`; security headers are set in `next.config.ts`; Markdown is sanitised before rendering; server actions carry Next.js' built-in CSRF protection.

### SEO
- Per-page title, description, canonical URL, Open Graph and Twitter tags (editable per item; sensible fallbacks). When an item has no raster image, the generated `/opengraph-image` card is used.
- JSON-LD: TravelAgency and WebSite on every page; TouristTrip, TouristDestination, Service, Article, FAQPage and BreadcrumbList where relevant.
- `/sitemap.xml` (published content only) and `/robots.txt`.
- Internal linking: articles link to destinations and tours; tours link to destinations, related tours, related articles and the inquiry form.

---

## Project structure

```
scripts/            seed.ts, create-admin.ts, seed/ (content + artwork generator)
public/seed/        generated placeholder illustrations
src/
  app/(site)/       public routes
  app/admin/        admin routes (login + (panel) group)
  app/api/          Auth.js handler, draft preview
  actions/          server actions (inquiries, admin content, media, auth)
  admin/            field/section definitions that drive the editors
  components/       public/ and admin/ UI
  data/public.ts    cached public queries
  fonts/            self-hosted fonts (SIL Open Font License)
  lib/              db, auth guard, validation, SEO, JSON-LD, email, Cloudinary, rate limiting
  models/           Mongoose models
  auth.ts, auth.config.ts, proxy.ts
```

### Adding a field to a content type
1. Add it to the Mongoose schema in `src/models/index.ts`.
2. Add it to the Zod schema in `src/lib/validation.ts`.
3. Add it to the type in `src/lib/types.ts`.
4. Add it to a tab in `src/admin/resources.ts` — the editor renders it automatically.
5. Use it in the relevant public page.

---

## Notes

- **Bundling:** only `mongoose` is listed in `serverExternalPackages`. `sanitize-html` must stay bundled, because its `htmlparser2` dependency is ESM-only and cannot be `require()`d at runtime on older Node versions.
- Fonts (Cormorant Garamond, Instrument Sans) are bundled in `src/fonts`, so builds don't need network access to Google Fonts.
- The seed uses local SVG illustrations so the site looks complete without Cloudinary. Uploaded Cloudinary images are optimised automatically by `next/image`.
