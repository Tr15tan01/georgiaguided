import "server-only";
import type { Metadata } from "next";
import { getSettings } from "@/data/public";
import { absoluteUrl } from "./site-url";
import type { MediaRef, Seo } from "./types";

interface BuildArgs {
  title: string;
  description?: string;
  path: string;
  seo?: Seo | null;
  image?: MediaRef | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

function ogUrl(img: MediaRef): string {
  if (img.publicId && img.url.includes("res.cloudinary.com")) {
    return img.url.replace("/upload/", "/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/");
  }
  return absoluteUrl(img.url);
}

/** Single source of truth for page metadata: CMS SEO fields → sensible fallbacks. */
export async function buildMetadata(a: BuildArgs): Promise<Metadata> {
  const settings = await getSettings();
  const title = a.seo?.title || a.title;
  const description = a.seo?.description || a.description || settings.defaultSeoDescription;
  const canonical = a.seo?.canonical || absoluteUrl(a.path);
  const image = a.seo?.ogImage || a.image || settings.defaultOgImage;
  const images = image && !image.url.endsWith(".svg")
    ? [{ url: ogUrl(image), width: 1200, height: 630, alt: image.alt || title }]
    : [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: settings.companyName }];
  const noindex = a.noindex || a.seo?.noindex;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: a.type ?? "website",
      title,
      description,
      url: canonical,
      siteName: settings.companyName,
      locale: "en_US",
      images,
      ...(a.type === "article" ? { publishedTime: a.publishedTime, modifiedTime: a.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}
