"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen, Compass, ExternalLink, FileText, HelpCircle, Images, Inbox, LayoutDashboard, LogOut, Map, Menu,
  MessageSquareQuote, Settings, Sparkles, Stethoscope, X,
} from "lucide-react";
import { logout } from "@/actions/admin/auth";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { cn } from "@/lib/utils";

const GROUPS = [
  { label: "", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }, { href: "/admin/inquiries", label: "Inquiries", icon: Inbox }] },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/tours", label: "Tours", icon: Compass },
      { href: "/admin/destinations", label: "Destinations", icon: Map },
      { href: "/admin/services", label: "Services", icon: Sparkles },
      { href: "/admin/blog", label: "Journal", icon: BookOpen },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
  { label: "Library", items: [{ href: "/admin/media", label: "Media", icon: Images }, { href: "/admin/settings", label: "Settings", icon: Settings }, { href: "/admin/diagnostics", label: "Diagnostics", icon: Stethoscope }] },
];

export function AdminSidebar({ admin, newInquiries }: { admin: { name: string; email: string }; newInquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          {g.label && <p className="mb-1.5 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">{g.label}</p>}
          <ul className="space-y-0.5">
            {g.items.map(({ href, label, icon: Icon, ...rest }) => {
              const active = "exact" in rest ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-accent text-accent-ink" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                    <span className="flex-1">{label}</span>
                    {href === "/admin/inquiries" && newInquiries > 0 && (
                      <span className={cn("rounded-full px-1.5 text-xs font-semibold tabular-nums", active ? "bg-accent-ink/20" : "bg-accent text-accent-ink")}>{newInquiries}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-line p-3">
      <div className="flex items-center gap-2 px-2 pb-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{admin.name}</p>
          <p className="truncate text-xs text-ink-soft">{admin.email}</p>
        </div>
        <ThemeToggle className="!size-8" />
      </div>
      <div className="flex gap-1">
        <a href="/" target="_blank" rel="noopener" className="adm-btn flex-1 !px-2 text-xs"><ExternalLink className="size-3.5" />View site</a>
        <form action={logout} className="flex-1">
          <button type="submit" className="adm-btn w-full !px-2 text-xs"><LogOut className="size-3.5" />Sign out</button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2">
      <svg viewBox="0 0 64 40" className="h-5 w-auto text-accent" aria-hidden><path d="M2 38 L20 12 L30 24 L42 4 L62 38 Z" fill="currentColor" /></svg>
      <span className="font-display text-xl">GeorgiaGuided</span>
    </Link>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-raised/95 px-4 backdrop-blur lg:hidden">
        {brand}
        <button type="button" className="adm-icon" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu className="size-5" /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-raised">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              {brand}
              <button type="button" className="adm-icon" aria-label="Close menu" onClick={() => setOpen(false)} autoFocus><X className="size-5" /></button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-raised lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">{brand}</div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
