import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("home", "Home");
}

export default function HomePage() {
  return <CmsPage slug="home" fallbackTitle="Discover Georgia" requirePage={false} />;
}
