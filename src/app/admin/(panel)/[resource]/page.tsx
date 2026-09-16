import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { connectDB, serialize } from "@/lib/db";
import { isResourceKey, RESOURCES } from "@/admin/resources";
import { RESOURCE_MODELS } from "@/admin/data";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceTable } from "@/components/admin/resource-table";
import { ListToolbar, Pagination } from "@/components/admin/list-controls";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PER_PAGE = 20;
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  return { title: isResourceKey(resource) ? RESOURCES[resource].label : "Not found" };
}

export default async function ResourceList({ params, searchParams }: Props) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const def = RESOURCES[resource];
  const sp = await searchParams;
  const q = one(sp.q).trim().slice(0, 100);
  const status = one(sp.status);
  const page = Math.max(1, Number.parseInt(one(sp.page) || "1", 10) || 1);

  const filter: Record<string, unknown> = {};
  if (q) filter.$or = def.searchFields.map((f) => ({ [f]: { $regex: escapeRegex(q), $options: "i" } }));
  if (status === "draft" || status === "published") filter.status = status;

  await connectDB();
  const Model = RESOURCE_MODELS[resource];
  const select = ["slug", "status", ...def.columns.map((c) => c.key), def.titleField, "currency"].join(" ");
  const [rows, total, counts] = await Promise.all([
    Model.find(filter).sort(def.defaultSort).skip((page - 1) * PER_PAGE).limit(PER_PAGE).select(select).lean(),
    Model.countDocuments(filter),
    Model.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const countBy = Object.fromEntries(counts.map((c) => [c._id, c.n]));
  const all = counts.reduce((a, c) => a + c.n, 0);

  return (
    <>
      <PageHeader
        title={def.label}
        crumbs={[{ href: `/admin/${resource}`, label: def.label }]}
        actions={<Link href={`/admin/${resource}/new`} className="adm-btn adm-btn-primary"><Plus className="size-4" />New {def.singular}</Link>}
      />
      <ListToolbar
        basePath={`/admin/${resource}`}
        q={q}
        active={status}
        filters={[
          { value: "", label: "All", count: all },
          { value: "published", label: "Published", count: countBy.published ?? 0 },
          { value: "draft", label: "Drafts", count: countBy.draft ?? 0 },
        ]}
        filterParam="status"
      />
      <ResourceTable
        resource={resource}
        rows={serialize(rows)}
        emptyText={q || status ? "Nothing matches these filters." : `No ${def.label.toLowerCase()} yet.`}
      />
      <Pagination basePath={`/admin/${resource}`} page={page} pages={pages} total={total} params={{ q, status }} />
    </>
  );
}
