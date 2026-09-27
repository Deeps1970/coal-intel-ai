import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/ai-assistant")({
  head: () => ({ meta: [{ title: "Coal Intelligence Assistant — COALINTEL AI" }, { name: "description", content: "Ask questions across structured datasets and processed documents." }, { property: "og:title", content: "Coal Intelligence Assistant — COALINTEL AI" }, { property: "og:description", content: "Ask questions across structured datasets and processed documents." }] }),
  component: () => (
    <>
      <PageHeader title="Coal Intelligence Assistant" subtitle="Ask questions across structured datasets and processed documents." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
