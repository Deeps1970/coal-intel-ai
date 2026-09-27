import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/analytics")({
  head: () => ({ meta: [{ title: "Coal Sector Analytics — COALINTEL AI" }, { name: "description", content: "Source-aware analytics across production, demand, imports, dispatch, lignite and CMPDI financials." }, { property: "og:title", content: "Coal Sector Analytics — COALINTEL AI" }, { property: "og:description", content: "Source-aware analytics across production, demand, imports, dispatch, lignite and CMPDI financials." }] }),
  component: () => (
    <>
      <PageHeader title="Coal Sector Analytics" subtitle="Source-aware analytics across production, demand, imports, dispatch, lignite and CMPDI financials." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
