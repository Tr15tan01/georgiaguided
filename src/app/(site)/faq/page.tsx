import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("faq", "Frequently asked questions");
}

export default function FaqPage() {
  return <CmsPage slug="faq" fallbackTitle="Frequently asked questions" />;
}
