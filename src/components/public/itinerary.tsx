import { ChevronDown } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

export function Itinerary({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="relative border-l border-line pl-8">
      {days.map((d, i) => (
        <li key={`${i}-${d.title}`} className="relative pb-2">
          <span aria-hidden className="absolute -left-[2.35rem] top-6 flex size-3 items-center justify-center rounded-full border-2 border-accent bg-paper" />
          <details className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-sm text-ink-soft">{days.length > 1 ? `Stage ${i + 1}` : "Route"}</span>
                <span className="font-display text-2xl">{d.title}</span>
              </span>
              <ChevronDown aria-hidden className="mt-6 size-5 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pb-6 text-ink-soft">
              <p className="whitespace-pre-line leading-relaxed">{d.description}</p>
              {(d.meals || d.overnight) && (
                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                  {d.meals && (<div className="flex gap-2"><dt className="font-medium text-ink">Meals</dt><dd>{d.meals}</dd></div>)}
                  {d.overnight && (<div className="flex gap-2"><dt className="font-medium text-ink">Overnight</dt><dd>{d.overnight}</dd></div>)}
                </dl>
              )}
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
