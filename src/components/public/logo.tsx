import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

export function Logo({ settings, className = "" }: { settings: Pick<SiteSettings, "companyName" | "logo">; className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label={`${settings.companyName} — home`}>
      {settings.logo?.url ? (
        <Image src={settings.logo.url} alt="" width={140} height={40} className="h-9 w-auto" unoptimized={settings.logo.url.endsWith(".svg")} />
      ) : (
        <svg viewBox="0 0 64 40" className="h-7 w-auto text-accent" aria-hidden="true">
          <path d="M2 38 L20 12 L30 24 L42 4 L62 38 Z" fill="currentColor" />
          <path d="M38 11 L42 4 L46 11 L43 9 L41 12 Z" className="fill-paper" />
        </svg>
      )}
      <span className="font-display text-[1.6rem] leading-none tracking-tight">{settings.companyName}</span>
    </Link>
  );
}
