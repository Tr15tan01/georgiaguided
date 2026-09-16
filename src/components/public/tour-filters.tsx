"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Tour } from "@/lib/types";
import { TourCard } from "./cards";

type Filters = { duration: string; category: string; destination: string; experience: string; price: string };
const EMPTY: Filters = { duration: "", category: "", destination: "", experience: "", price: "" };

const DURATIONS = [
  { value: "day", label: "Day trips", test: (d: number) => d <= 1 },
  { value: "short", label: "2–4 days", test: (d: number) => d >= 2 && d <= 4 },
  { value: "long", label: "5 days or more", test: (d: number) => d >= 5 },
];
const PRICES = [
  { value: "0-150", label: "Under €150", min: 0, max: 150 },
  { value: "150-600", label: "€150 – €600", min: 150, max: 600 },
  { value: "600-1500", label: "€600 – €1,500", min: 600, max: 1500 },
  { value: "1500-", label: "Over €1,500", min: 1500, max: Infinity },
];

export function TourFilters({ tours, destinations }: { tours: Tour[]; destinations: { _id: string; name: string }[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setF({
      duration: p.get("duration") ?? "",
      category: p.get("category") ?? "",
      destination: p.get("destination") ?? "",
      experience: p.get("experience") ?? "",
      price: p.get("price") ?? "",
    });
  }, []);

  function update(key: keyof Filters, value: string) {
    const next = { ...f, [key]: value };
    setF(next);
    const p = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && p.set(k, v));
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  const categories = useMemo(() => [...new Set(tours.map((t) => t.category))].sort(), [tours]);
  const experiences = useMemo(() => [...new Set(tours.flatMap((t) => t.experiences))].sort(), [tours]);
  const destinationSlugs = useMemo(() => destinations.filter((d) => tours.some((t) => t.destinations.includes(d._id))), [destinations, tours]);

  const results = useMemo(() => {
    return tours.filter((t) => {
      if (f.duration && !DURATIONS.find((d) => d.value === f.duration)?.test(t.durationDays)) return false;
      if (f.category && t.category !== f.category) return false;
      if (f.destination && !t.destinations.includes(f.destination)) return false;
      if (f.experience && !t.experiences.includes(f.experience)) return false;
      if (f.price) {
        const r = PRICES.find((p) => p.value === f.price);
        if (r && (t.priceFrom == null || t.priceFrom < r.min || t.priceFrom >= r.max)) return false;
      }
      return true;
    });
  }, [tours, f]);

  const active = Object.values(f).filter(Boolean).length;

  const select = (key: keyof Filters, label: string, options: { value: string; label: string }[]) => (
    <div>
      <label htmlFor={`filter-${key}`} className="field-label text-ink-soft">{label}</label>
      <select id={`filter-${key}`} className="field" value={f[key]} onChange={(e) => update(key, e.target.value)}>
        <option value="">Any</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );

  return (
    <div>
      <div className="mb-10 border-y border-line py-5">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <button type="button" className="btn btn-ghost min-h-11" aria-expanded={open} aria-controls="tour-filter-panel" onClick={() => setOpen((o) => !o)}>
            <SlidersHorizontal className="size-4" /> Filter tours{active ? ` (${active})` : ""}
          </button>
          <p className="text-sm text-ink-soft">{results.length} tours</p>
        </div>
        <div id="tour-filter-panel" className={`${open ? "grid" : "hidden"} mt-5 gap-4 sm:grid-cols-2 md:mt-0 md:grid md:grid-cols-5`}>
          {select("duration", "Duration", DURATIONS)}
          {select("category", "Style", categories.map((c) => ({ value: c, label: c })))}
          {select("destination", "Destination", destinationSlugs.map((d) => ({ value: d._id, label: d.name })))}
          {select("experience", "Experience", experiences.map((e) => ({ value: e, label: e })))}
          {select("price", "Price from", PRICES)}
        </div>
        <div className="mt-4 hidden items-center justify-between text-sm text-ink-soft md:flex">
          <p aria-live="polite">{results.length === tours.length ? `All ${tours.length} tours` : `${results.length} of ${tours.length} tours`}</p>
          {active > 0 && (
            <button type="button" className="link-underline text-accent" onClick={() => { setF(EMPTY); window.history.replaceState(null, "", window.location.pathname); }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {results.length ? (
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t, i) => (
            <li key={t._id}><TourCard tour={t} priority={i < 3} headingLevel="h2" /></li>
          ))}
        </ul>
      ) : (
        <div className="py-16 text-center">
          <p className="font-display text-3xl">No tour matches all of those filters.</p>
          <p className="mt-3 text-ink-soft">Remove a filter, or tell us what you have in mind and we will design it.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => { setF(EMPTY); window.history.replaceState(null, "", window.location.pathname); }}>Clear filters</button>
            <a href="/plan-your-trip" className="btn btn-primary">Request a custom trip</a>
          </div>
        </div>
      )}
    </div>
  );
}
