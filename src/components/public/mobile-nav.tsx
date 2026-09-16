"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface Props {
  nav: { label: string; href: string }[];
  cta: { label: string; href: string };
  companyName: string;
  email?: string;
  phone?: string;
}

export function MobileNav({ nav, cta, companyName, email, phone }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-ink/8 lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-6" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex h-[4.5rem] items-center justify-between">
              <span className="font-display text-[1.6rem]">{companyName}</span>
              <button ref={closeRef} type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-ink/8">
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pt-6">
              <ul>
                {nav.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                    className="border-b border-line"
                  >
                    <Link href={n.href} className="block py-4 font-display text-4xl" aria-current={pathname.startsWith(n.href) ? "page" : undefined}>
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 space-y-1 text-ink-soft">
                {email && <a className="block py-1" href={`mailto:${email}`}>{email}</a>}
                {phone && <a className="block py-1" href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>}
              </div>
            </nav>
            <div className="container-x pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
              <Link href={cta.href} className="btn btn-primary w-full">{cta.label}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
