import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("about", "About us");
}

export default function AboutPage() {
  return <CmsPage slug="about" fallbackTitle="About us" />;
}
