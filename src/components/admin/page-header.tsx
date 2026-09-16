import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({ title, crumbs = [], actions, description }: {
  title: string;
  crumbs?: { href: string; label: string }[];
  actions?: React.ReactNode;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-soft">
          <li><Link href="/admin" className="hover:text-ink">Admin</Link></li>
          {crumbs.map((c) => (
            <li key={c.href} className="flex items-center gap-1">
              <ChevronRight aria-hidden className="size-3" />
              <Link href={c.href} className="hover:text-ink">{c.label}</Link>
            </li>
          ))}
        </ol>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
