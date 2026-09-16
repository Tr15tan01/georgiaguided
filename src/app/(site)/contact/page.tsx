import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("contact", "Contact");
}

export default function ContactPage() {
  return <CmsPage slug="contact" fallbackTitle="Contact" />;
}
