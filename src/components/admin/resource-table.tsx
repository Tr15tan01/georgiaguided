"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { RESOURCES, type ResourceKey } from "@/admin/resources";
import { deleteResource, setStatus } from "@/actions/admin/content";
import { formatDate, formatPrice } from "@/lib/utils";
import { ConfirmButton } from "./confirm";
import { StatusBadge } from "./resource-form";
import { useToast } from "./toast";

type Row = Record<string, unknown> & { _id: string };

export function ResourceTable({ resource, rows, emptyText }: { resource: ResourceKey; rows: Row[]; emptyText: string }) {
  const def = RESOURCES[resource];
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();

  if (rows.length === 0) {
    return (
      <div className="adm-card flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-ink-soft">{emptyText}</p>
        <Link href={`/admin/${resource}/new`} className="adm-btn adm-btn-primary">Create {def.singular}</Link>
      </div>
    );
  }

  const toggle = (row: Row) =>
    start(async () => {
      const res = await setStatus(resource, row._id, row.status === "published" ? "draft" : "published");
      toast(res.ok ? "success" : "error", res.message);
      router.refresh();
    });

  const cell = (row: Row, key: string, kind?: string) => {
    const v = row[key];
    if (kind === "status") return <StatusBadge status={String(v)} />;
    if (kind === "bool") return v ? <Check aria-label="Yes" className="size-4 text-moss" /> : <span className="text-ink-soft" aria-label="No">—</span>;
    if (kind === "date") return <span className="whitespace-nowrap text-ink-soft">{v ? formatDate(String(v), { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
    if (kind === "price") return <span className="tabular-nums">{v != null ? formatPrice(Number(v), String(row.currency ?? "EUR")) : "—"}</span>;
    return <span>{v == null || v === "" ? "—" : String(v)}</span>;
  };

  return (
    <div className="adm-card overflow-x-auto" aria-busy={pending}>
      <table className="adm-table">
        <thead>
          <tr>
            {def.columns.map((c, i) => <th key={c.key} scope="col" className={i > 1 ? "hidden md:table-cell" : undefined}>{c.label}</th>)}
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const title = String(row[def.titleField] || "Untitled");
            return (
              <tr key={row._id}>
                {def.columns.map((c, i) => (
                  <td key={c.key} className={i > 1 ? "hidden md:table-cell" : undefined}>
                    {i === 0 ? (
                      <div className="max-w-md">
                        <Link href={`/admin/${resource}/${row._id}`} className="line-clamp-2 font-medium hover:text-accent">{title}</Link>
                        {typeof row.slug === "string" && <p className="truncate font-mono text-xs text-ink-soft">/{row.slug}</p>}
                      </div>
                    ) : cell(row, c.key, c.kind)}
                  </td>
                ))}
                <td>
                  <div className="flex items-center justify-end gap-0.5">
                    <button type="button" className="adm-btn !min-h-8 !px-2.5 text-xs" disabled={pending} onClick={() => toggle(row)}>
                      {row.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    {def.publicPath && row.status === "published" && typeof row.slug === "string" && (
                      <a className="adm-icon" href={def.publicPath(row.slug)} target="_blank" rel="noopener" aria-label={`View ${title} on the website`}><ExternalLink className="size-4" /></a>
                    )}
                    <Link className="adm-icon" href={`/admin/${resource}/${row._id}`} aria-label={`Edit ${title}`}><Pencil className="size-4" /></Link>
                    <ConfirmButton
                      className="adm-icon hover:!text-[#b3261e]"
                      title={`Delete “${title}”?`}
                      description="This permanently removes it and any links to it from other content."
                      confirmLabel="Delete"
                      onConfirm={async () => {
                        const res = await deleteResource(resource, row._id);
                        toast(res.ok ? "success" : "error", res.message);
                        router.refresh();
                      }}
                    >
                      <Trash2 className="size-4" aria-label={`Delete ${title}`} />
                    </ConfirmButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
