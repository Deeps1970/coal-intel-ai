import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/reports/$id")({
  head: () => ({ meta: [{ title: "Report Preview — COALINTEL AI" }, { name: "description", content: "AI-assisted draft — requires human validation." }, { property: "og:title", content: "Report Preview — COALINTEL AI" }, { property: "og:description", content: "AI-assisted draft — requires human validation." }] }),
  component: () => (
    <>
      <PageHeader title="Report Preview" subtitle="AI-assisted draft — requires human validation." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
