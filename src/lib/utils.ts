export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function formatPrice(amount: number | undefined | null, currency = "EUR"): string {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(value: string | Date | undefined | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", opts ?? { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** Only allow internal paths or http(s)/mailto/tel links in CMS-provided hrefs. */
export function safeHref(href: string | undefined | null, fallback = "/"): string {
  if (!href) return fallback;
  const h = href.trim();
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  if (/^(https?:|mailto:|tel:)/i.test(h)) return h;
  if (h.startsWith("#")) return h;
  return fallback;
}
