import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusBadge, EmptyState } from "@/components/app/common";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { ACTIVITY } from "@/data/misc";
import { download } from "@/services/datasets";
import { listAuditEntries, type AuditEntry } from "@/services/audit";

export const Route = createFileRoute("/_workspace/audit-trail")({
  head: () => ({ meta: [{ title: "Audit Trail — COALINTEL AI" }] }),
  component: AuditTrail,
});

function AuditTrail() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => setEntries(listAuditEntries()), []);
  const rows = useMemo(() => {
    const generated = entries.map((e) => ({
      ...e,
      displayTime: new Date(e.timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));
    const samples = ACTIVITY.map((a, i) => ({
      id: `sample-${i}`,
      timestamp: "2026-09-27",
      displayTime: a.time,
      user: "Demo User",
      action: a.title,
      module: "Prototype Activity",
      reference: "Sample log",
      status: a.tone === "success" ? "Completed" : "Generated",
    }));
    return [...generated, ...samples].filter((r) =>
      `${r.user} ${r.action} ${r.module} ${r.reference} ${r.status}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [entries, query]);
  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Audit Trail"
        subtitle="Browser-local record of prototype uploads, processing, validation, queries and generated reports."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              download(
                "coalintel-audit-trail.csv",
                [
                  "Timestamp,User,Action,Module,Reference,Status",
                  ...rows.map(
                    (r) =>
                      `"${r.displayTime}","${r.user}","${r.action}","${r.module}","${r.reference}","${r.status}"`,
                  ),
                ].join("\n"),
                "text/csv",
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />
      <div className="mb-4 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
        {[
          ["Recorded actions", rows.length],
          ["Stored locally", "This browser"],
          ["Record retention", "Latest 500 events"],
        ].map(([k, v]) => (
          <div key={String(k)} className="bg-card px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
            <div className="mt-1 text-sm font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <Panel
        title="Activity register"
        action={<span className="text-xs text-muted-foreground">{rows.length} entries</span>}
      >
        <div className="mb-3 relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search action, module or reference"
          />
        </div>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="border-y bg-muted/35 text-muted-foreground">
                <tr>
                  {["Timestamp", "User", "Action", "Module", "Reference", "Status"].map((h) => (
                    <th key={h} className="px-3 py-2.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono">{r.displayTime}</td>
                    <td className="px-3 py-2.5">{r.user}</td>
                    <td className="px-3 py-2.5 font-medium">{r.action}</td>
                    <td className="px-3 py-2.5">{r.module}</td>
                    <td className="px-3 py-2.5 font-mono">{r.reference}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No activity matches"
            description="Clear the search or complete an action in the prototype."
          />
        )}
      </Panel>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Audit entries are demo records stored in browser local storage. They are not tamper-proof or
        part of an official audit system.
      </p>
    </>
  );
}
