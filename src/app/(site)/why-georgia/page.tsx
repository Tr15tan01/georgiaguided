import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("why-georgia", "Why Georgia");
}

export default function WhyGeorgiaPage() {
  return <CmsPage slug="why-georgia" fallbackTitle="Why Georgia" />;
}
