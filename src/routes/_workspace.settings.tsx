import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/settings")({
  head: () => ({ meta: [{ title: "Settings — COALINTEL AI" }, { name: "description", content: "Profile, organization, AI and data source configuration." }, { property: "og:title", content: "Settings — COALINTEL AI" }, { property: "og:description", content: "Profile, organization, AI and data source configuration." }] }),
  component: () => (
    <>
      <PageHeader title="Settings" subtitle="Profile, organization, AI and data source configuration." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
