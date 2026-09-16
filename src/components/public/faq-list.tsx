import { Plus } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import type { FaqItem } from "@/lib/types";

/** Native <details> accordion: accessible, works without JS and keeps answers in the HTML for search engines. */
export function FaqList({ items, headingLevel = "h3" }: { items: FaqItem[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="border-b border-line">
      {items.map((f) => (
        <details key={f.question} className="group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
            <H className="font-display text-2xl leading-snug sm:text-[1.7rem]">{f.question}</H>
            <Plus aria-hidden className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <div className="prose prose-gg max-w-3xl pb-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(f.answer) }} />
        </details>
      ))}
    </div>
  );
}
