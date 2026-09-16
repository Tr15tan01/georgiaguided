"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** A quiet, dismissible "Plan your trip" bar that appears after the first screen. */
export function PlanCta({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hidden = pathname.startsWith("/plan-your-trip") || pathname.startsWith("/contact");

  useEffect(() => {
    try { setDismissed(sessionStorage.getItem("gg-cta") === "0"); } catch {}
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden || dismissed) return null;
  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-30 transition-all duration-500 ease-[var(--ease-quiet)] sm:inset-x-auto sm:right-6 sm:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-2 rounded-full bg-ink p-1.5 pl-5 text-paper shadow-lg shadow-black/20">
        <span className="hidden text-sm sm:inline">Travelling to Georgia?</span>
        <Link href={href} tabIndex={visible ? 0 : -1} className="btn btn-primary min-h-10 flex-1 px-5 py-2 text-sm dark:bg-[#c9a45c] sm:flex-none">
          {label}
        </Link>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => { setDismissed(true); try { sessionStorage.setItem("gg-cta", "0"); } catch {} }}
          className="inline-flex size-9 items-center justify-center rounded-full text-paper/70 hover:bg-white/10 hover:text-paper"
          aria-label="Hide trip planning prompt"
        >
          ×
        </button>
      </div>
    </div>
  );
}
