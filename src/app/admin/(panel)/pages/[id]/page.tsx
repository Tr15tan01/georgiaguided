import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB, serialize } from "@/lib/db";
import { Page } from "@/models";
import { getRefOptions, stripMeta } from "@/admin/data";
import { PageHeader } from "@/components/admin/page-header";
import { PageEditor } from "@/components/admin/page-editor";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  await connectDB();
  const doc = await Page.findById(id).lean();
  return doc ? stripMeta(serialize<Record<string, unknown>>(doc)) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await load((await params).id);
  return { title: doc ? `Edit: ${String(doc.title)}` : "Not found" };
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const [doc, refOptions] = await Promise.all([load(id), getRefOptions(["tours", "destinations", "services", "blog", "testimonials"])]);
  if (!doc) notFound();
  const sections = ((doc.sections as Record<string, unknown>[]) ?? []).map((s) => ({ _key: String(s._key), type: s.type, enabled: s.enabled !== false, data: (s.data as object) ?? {} }));
  return (
    <>
      <PageHeader
        title={doc.slug === "home" ? "Homepage" : String(doc.title)}
        crumbs={[{ href: "/admin/pages", label: "Pages" }, { href: `/admin/pages/${id}`, label: "Edit" }]}
      />
      <PageEditor key={id} id={id} initial={{ ...doc, seo: doc.seo ?? {}, sections }} refOptions={refOptions} />
    </>
  );
}
