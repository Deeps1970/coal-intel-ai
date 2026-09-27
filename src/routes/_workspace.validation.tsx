import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/validation")({
  head: () => ({ meta: [{ title: "Data Validation & Traceability — COALINTEL AI" }, { name: "description", content: "Validate extracted values against reference datasets." }, { property: "og:title", content: "Data Validation & Traceability — COALINTEL AI" }, { property: "og:description", content: "Validate extracted values against reference datasets." }] }),
  component: () => (
    <>
      <PageHeader title="Data Validation & Traceability" subtitle="Validate extracted values against reference datasets." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
