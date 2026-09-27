import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, FileSearch, FileText, TrendingUp } from "lucide-react";
import { Panel, PageHeader, DemoTag } from "@/components/app/common";
import { ChartCard, SimpleArea, SimpleBar, SimpleLine } from "@/components/app/charts";
import { WorkflowStrip } from "@/components/app/WorkflowStrip";
import { Button } from "@/components/ui/button";
import { KPIS, productionTrend, productionByCompany, importsTrend, CHART_SOURCES } from "@/services/analytics";
import { ACTIVITY } from "@/data/misc";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_workspace/dashboard")({
  head: () => ({
    meta: [
      { title: "Coal Intelligence Dashboard — COALINTEL AI" },
      { name: "description", content: "Unified view of documents, production data, reporting activity and AI insights." },
      { property: "og:title", content: "Coal Intelligence Dashboard — COALINTEL AI" },
      { property: "og:description", content: "Unified view of documents, production data, reporting activity and AI insights." },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  { icon: FileText, title: "Automated Reporting", body: "Generate structured reports from multiple sources.", to: "/reports" },
  { icon: FileSearch, title: "Document Intelligence", body: "Extract information from PDFs, spreadsheets, scans and historical documents.", to: "/documents" },
  { icon: Bot, title: "AI Knowledge Assistant", body: "Ask natural-language questions and receive source-backed answers.", to: "/ai-assistant" },
] as const;

function Dashboard() {
  return (
    <>
      <section className="relative mb-8 overflow-hidden rounded-2xl bg-sidebar p-6 text-sidebar-accent-foreground md:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sidebar-primary/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-sidebar-primary">Coal Intelligence Dashboard</div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">From scattered reports to trusted intelligence.</h1>
            <p className="mt-3 max-w-xl text-sm text-sidebar-foreground/75">
              COALINTEL AI transforms geological, mining, production and administrative information into searchable, validated and traceable intelligence.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {FEATURES.map((f) => (
              <Link key={f.title} to={f.to} className="group flex items-start gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/60 p-3 transition-colors hover:border-sidebar-primary/50">
                <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                <div>
                  <div className="text-sm font-medium">{f.title}</div>
                  <div className="text-xs text-sidebar-foreground/65">{f.body}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageHeader
        title="Coal Intelligence Dashboard"
        subtitle="Unified view of documents, production data, reporting activity and AI insights."
        actions={<WorkflowStrip />}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k, i) => (
          <div key={k.key} className="card-lift animate-fade-up rounded-xl border bg-card p-4" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs text-muted-foreground">{k.label}</span>
            </div>
            <div className={cn("tabular mt-2 text-2xl font-semibold tracking-tight md:text-[28px]", k.key === "pending" && "text-accent-foreground")}>{k.value}</div>
            <div className="mt-2 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1 text-[11px] text-success"><TrendingUp className="h-3 w-3" />{k.delta}</span>
              <DemoTag />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Coal Production Trend (MT)" source={CHART_SOURCES.production} note="* FY2025-26 is provisional Apr–Dec 2025 YTD — not an annual value.">
          <SimpleLine data={productionTrend} x="fy" series={[{ key: "actual", name: "Actual (annual)" }, { key: "provisional", name: "Provisional YTD", dashed: true }]} />
        </ChartCard>
        <ChartCard title="Production by Company (MT)" source={CHART_SOURCES.company} note="CIL subsidiary split is illustrative; reconciles to CIL totals.">
          <SimpleBar data={productionByCompany} x="company" series={[{ key: "fy24", name: "FY2023-24" }, { key: "fy25", name: "FY2024-25" }]} />
        </ChartCard>
        <ChartCard title="Coal Imports (MT)" source={CHART_SOURCES.imports} note="Category split for FY2023-24 onwards is illustrative; totals are reported.">
          <SimpleArea data={importsTrend} x="fy" series={[{ key: "total", name: "Total Import" }, { key: "coking", name: "Coking Coal" }, { key: "power", name: "Power" }, { key: "nonReg", name: "Non-Regulated Sector" }]} />
        </ChartCard>
        <Panel title="Recent Processing Activity" action={<Button asChild size="sm" variant="ghost"><Link to="/documents">View all</Link></Button>}>
          <ol className="relative space-y-5 border-l pl-5">
            {ACTIVITY.map((a) => (
              <li key={a.title} className="relative">
                <span className={cn("absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-card", a.tone === "success" ? "bg-success" : "bg-chart-3")} />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{a.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{a.time}</span>
                </div>
                <div className="text-xs text-muted-foreground">{a.detail}</div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
