import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function href(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "" && !(k === "page" && v === 1)) sp.set(k, String(v)); });
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

export function ListToolbar({ basePath, q, active, filters, filterParam }: {
  basePath: string;
  q: string;
  active: string;
  filters: { value: string; label: string; count?: number }[];
  filterParam: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Filter" className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={href(basePath, { q, [filterParam]: f.value })}
            aria-current={active === f.value ? "true" : undefined}
            className={cn("whitespace-nowrap rounded-full border px-3 py-1 text-sm", active === f.value ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-soft hover:text-ink")}
          >
            {f.label}{f.count !== undefined && <span className="ml-1.5 tabular-nums opacity-70">{f.count}</span>}
          </Link>
        ))}
      </nav>
      <form role="search" action={basePath} className="relative w-full sm:w-72">
        {active && <input type="hidden" name={filterParam} value={active} />}
        <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
        <input type="search" name="q" defaultValue={q} placeholder="Search…" aria-label="Search" className="adm-input pl-9" />
      </form>
    </div>
  );
}

export function Pagination({ basePath, page, pages, total, params }: { basePath: string; page: number; pages: number; total: number; params: Record<string, string> }) {
  if (pages <= 1) return <p className="mt-3 text-xs text-ink-soft">{total} item{total === 1 ? "" : "s"}</p>;
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-3 text-sm">
      <p className="text-ink-soft">Page {page} of {pages} · {total} items</p>
      <div className="flex gap-2">
        {page > 1 ? <Link className="adm-btn" href={href(basePath, { ...params, page: page - 1 })}>Previous</Link> : <span className="adm-btn opacity-40">Previous</span>}
        {page < pages ? <Link className="adm-btn" href={href(basePath, { ...params, page: page + 1 })}>Next</Link> : <span className="adm-btn opacity-40">Next</span>}
      </div>
    </nav>
  );
}
