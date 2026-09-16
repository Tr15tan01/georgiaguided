import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, className, light }: { items: { name: string; href: string }[]; className?: string; light?: boolean }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm", light ? "text-white/80" : "text-ink-soft", className)}>
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight aria-hidden className="size-3.5 opacity-60" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className={light ? "text-white" : "text-ink"}>{it.name}</span>
              ) : (
                <Link href={it.href} className="link-underline">{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}
