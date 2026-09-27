import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Bot, FileText, ShieldCheck, UploadCloud } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "@/components/app/common";
import { ChartCard, SimpleArea, SimpleBar, SimpleLine } from "@/components/app/charts";
import { Button } from "@/components/ui/button";
import {
  productionTrend,
  productionByCompany,
  importsTrend,
  demandBySector,
  dispatchByCompany,
  cmpdiFinancials,
  CHART_SOURCES,
} from "@/services/analytics";
import { ACTIVITY } from "@/data/misc";
import { DOCUMENTS } from "@/data/documents";
import { SOURCES } from "@/data/sources";
import { SourceCitation } from "@/components/app/SourceCitation";

export const Route = createFileRoute("/_workspace/dashboard")({
  head: () => ({
    meta: [
      { title: "Information & Reporting Dashboard — COALINTEL AI" },
      {
        name: "description",
        content:
          "Operational overview of coal sector information, source documents, validation and reporting activity.",
      },
    ],
  }),
  component: Dashboard,
});

const actions = [
  { label: "Upload Document", to: "/documents", icon: UploadCloud },
  { label: "AI Query & Response", to: "/ai-assistant", icon: Bot },
  { label: "Generate Report", to: "/reports", icon: FileText },
  { label: "Data Validation", to: "/validation", icon: ShieldCheck },
  { label: "Analytical Reports", to: "/analytics", icon: BarChart3 },
] as const;

function Dashboard() {
  const metrics = [
    {
      label: "Total Coal Production",
      value: "1,047.52 MT",
      period: "FY2024-25",
      status: "Actual",
      source: SOURCES.production,
    },
    {
      label: "Coal Imports",
      value: "243.62 MT",
      period: "FY2024-25",
      status: "Actual",
      source: SOURCES.imports,
    },
    {
      label: "Coal Demand",
      value: "1,267.13 MT",
      period: "FY2024-25",
      status: "Actual",
      source: SOURCES.demand,
    },
    {
      label: "CMPDI PAT",
      value: "₹666.91 Cr",
      period: "FY2024-25",
      status: "Actual",
      source: SOURCES.cmpdi,
    },
  ];
  const observation = [
    ["Coal production increased by 5.0% from FY2023-24 to FY2024-25.", SOURCES.production],
    ["Imports decreased from 264.53 MT to 243.62 MT.", SOURCES.imports],
    ["Power utilities account for the largest recorded coal demand segment.", SOURCES.demand],
  ] as const;
  return (
    <>
      <PageHeader
        eyebrow="COALINTEL AI · SIH 2026 Prototype · PS 26023"
        title="Information & Reporting Dashboard"
        subtitle="Operational overview of source documents, coal sector datasets, validation and reporting activity."
      />
      <div className="mb-5 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Reporting Period", "FY2024-25"],
          ["Data Status", "Actual · selected records"],
          ["Last Updated", "27 September 2026"],
          ["Use Case", "Designed for CMPDI / CIL reporting"],
        ].map(([k, v]) => (
          <div key={k} className="bg-card px-4 py-3">
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {k}
            </div>
            <div className="mt-1 text-xs font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <section
        aria-label="Key sector statistics"
        className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md border bg-card p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {m.label}
            </div>
            <div className="mt-1.5 text-2xl font-semibold tabular tracking-tight">{m.value}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>{m.period}</span>
              <StatusBadge status={m.status} />
            </div>
            <div className="mt-2 border-t pt-2">
              <SourceCitation source={m.source} variant="link">
                Source reference
              </SourceCitation>
            </div>
          </div>
        ))}
      </section>
      <Panel className="mb-5" title="Common Tasks">
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button asChild key={a.label} size="sm" variant="outline">
              <Link to={a.to}>
                <a.icon className="mr-2 h-3.5 w-3.5" />
                {a.label}
              </Link>
            </Button>
          ))}
        </div>
      </Panel>
      <Panel className="mb-5" title="Automated Observations · AI-Assisted">
        <div className="grid gap-2 md:grid-cols-3">
          {observation.map(([text, source]) => (
            <div key={text} className="border-l-2 border-primary/60 py-1 pl-3">
              <p className="text-xs leading-relaxed">{text}</p>
              <div className="mt-1">
                <SourceCitation source={source} variant="link">
                  View source reference
                </SourceCitation>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <section aria-label="Sector performance charts" className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Coal Production — Annual Trend (MT)"
          source={CHART_SOURCES.production}
          dataRows={productionTrend}
          note="FY2025-26 is provisional Apr–Dec 2025 YTD; not an annual value."
        >
          <SimpleLine
            data={productionTrend}
            x="fy"
            series={[
              { key: "actual", name: "Actual (annual)" },
              { key: "provisional", name: "Provisional YTD", dashed: true },
            ]}
          />
        </ChartCard>
        <ChartCard
          title="Coal Production — Company Comparison (MT)"
          source={CHART_SOURCES.company}
          dataRows={productionByCompany}
          note="CIL subsidiary allocation is illustrative; company totals are source-derived."
        >
          <SimpleBar
            data={productionByCompany}
            x="company"
            series={[
              { key: "fy24", name: "FY2023-24" },
              { key: "fy25", name: "FY2024-25" },
            ]}
          />
        </ChartCard>
        <ChartCard
          title="Coal Dispatch — Company Comparison (MT)"
          source={CHART_SOURCES.dispatch}
          dataRows={dispatchByCompany}
          note="Supplied dispatch comparison is illustrative demo data."
        >
          <SimpleBar
            data={dispatchByCompany}
            x="company"
            series={[
              { key: "fy24", name: "FY2023-24" },
              { key: "fy25", name: "FY2024-25" },
            ]}
          />
        </ChartCard>
        <ChartCard
          title="Import Position (MT)"
          source={CHART_SOURCES.imports}
          dataRows={importsTrend}
          note="Import totals are source-derived; category splits are illustrative."
        >
          <SimpleArea
            data={importsTrend}
            x="fy"
            series={[
              { key: "total", name: "Total Import" },
              { key: "coking", name: "Coking Coal" },
              { key: "power", name: "Power" },
              { key: "nonReg", name: "Non-Regulated Sector" },
            ]}
          />
        </ChartCard>
        <ChartCard
          title="Coal Demand by Sector (MT)"
          source={CHART_SOURCES.demand}
          dataRows={demandBySector}
        >
          <SimpleBar
            data={demandBySector}
            x="sector"
            series={[{ key: "value", name: "FY2024-25" }]}
            horizontal
          />
        </ChartCard>
        <ChartCard
          title="CMPDI Financial Position (₹ crore)"
          source={CHART_SOURCES.cmpdi}
          dataRows={cmpdiFinancials.map((r) => ({
            metric: r.metric,
            "FY2023-24": r.fy24,
            "FY2024-25": r.fy25,
          }))}
        >
          <SimpleBar
            data={cmpdiFinancials.map((r) => ({
              metric: r.metric,
              "FY2023-24": r.fy24,
              "FY2024-25": r.fy25,
            }))}
            x="metric"
            series={[
              { key: "FY2023-24", name: "FY2023-24" },
              { key: "FY2024-25", name: "FY2024-25" },
            ]}
          />
        </ChartCard>
      </section>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel
          title="Recent Documents"
          action={
            <Button asChild size="sm" variant="ghost">
              <Link to="/documents">View register</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="border-y bg-muted/30 text-muted-foreground">
                <tr>
                  {["Document ID", "Document Title", "Source", "Uploaded", "Status"].map((h) => (
                    <th key={h} className="px-2.5 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {DOCUMENTS.slice(0, 4).map((d) => (
                  <tr key={d.id}>
                    <td className="px-2.5 py-2 font-mono">{d.id}</td>
                    <td className="px-2.5 py-2">
                      <Link
                        className="font-medium hover:underline"
                        to="/documents/$id"
                        params={{ id: d.id }}
                      >
                        {d.name}
                      </Link>
                      <div className="text-muted-foreground">{d.category}</div>
                    </td>
                    <td className="px-2.5 py-2">{d.source}</td>
                    <td className="px-2.5 py-2">{d.uploadedAt}</td>
                    <td className="px-2.5 py-2">
                      <StatusBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title="Recent Activities"
          action={
            <Button asChild size="sm" variant="ghost">
              <Link to="/audit-trail">View audit trail</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="border-y bg-muted/30 text-muted-foreground">
                <tr>
                  {["Timestamp", "User", "Action", "Reference", "Status"].map((h) => (
                    <th key={h} className="px-2.5 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {ACTIVITY.slice(0, 5).map((a) => (
                  <tr key={a.title}>
                    <td className="px-2.5 py-2 font-mono">{a.time}</td>
                    <td className="px-2.5 py-2">Demo User</td>
                    <td className="px-2.5 py-2">{a.title}</td>
                    <td className="px-2.5 py-2 text-muted-foreground">Prototype log</td>
                    <td className="px-2.5 py-2">
                      <StatusBadge status={a.tone === "success" ? "Completed" : "Generated"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
