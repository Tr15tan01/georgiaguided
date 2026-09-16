import Link from "next/link";
import { cn, safeHref } from "@/lib/utils";
import type { LinkItem } from "@/lib/types";

export function SectionHeading({ heading, intro, link, className, as: As = "h2" }: {
  heading?: string; intro?: string; link?: LinkItem | null; className?: string; as?: "h1" | "h2";
}) {
  if (!heading && !intro) return null;
  return (
    <div className={cn("mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-7">
        {heading && <As className="text-4xl sm:text-5xl lg:text-6xl">{heading}</As>}
      </div>
      <div className="md:col-span-5">
        {intro && <p className="max-w-md text-lg text-ink-soft">{intro}</p>}
        {link?.label && (
          <Link href={safeHref(link.href)} className="link-underline mt-4 inline-block font-medium text-accent">
            {link.label}
          </Link>
        )}
      </div>
    </div>
  );
}
