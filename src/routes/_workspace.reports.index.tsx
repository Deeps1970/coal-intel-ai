import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/reports/")({
  validateSearch: z.object({ tab: z.string().optional() }),
  head: () => ({ meta: [{ title: "Automated Report Generation — COALINTEL AI" }, { name: "description", content: "Generate structured reports from multiple sources." }, { property: "og:title", content: "Automated Report Generation — COALINTEL AI" }, { property: "og:description", content: "Generate structured reports from multiple sources." }] }),
  component: () => (
    <>
      <PageHeader title="Automated Report Generation" subtitle="Generate structured reports from multiple sources." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
