import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[70dvh] flex-col items-start justify-center py-24">
      <p className="text-ink-soft">Error 404</p>
      <h1 className="mt-3 max-w-2xl text-5xl sm:text-7xl">This path leads off the map.</h1>
      <p className="mt-6 max-w-lg text-lg text-ink-soft">
        The page may have moved or never existed. The routes below are well travelled.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Go to the homepage</Link>
        <Link href="/tours" className="btn btn-ghost">Browse tours</Link>
        <Link href="/plan-your-trip" className="btn btn-ghost">Plan your trip</Link>
      </div>
    </main>
  );
}
