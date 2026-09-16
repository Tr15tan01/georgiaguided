import type { Metadata } from "next";
import { getRefOptions } from "@/admin/data";
import { PageHeader } from "@/components/admin/page-header";
import { PageEditor } from "@/components/admin/page-editor";

export const metadata: Metadata = { title: "New page" };

export default async function NewPage() {
  const refOptions = await getRefOptions(["tours", "destinations", "services", "blog", "testimonials"]);
  const initial = {
    title: "", slug: "", kind: "custom", status: "draft", seo: {},
    sections: [
      { _key: "hero", type: "hero", enabled: true, data: { heading: "", compact: true } },
      { _key: "body", type: "intro", enabled: true, data: { heading: "", body: "" } },
    ],
  };
  return (
    <>
      <PageHeader title="New page" crumbs={[{ href: "/admin/pages", label: "Pages" }, { href: "/admin/pages/new", label: "New" }]} />
      <PageEditor id={null} initial={initial} refOptions={refOptions} />
    </>
  );
}
