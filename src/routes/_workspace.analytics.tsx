import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusBadge } from "@/components/app/common";
import { ChartCard, SimpleBar, SimpleLine } from "@/components/app/charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productionTrend,
  productionByCompany,
  importsTrend,
  demandBySector,
  dispatchByCompany,
  ligniteProduction,
  ligniteDispatch,
  cmpdiFinancials,
  CHART_SOURCES,
} from "@/services/analytics";

export const Route = createFileRoute("/_workspace/analytics")({
  head: () => ({ meta: [{ title: "Coal Sector Analytics — COALINTEL AI" }] }),
  component: Analytics,
});

function Analytics() {
  const [period, setPeriod] = useState("FY2024-25");
  const [company, setCompany] = useState("All companies");
  const [dataset, setDataset] = useState("All datasets");
  const [status, setStatus] = useState("All statuses");
  const production = useMemo(
    () =>
      productionTrend.filter(
        (r) =>
          (period === "All periods" ||
            r.fy === period ||
            (period === "FY2024-25" && r.fy === "FY2023-24")) &&
          (status === "All statuses" ||
            (status === "Actual"
              ? r.actual !== null
              : status === "Provisional"
                ? r.provisional !== null
                : true)),
      ),
    [period, status],
  );
  const companies = useMemo(
    () => productionByCompany.filter((r) => company === "All companies" || r.company === company),
    [company],
  );
  const years =
    period === "All periods"
      ? ["FY2023-24", "FY2024-25"]
      : period === "FY2025-26*"
        ? ["FY2025-26*"]
        : [period];
  const subsidiaryNames = ["ECL", "BCCL", "CCL", "NCL", "WCL", "SECL", "MCL", "NEC"];
  const companyRows = companies
    .filter((r) =>
      status === "Illustrative"
        ? subsidiaryNames.includes(r.company)
        : status === "Actual"
          ? !subsidiaryNames.includes(r.company)
          : true,
    )
    .map((r) => ({
      company: r.company,
      ...(years.includes("FY2023-24") ? { "FY2023-24": r.fy24 } : {}),
      ...(years.includes("FY2024-25") ? { "FY2024-25": r.fy25 } : {}),
    }));
  const compareSeries = [
    ...(years.includes("FY2023-24") ? [{ key: "FY2023-24", name: "FY2023-24" }] : []),
    ...(years.includes("FY2024-25") ? [{ key: "FY2024-25", name: "FY2024-25" }] : []),
  ];
  const importRows = importsTrend.filter((r) => period === "All periods" || r.fy === period);
  const ligniteRows = (data: { company: string; fy24: number; fy25: number }[]) =>
    data
      .filter((r) => company === "All companies" || r.company === company)
      .map((r) => ({
        company: r.company,
        ...(years.includes("FY2023-24") ? { "FY2023-24": r.fy24 } : {}),
        ...(years.includes("FY2024-25") ? { "FY2024-25": r.fy25 } : {}),
      }));
  const visible = (name: string) => {
    const datasetMatch = dataset === "All datasets" || dataset === name;
    const statusMatch =
      status === "All statuses" ||
      (status === "Illustrative"
        ? ["Dispatch", "Lignite", "Production"].includes(name)
        : status === "Provisional"
          ? name === "Production"
          : !["Dispatch", "Lignite"].includes(name));
    const periodMatch =
      period === "All periods" ||
      period === "FY2024-25" ||
      name === "Imports" ||
      (name === "Production" && period === "FY2023-24") ||
      (name === "CMPDI Financials" && period === "FY2023-24");
    return datasetMatch && statusMatch && periodMatch;
  };
  const fin = cmpdiFinancials.map((m) => ({
    metric: m.metric,
    ...(years.includes("FY2023-24") ? { "FY2023-24": m.fy24 } : {}),
    ...(years.includes("FY2024-25") ? { "FY2024-25": m.fy25 } : {}),
  }));
  return (
    <>
      <PageHeader
        title="Coal Sector Analytics"
        subtitle="Explore production, dispatch, demand, imports, lignite and CMPDI financials with source traceability."
      />
      <Panel className="mb-5" title="Analysis filters" bodyClassName="p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Filter
            label="Financial Year"
            value={period}
            onChange={setPeriod}
            options={["FY2024-25", "FY2023-24", "FY2025-26*", "All periods"]}
          />
          <Filter
            label="Company / Subsidiary"
            value={company}
            onChange={setCompany}
            options={[
              "All companies",
              "CIL",
              "SCCL",
              "Captive & Others",
              "ECL",
              "BCCL",
              "CCL",
              "NCL",
              "WCL",
              "SECL",
              "MCL",
              "NEC",
            ]}
          />
          <Filter
            label="Dataset"
            value={dataset}
            onChange={setDataset}
            options={[
              "All datasets",
              "Production",
              "Dispatch",
              "Demand",
              "Imports",
              "Lignite",
              "CMPDI Financials",
            ]}
          />
          <Filter
            label="Status"
            value={status}
            onChange={setStatus}
            options={["All statuses", "Actual", "Provisional", "Illustrative"]}
          />
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-2">
        {visible("Production") && status !== "Illustrative" && (
          <ChartCard
            title="Annual coal production (MT)"
            source={CHART_SOURCES.production}
            note="FY2025-26* is provisional Apr–Dec; annual actuals shown where published."
          >
            <SimpleLine
              data={production}
              x="fy"
              series={[
                { key: "actual", name: "Actual" },
                { key: "provisional", name: "Provisional" },
              ]}
            />
          </ChartCard>
        )}
        {visible("Production") && status !== "Provisional" && (
          <ChartCard
            title="Production by company (MT)"
            source={CHART_SOURCES.company}
            note="Company split is reported at CIL/SCCL/Captive level; CIL subsidiary allocation is illustrative."
          >
            <SimpleBar data={companyRows} x="company" series={compareSeries} />
          </ChartCard>
        )}
        {visible("Production") && status !== "Illustrative" && status !== "Provisional" && period !== "FY2023-24" && period !== "FY2025-26*" && (
          <ChartCard
            title="CIL target vs actual (MT)"
            source={CHART_SOURCES.production}
            note="Target shown only for CIL, where a FY2024-25 target is present in the supplied dataset."
          >
            <SimpleBar
              data={[{ company: "CIL", actual: 781.06, target: 838 }]}
              x="company"
              series={[
                { key: "actual", name: "Actual FY2024-25" },
                { key: "target", name: "Target" },
              ]}
            />
          </ChartCard>
        )}
        {visible("Dispatch") && (
          <ChartCard
            title="Dispatch by company (MT)"
            source={CHART_SOURCES.dispatch}
            note="Company-level dispatch split is illustrative demo data."
          >
            <SimpleBar
              data={dispatchByCompany
                .filter((r) => company === "All companies" || r.company === company)
                .map((r) => ({
                  company: r.company,
                  ...(years.includes("FY2023-24") ? { "FY2023-24": r.fy24 } : {}),
                  ...(years.includes("FY2024-25") ? { "FY2024-25": r.fy25 } : {}),
                }))}
              x="company"
              series={compareSeries}
            />
          </ChartCard>
        )}
        {visible("Demand") && (
          <ChartCard title="Coal demand by sector (MT)" source={CHART_SOURCES.demand}>
            <SimpleBar
              data={demandBySector}
              x="sector"
              series={[{ key: "value", name: "FY2024-25" }]}
              horizontal
            />
          </ChartCard>
        )}
        {visible("Imports") && (
          <ChartCard title="Annual coal imports (MT)" source={CHART_SOURCES.imports}>
            <SimpleLine
              data={importRows}
              x="fy"
              series={[{ key: "total", name: "Total imports" }]}
            />
          </ChartCard>
        )}
        {visible("Lignite") && (
          <ChartCard title="Lignite production (MT)" source={CHART_SOURCES.lignite}>
            <SimpleBar data={ligniteRows(ligniteProduction)} x="company" series={compareSeries} />
          </ChartCard>
        )}
        {visible("Lignite") && (
          <ChartCard title="Lignite dispatch (MT)" source={CHART_SOURCES.lignite}>
            <SimpleBar data={ligniteRows(ligniteDispatch)} x="company" series={compareSeries} />
          </ChartCard>
        )}
        {visible("CMPDI Financials") && (
          <ChartCard title="CMPDI financial performance (₹ crore)" source={CHART_SOURCES.cmpdi}>
            <SimpleBar
              data={fin}
              x="metric"
              series={[
                { key: "FY2023-24", name: "FY2023-24" },
                { key: "FY2024-25", name: "FY2024-25" },
              ]}
            />
          </ChartCard>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <StatusBadge status={period === "FY2025-26*" ? "Provisional" : "Actual"} /> Filters apply to
        the comparable charts; every chart includes its source record.
      </div>
    </>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-1.5 text-xs text-muted-foreground">
      <span>{label}</span>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
