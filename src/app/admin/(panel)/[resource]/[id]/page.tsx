import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isResourceKey, RESOURCES } from "@/admin/resources";
import { refFieldsIn } from "@/admin/fields";
import { getRefOptions, loadForEdit } from "@/admin/data";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";

type Props = { params: Promise<{ resource: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource, id } = await params;
  if (!isResourceKey(resource)) return { title: "Not found" };
  const doc = await loadForEdit(resource, id);
  return { title: doc ? `Edit: ${String(doc[RESOURCES[resource].titleField] ?? "")}` : "Not found" };
}

export default async function EditResource({ params }: Props) {
  const { resource, id } = await params;
  if (!isResourceKey(resource)) notFound();
  const def = RESOURCES[resource];
  const [doc, refOptions] = await Promise.all([loadForEdit(resource, id), getRefOptions(refFieldsIn(def.tabs), id)]);
  if (!doc) notFound();
  const title = String(doc[def.titleField] || "Untitled");
  const slug = typeof doc.slug === "string" ? doc.slug : "";
  // Fill fields added to the schema after this document was created.
  const initial = { ...def.defaults, ...doc };
  return (
    <>
      <PageHeader title={title} crumbs={[{ href: `/admin/${resource}`, label: def.label }, { href: `/admin/${resource}/${id}`, label: "Edit" }]} />
      <ResourceForm
        key={id}
        resource={resource}
        id={id}
        initial={initial}
        tabs={def.tabs}
        refOptions={refOptions}
        singular={def.singular}
        listHref={`/admin/${resource}`}
        publicHref={def.publicPath && slug ? def.publicPath(slug) : null}
        previewType={def.publicPath ? resource : undefined}
      />
    </>
  );
}
