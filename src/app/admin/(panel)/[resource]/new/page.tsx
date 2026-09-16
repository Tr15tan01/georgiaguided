import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isResourceKey, RESOURCES } from "@/admin/resources";
import { refFieldsIn } from "@/admin/fields";
import { getRefOptions } from "@/admin/data";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  return { title: isResourceKey(resource) ? `New ${RESOURCES[resource].singular}` : "Not found" };
}

export default async function NewResource({ params }: Props) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const def = RESOURCES[resource];
  const refOptions = await getRefOptions(refFieldsIn(def.tabs));
  return (
    <>
      <PageHeader title={`New ${def.singular}`} crumbs={[{ href: `/admin/${resource}`, label: def.label }, { href: `/admin/${resource}/new`, label: "New" }]} />
      <ResourceForm
        resource={resource}
        id={null}
        initial={def.defaults}
        tabs={def.tabs}
        refOptions={refOptions}
        singular={def.singular}
        listHref={`/admin/${resource}`}
      />
    </>
  );
}
