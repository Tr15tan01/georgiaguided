import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { connectDB, serialize } from "@/lib/db";
import { Page } from "@/models";
import { pagePath } from "@/lib/paths";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/resource-form";
import type { Page as TPage } from "@/lib/types";

export const metadata: Metadata = { title: "Pages" };

const KIND_LABEL = { system: "Built-in pages", custom: "Custom pages", legal: "Legal pages" } as const;
const ORDER = ["home", "about", "why-georgia", "tours", "destinations", "services", "blog", "faq", "contact", "plan-your-trip"];

export default async function PagesList() {
  await connectDB();
  const pages = serialize<TPage[]>(await Page.find().select("title slug kind status updatedAt sections").lean());
  const groups = (["system", "custom", "legal"] as const).map((kind) => ({
    kind,
    items: pages.filter((p) => p.kind === kind).sort((a, b) => (kind === "system" ? ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug) : a.title.localeCompare(b.title))),
  }));
  return (
    <>
      <PageHeader
        title="Pages"
        description="Edit the homepage and every other page section by section."
        crumbs={[{ href: "/admin/pages", label: "Pages" }]}
        actions={<Link href="/admin/pages/new" className="adm-btn adm-btn-primary"><Plus className="size-4" />New page</Link>}
      />
      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.kind} className="adm-card overflow-x-auto">
            <h2 className="border-b border-line px-4 py-3 text-sm font-semibold">{KIND_LABEL[g.kind]}</h2>
            {g.items.length === 0 ? (
              <p className="p-6 text-sm text-ink-soft">None yet.</p>
            ) : (
              <table className="adm-table">
                <thead><tr><th scope="col">Title</th><th scope="col" className="hidden sm:table-cell">Sections</th><th scope="col">Status</th><th scope="col" className="hidden md:table-cell">Updated</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {g.items.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <Link href={`/admin/pages/${p._id}`} className="font-medium hover:text-accent">{p.slug === "home" ? "Homepage" : p.title}</Link>
                        <p className="font-mono text-xs text-ink-soft">{pagePath(p.slug)}</p>
                      </td>
                      <td className="hidden text-ink-soft sm:table-cell">{p.sections.filter((s) => s.enabled).length} visible / {p.sections.length}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="hidden text-ink-soft md:table-cell">{formatDate(p.updatedAt, { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td>
                        <div className="flex justify-end gap-0.5">
                          {p.status === "published" && <a href={pagePath(p.slug)} target="_blank" rel="noopener" className="adm-icon" aria-label={`View ${p.title}`}><ExternalLink className="size-4" /></a>}
                          <Link href={`/admin/pages/${p._id}`} className="adm-icon" aria-label={`Edit ${p.title}`}><Pencil className="size-4" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
