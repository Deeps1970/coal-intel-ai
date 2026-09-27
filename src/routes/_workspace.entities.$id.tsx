import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/entities/$id")({
  head: () => ({ meta: [{ title: "Entity View — COALINTEL AI" }, { name: "description", content: "Company overview, production, dispatch, financials and mentions." }, { property: "og:title", content: "Entity View — COALINTEL AI" }, { property: "og:description", content: "Company overview, production, dispatch, financials and mentions." }] }),
  component: () => (
    <>
      <PageHeader title="Entity View" subtitle="Company overview, production, dispatch, financials and mentions." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
