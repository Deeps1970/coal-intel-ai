import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, FileWarning, MessageSquarePlus, Search, ShieldCheck } from "lucide-react";
import { VALIDATION } from "@/data/misc";
import type { ValidationRecord } from "@/types";
import { PageHeader, Panel, StatusBadge, EmptyState } from "@/components/app/common";
import { SourceCitation } from "@/components/app/SourceCitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_workspace/validation")({ head: () => ({ meta: [{ title: "Data Validation & Traceability — COALINTEL AI" }] }), component: ValidationPage });
const KEY = "coalintel.validation.v1";
function ValidationPage() {
  const [rows, setRows] = useState<ValidationRecord[]>(VALIDATION);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All issues");
  useEffect(() => { try { const saved = localStorage.getItem(KEY); if (saved) setRows(JSON.parse(saved) as ValidationRecord[]); } catch { /* use bundled demo records */ } }, []);
  const update = (next: ValidationRecord[]) => { setRows(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  const filtered = useMemo(() => rows.filter((r) => (filter === "All issues" || r.status === filter) && `${r.record} ${r.entity} ${r.status}`.toLowerCase().includes(query.toLowerCase())), [rows, filter, query]);
  const count = (s: string) => rows.filter((r) => r.status === s).length;
  const act = (row: ValidationRecord, action: "review" | "resolve" | "note") => {
    const note = action === "note" ? window.prompt("Add an analyst note:") : null;
    if (action === "note" && note === null) return;
    update(rows.map((r) => r.id !== row.id ? r : { ...r, status: action === "resolve" ? "Validated" : r.status, history: [...r.history, { at: new Date().toLocaleString(), by: "Demo User", action: action === "review" ? "Marked reviewed by analyst" : action === "resolve" ? "Resolved by analyst" : `Note: ${note}` }] }));
  };
  return <>
    <PageHeader title="Data Validation & Traceability" subtitle="Review source alignment, extraction confidence and record conflicts." actions={<Button variant="outline" onClick={() => update(VALIDATION)}><ShieldCheck className="mr-2 h-4 w-4"/>Reset demo issues</Button>} />
    <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">{[
      ["Total records", rows.length, "neutral"], ["Validated", count("Validated"), "success"], ["Review required", count("Review Required"), "warning"], ["Conflicts", count("Conflict"), "error"], ["Missing source", count("Missing Source"), "error"],
    ].map(([label, value, tone]) => <div key={String(label)} className="rounded-xl border bg-card p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><FileWarning className="h-3.5 w-3.5"/>{label}</div><div className={`mt-2 text-2xl font-semibold tabular ${tone === "success" ? "text-success" : tone === "error" ? "text-destructive" : tone === "warning" ? "text-accent-foreground" : ""}`}>{value}</div></div>)}
    </div>
    <Panel title="Validation queue" action={<span className="text-xs text-muted-foreground">{filtered.length} records</span>}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search record, entity or status" /></div><select className="h-10 rounded-md border bg-background px-3 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>{["All issues", "Review Required", "Conflict", "Missing Source", "Validated"].map((s) => <option key={s}>{s}</option>)}</select></div>
      {filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[1160px] text-left text-xs"><thead className="border-y bg-muted/40 text-muted-foreground"><tr>{["Record / entity", "Dataset · field", "Issue", "Severity", "Current value", "Expected", "Source", "Status", "Actions"].map((h) => <th className="px-3 py-2.5 font-medium" key={h}>{h}</th>)}</tr></thead><tbody className="divide-y">{filtered.map((r) => <tr key={r.id} className="align-top hover:bg-muted/20"><td className="px-3 py-3"><div className="font-medium">{r.record}</div><div className="mt-1 text-muted-foreground">{r.entity}</div></td><td className="px-3 py-3"><div>{r.source.document.includes("CMPDI") ? "CMPDI Financials" : r.record.toLowerCase().includes("dispatch") ? "Coal Dispatch" : r.record.toLowerCase().includes("demand") ? "Coal Demand" : "Coal Production"}</div><div className="mt-1 text-muted-foreground">{r.record}</div></td><td className="max-w-[200px] px-3 py-3 text-muted-foreground">{r.status === "Conflict" ? "Extracted value differs from reference" : r.status === "Missing Source" ? "No reference dataset available" : r.status === "Review Required" ? "Provisional value needs analyst review" : "Source value matched reference"}</td><td className="px-3 py-3">{r.status === "Conflict" || r.status === "Missing Source" ? <span className="font-medium text-destructive">High</span> : r.status === "Review Required" ? <span className="font-medium text-accent-foreground">Medium</span> : <span className="text-muted-foreground">—</span>}</td><td className="px-3 py-3 font-mono">{r.extracted}</td><td className="px-3 py-3 font-mono">{r.expected}</td><td className="px-3 py-3"><SourceCitation source={r.source} variant="link">View source</SourceCitation></td><td className="px-3 py-3"><StatusBadge status={r.status}/></td><td className="px-3 py-3"><div className="flex gap-1"><Button title="View issue details" size="icon" variant="ghost" onClick={() => window.alert(`${r.record} — ${r.entity}\n\n${r.extractedText}\n\nConfidence: ${r.confidence}%\nHistory: ${r.history.map((h) => h.action).join("; ")}`)}><Eye className="h-3.5 w-3.5"/></Button><Button title="Mark reviewed" size="icon" variant="ghost" onClick={() => act(r,"review")}><Check className="h-3.5 w-3.5"/></Button><Button title="Resolve issue" size="icon" variant="ghost" onClick={() => act(r,"resolve")}><ShieldCheck className="h-3.5 w-3.5"/></Button><Button title="Add note" size="icon" variant="ghost" onClick={() => act(r,"note")}><MessageSquarePlus className="h-3.5 w-3.5"/></Button></div></td></tr>)}</tbody></table></div> : <EmptyState title="No records found" description="Adjust your search or status filter."/>}
    </Panel>
    <p className="mt-3 text-[11px] text-muted-foreground">Changes are stored in this browser for the demo. Resolving a record marks it validated and appends an audit entry.</p>
  </>;
}
