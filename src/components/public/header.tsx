import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { safeHref } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { HeaderShell } from "./header-shell";
import { NavLink } from "./nav-link";
import { Logo } from "./logo";

export function Header({ settings }: { settings: SiteSettings }) {
  const nav = settings.navigation.map((n) => ({ label: n.label, href: safeHref(n.href) }));
  const cta = { label: settings.headerCta?.label || "Plan your trip", href: safeHref(settings.headerCta?.href, "/plan-your-trip") };
  return (
    <HeaderShell>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Logo settings={settings} />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <NavLink href={n.href}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link href={cta.href} className="btn btn-primary hidden min-h-11 px-5 sm:inline-flex">
            {cta.label}
          </Link>
          <MobileNav nav={nav} cta={cta} companyName={settings.companyName} email={settings.email} phone={settings.phone} />
        </div>
      </div>
    </HeaderShell>
  );
}
