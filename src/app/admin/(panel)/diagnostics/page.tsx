import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { DiagnosticsPanel } from "@/components/admin/diagnostics-panel";

export const metadata: Metadata = { title: "Diagnostics" };

export default function DiagnosticsPage() {
  return (
    <>
      <PageHeader
        title="Diagnostics"
        description="Checks that the server can read your session, reach the database and see its configuration. Useful when something in the admin fails."
        crumbs={[{ href: "/admin/diagnostics", label: "Diagnostics" }]}
      />
      <DiagnosticsPanel />
    </>
  );
}
