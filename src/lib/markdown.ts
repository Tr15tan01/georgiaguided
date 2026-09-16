import "server-only";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify } from "./utils";

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = text.replace(/<[^>]+>/g, "");
      return `<h${depth} id="${slugify(plain)}">${text}</h${depth}>`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href) && !href.startsWith(process.env.NEXT_PUBLIC_SITE_URL ?? "__none__");
      const t = title ? ` title="${title}"` : "";
      return external
        ? `<a href="${href}"${t} rel="noopener noreferrer" target="_blank">${text}</a>`
        : `<a href="${href}"${t}>${text}</a>`;
    },
  },
});

const allowed: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr", "strong", "em", "b", "i", "u", "s", "blockquote",
    "ul", "ol", "li", "a", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "img", "figure", "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    h2: ["id"], h3: ["id"], h4: ["id"],
    th: ["align"], td: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] },
  transformTags: {
    h1: "h2",
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
  },
};

/** Render CMS markdown to sanitized HTML. Safe against script/attribute injection. */
export function renderMarkdown(md: string | undefined | null): string {
  if (!md) return "";
  const html = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(html, allowed);
}

/** Extract h2 headings for a table of contents. */
export function extractHeadings(md: string | undefined | null): { id: string; text: string }[] {
  if (!md) return [];
  return [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`[\]]/g, "").replace(/\(.*?\)/g, "").trim();
    return { id: slugify(text), text };
  });
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
