import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { safeHref } from "@/lib/utils";
import { Ridge } from "./ridge";
import { Logo } from "./logo";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-[#1b1a1d] text-[#ece6dc] dark:bg-raised">
      <Ridge variant="fill" className="h-10 -translate-y-px text-paper [transform:scaleY(-1)]" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="[&_span]:text-[#ece6dc] [&_svg]:text-[#c9a45c]">
            <Logo settings={settings} />
          </div>
          {settings.footerDescription && <p className="mt-5 max-w-sm text-[#c4bdb2]">{settings.footerDescription}</p>}
          <address className="mt-6 space-y-1 not-italic text-[#c4bdb2]">
            {settings.email && <a href={`mailto:${settings.email}`} className="link-underline block w-fit text-[#ece6dc]">{settings.email}</a>}
            {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="link-underline block w-fit">{settings.phone}</a>}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`} rel="noopener noreferrer" target="_blank" className="link-underline block w-fit">
                WhatsApp {settings.whatsapp}
              </a>
            )}
            {settings.address && <p className="pt-2">{settings.address}</p>}
            {settings.businessHours && <p>{settings.businessHours}</p>}
          </address>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8">
          {settings.footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="font-sans text-sm font-medium text-[#c9a45c]">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={`${l.href}-${l.label}`}>
                    <Link href={safeHref(l.href)} className="link-underline text-[#ece6dc]/90 hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {settings.socialLinks.length > 0 && (
            <div>
              <h2 className="font-sans text-sm font-medium text-[#c9a45c]">Follow</h2>
              <ul className="mt-4 space-y-2.5">
                {settings.socialLinks.map((l) => (
                  <li key={l.href}>
                    <a href={safeHref(l.href)} rel="noopener noreferrer me" target="_blank" className="link-underline text-[#ece6dc]/90 hover:text-white">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-[#a39d93] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.companyName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {settings.legalLinks.map((l) => (
              <li key={l.href}><Link href={safeHref(l.href)} className="link-underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
