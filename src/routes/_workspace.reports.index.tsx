import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Download,
  FileText,
  Printer,
  Sparkles,
  Copy,
  Pencil,
} from "lucide-react";
import { PageHeader, Panel, StatusBadge, EmptyState } from "@/components/app/common";
import { SourceCitation } from "@/components/app/SourceCitation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  REPORT_TYPES,
  REPORT_SOURCES,
  REPORT_PERIODS,
  generateReport,
  listReports,
} from "@/services/reports";
import { download } from "@/services/datasets";
import { SOURCES } from "@/data/sources";
import type { Report } from "@/types";

export const Route = createFileRoute("/_workspace/reports/")({
  head: () => ({ meta: [{ title: "Automated Report Generation — COALINTEL AI" }] }),
  component: Reports,
});
const steps = ["Report type", "Data sources", "Period", "Generate"];
function Reports() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("Executive Summary");
  const [sources, setSources] = useState<string[]>([
    "Coal Production",
    "Coal Imports",
    "Coal Demand",
  ]);
  const [period, setPeriod] = useState("FY2024-25");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(0);
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    "India's total coal production during FY2024-25 was 1,047.52 million tonnes, compared with 997.25 million tonnes in FY2023-24. This represents an increase of 50.27 million tonnes, or approximately 5.0 per cent year over year.",
  );
  useEffect(() => {
    void listReports()
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [report]);
  const parliament = type === "Parliamentary Response";
  const phases = [
    "Collecting verified data…",
    "Analyzing selected sources…",
    "Preparing report structure…",
    "Generating insights…",
    "Adding source citations…",
    "Running validation…",
    "Preparing report…",
  ];
  const generate = async () => {
    setBusy(true);
    setPhase(0);
    const timer = window.setInterval(
      () => setPhase((p) => Math.min(p + 1, phases.length - 1)),
      300,
    );
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    try {
      const r = await generateReport({ type, sources, period, format: "PDF" });
      setReport(r);
      setStep(3);
    } finally {
      clearInterval(timer);
      setBusy(false);
    }
  };
  const toggle = (s: string) =>
    setSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const exportCSV = () =>
    download(
      "coalintel-report-data.csv",
      `Metric,Value,Unit,Period,Status\nCoal production,1047.52,MT,FY2024-25,Actual\nPrior year production,997.25,MT,FY2023-24,Actual\nCoal imports,243.62,MT,FY2024-25,Actual\nCoal demand,1267.13,MT,FY2024-25,Actual\nCMPDI PAT,666.91,INR crore,FY2024-25,Actual`,
      "text/csv",
    );
  const title = parliament
    ? "Parliamentary Response — Coal Production"
    : `${type.replace(" Report", "")} — ${period}`;
  const referenceNo = report ? `CIAI/REP/${new Date().getFullYear()}/${report.id.slice(-5).toUpperCase()}` : "";
  const sourceRefs = sources.flatMap((s) =>
    s.includes("Production")
      ? [SOURCES.production]
      : s.includes("Imports")
        ? [SOURCES.imports]
        : s.includes("Demand")
          ? [SOURCES.demand]
          : s.includes("Dispatch")
            ? [SOURCES.dispatch]
            : s.includes("Lignite")
              ? [SOURCES.lignite]
              : s.includes("CMPDI")
                ? [SOURCES.cmpdi]
                : s.includes("Document")
                  ? [SOURCES.production]
                  : [],
  );
  return (
    <>
      <PageHeader
        title="Automated Report Generation"
        subtitle="Assemble source-backed executive, operational and parliamentary report drafts."
        actions={<StatusBadge status="Illustrative" />}
      />
      <div className="mb-5 grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => !busy && setStep(i)}
            className={`flex items-center gap-2 rounded-lg border p-3 text-left text-xs ${step === i ? "border-primary bg-accent/40 text-foreground" : i < step ? "bg-muted/50 text-foreground" : "text-muted-foreground"}`}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px]">
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <Panel
          title={steps[step]}
          action={<span className="text-xs text-muted-foreground">Step {step + 1} of 4</span>}
        >
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {REPORT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-xl border p-4 text-left transition hover:border-primary/60 ${type === t ? "border-primary bg-accent/40" : ""}`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-primary" />
                    {t}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {t === "Parliamentary Response"
                      ? "Formal, cited answer with validation notice"
                      : `Generate a traceable ${t.toLowerCase()} from local datasets`}
                  </div>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {REPORT_SOURCES.map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${sources.includes(s) ? "border-primary bg-accent/30" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={sources.includes(s)}
                    onChange={() => toggle(s)}
                    className="accent-amber-500"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {["FY2023-24", "FY2024-25", "FY2025-26", "Custom"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg border p-5 text-left text-sm font-medium ${period === p ? "border-primary bg-accent/40" : ""}`}
                >
                  {p}
                  <div className="mt-1 text-xs font-normal text-muted-foreground">
                    {p === "FY2025-26"
                      ? "Provisional year-to-date values"
                      : p === "Custom"
                        ? "Select a custom reporting range"
                        : "Annual source dataset"}
                  </div>
                </button>
              ))}
            </div>
          )}
          {step === 3 && !busy && !report && (
            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="text-lg font-semibold">Ready to generate</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {type} · {period} · {sources.length} selected sources
              </div>
              <Button className="mt-5" onClick={() => void generate()}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate report
              </Button>
            </div>
          )}
          {busy && (
            <div className="space-y-3 py-6">
              {phases.map((p, i) => (
                <div
                  key={p}
                  className={`flex items-center gap-3 text-sm ${i <= phase ? "text-foreground" : "text-muted-foreground/50"}`}
                >
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border ${i < phase ? "border-success text-success" : i === phase ? "border-primary text-primary" : ""}`}
                  >
                    {i < phase ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : i === phase ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {p}
                </div>
              ))}
            </div>
          )}
          {report && !busy && (
            <div className="space-y-4">
              <div className="no-print flex flex-wrap justify-between gap-2">
                <div>
                  <StatusBadge status="Needs Validation" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Draft generated and saved in this browser.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setReport(null); setStep(0); setEditing(false); }}>
                    New report
                  </Button>
                  {parliament && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        {editing ? "Preview edit" : "Edit response"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(draft)}
                      >
                        <Copy className="mr-1.5 h-4 w-4" />
                        Copy
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="mr-1.5 h-4 w-4" />
                    Print / PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportCSV}>
                    <Download className="mr-1.5 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
              <article className="report-paper space-y-5 rounded-xl border bg-white p-6 text-slate-900 shadow-sm md:p-10">
                <header className="border-b-2 border-amber-500 pb-4">
                  <div className="font-mono text-xs font-bold tracking-[.2em] text-slate-500">
                    COALINTEL AI
                  </div>
                  <h2 className="mt-3 text-2xl font-bold">{title}</h2>
                  <div className="mt-1 text-sm text-slate-500">
                    {period} · Prepared {new Date().toLocaleDateString()} · Prototype Reference: {referenceNo}
                  </div>
                </header>
                {parliament ? (
                  <>
                    <section>
                      <div className="text-xs font-bold tracking-widest text-amber-700">
                        AI-ASSISTED DRAFT
                      </div>
                      <h3 className="mt-3 font-semibold">Question</h3>
                      <p className="mt-1 text-sm">
                        What was India's total coal production during FY2024-25 compared with
                        FY2023-24?
                      </p>
                      <h3 className="mt-4 font-semibold">Answer</h3>
                      {editing ? (
                        <Textarea className="mt-2 min-h-32 text-sm" value={draft} onChange={(e) => setDraft(e.target.value)} />
                      ) : (
                        <p className="mt-1 text-sm leading-7">{draft}</p>
                      )}
                    </section>
                    <section>
                      <h3 className="font-semibold">Supporting data</h3>
                      <DataTable type="Parliamentary Response" />
                    </section>
                  </>
                ) : (
                  <>
                    <section>
                      <h3 className="font-semibold">Executive summary</h3>
                      <p className="mt-1 text-sm leading-7">
                        India's reported coal production reached 1,047.52 MT in FY2024-25,
                        increasing from 997.25 MT in FY2023-24. Coal imports were 243.62 MT, down
                        from 264.53 MT in the prior year. Reported sector demand was 1,267.13 MT,
                        led by power utilities. Figures reflect the selected source records; any
                        illustrative allocations are identified separately.
                      </p>
                    </section>
                    <section>
                      <h3 className="mb-2 font-semibold">Key performance indicators</h3>
                      <DataTable type={type} />
                    </section>
                    <section>
                      <h3 className="font-semibold">Key findings</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Production grew by 50.27 MT (about 5.0%) year over year.</li>
                        <li>Coal imports declined by 20.91 MT (about 7.9%).</li>
                        <li>Power utilities account for the largest recorded demand segment.</li>
                      </ul>
                    </section>
                  </>
                )}
                <section>
                  <h3 className="mb-2 font-semibold">Source references</h3>
                  <div className="flex flex-wrap gap-2">
                    {sourceRefs.map((s) => (
                      <SourceCitation key={s.id} source={s} />
                    ))}
                  </div>
                </section>
                <section className="border-t pt-3">
                  <div className="text-sm font-semibold text-amber-800">
                    AI-Assisted Draft — Requires Human Validation
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Validation status: pending analyst review. Confirm all values against cited
                    source records before official use.
                  </div>
                </section>
              </article>
            </div>
          )}
          {!report && !busy && (
            <div className="mt-6 flex justify-between border-t pt-4">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep(Math.max(0, step - 1))}
              >
                Back
              </Button>
              {step < 3 && (
                <Button
                  disabled={step === 1 && sources.length === 0}
                  onClick={() => (step === 2 ? (setStep(3), void generate()) : setStep(step + 1))}
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {step === 3 && (
                <Button onClick={() => void generate()}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              )}
            </div>
          )}
        </Panel>
        <div className="space-y-4">
          <Panel title="Configuration">
            <div className="space-y-3 text-xs">
              <Pair label="Report type" value={type} />
              <Pair label="Period" value={period} />
              <Pair label="Sources" value={`${sources.length} selected`} />
            </div>
          </Panel>
          <Panel title="Recent reports">
            <div className="space-y-2">
              {history.slice(0, 5).map((r) => (
                <Link
                  key={r.id}
                  to="/reports/$id"
                  params={{ id: r.id }}
                  className="block rounded-lg border p-3 hover:border-primary/50"
                >
                  <div className="text-xs font-medium">{r.title}</div>
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>{r.createdAt}</span>
                    <span>{r.validation}</span>
                  </div>
                </Link>
              ))}
            </div>
            {history.length === 0 && <EmptyState title="No reports yet" />}
          </Panel>
        </div>
      </div>
    </>
  );
}
function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
function DataTable({ type }: { type: string }) {
  const rows =
    type === "Financial Report"
      ? [
          ["Revenue from Operations", "₹2,102.76 crore", "Actual"],
          ["Total Income", "₹2,177.53 crore", "Actual"],
          ["Total Expenses", "₹1,295.39 crore", "Actual"],
          ["PBT", "₹882.14 crore", "Actual"],
          ["PAT", "₹666.91 crore", "Actual"],
        ]
      : [
          ["Coal production", "1,047.52 MT", "Actual"],
          ["Prior year production", "997.25 MT", "Actual"],
          ["Coal imports", "243.62 MT", "Actual"],
          ["Coal demand", "1,267.13 MT", "Actual"],
        ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-y bg-slate-50 text-xs">
          <tr>
            {["Metric", "Value", "Status"].map((x) => (
              <th className="px-3 py-2" key={x}>
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b">
              <td className="px-3 py-2">{r[0]}</td>
              <td className="px-3 py-2 font-mono">{r[1]}</td>
              <td className="px-3 py-2">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
