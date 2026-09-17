"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-x section-y text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Unexpected detour</p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft">Please try again in a moment. If you were sending an inquiry, you can also reach us directly from the contact page.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => retry()}>Try again</button>
        <Link href="/contact" className="btn btn-ghost">Contact us</Link>
      </div>
    </section>
  );
}
