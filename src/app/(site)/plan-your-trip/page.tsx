import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("plan-your-trip", "Plan your trip");
}

export default function PlanYourTripPage() {
  return <CmsPage slug="plan-your-trip" fallbackTitle="Plan your trip" />;
}
