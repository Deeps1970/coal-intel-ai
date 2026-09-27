import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app/common";

export const Route = createFileRoute("/_workspace/topics")({
  validateSearch: z.object({ topic: z.string().optional() }),
  head: () => ({ meta: [{ title: "Topic Intelligence — COALINTEL AI" }, { name: "description", content: "Topics, keywords and entities detected across documents." }, { property: "og:title", content: "Topic Intelligence — COALINTEL AI" }, { property: "og:description", content: "Topics, keywords and entities detected across documents." }] }),
  component: () => (
    <>
      <PageHeader title="Topic Intelligence" subtitle="Topics, keywords and entities detected across documents." />
      <Panel><p className="text-sm text-muted-foreground">This module is being assembled. <Link to="/dashboard" className="text-accent-foreground underline">Back to dashboard</Link></p></Panel>
    </>
  ),
});
