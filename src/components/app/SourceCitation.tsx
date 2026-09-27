import { useState, type ReactNode } from "react";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { SourceReference } from "@/types";
import { StatusBadge } from "./common";

export function SourceDetails({ source }: { source: SourceReference }) {
  const rows: [string, ReactNode][] = [
    ["Source document", source.document],
    ["Section", source.section ?? "—"],
    ["Page / reference", [source.page && `Page ${source.page}`, source.table].filter(Boolean).join(" • ") || "—"],
    ["Reporting period", source.period],
    ["Data status", <StatusBadge key="s" status={source.status} />],
    ["Confidence", `${source.confidence.toFixed(1)}%`],
  ];
  return (
    <div className="space-y-4">
      <dl className="divide-y rounded-lg border text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {source.excerpt && (
        <blockquote className="rounded-lg border-l-2 border-primary bg-muted/60 px-4 py-3 text-sm italic text-muted-foreground">
          “{source.excerpt}”
        </blockquote>
      )}
    </div>
  );
}

export function SourceCitation({ source, children, variant = "chip" }: { source: SourceReference; children?: ReactNode; variant?: "chip" | "link" }) {
  const [open, setOpen] = useState(false);
  const label = `${source.document}${source.page ? ` • Page ${source.page}` : ""}${source.table ? ` • ${source.table}` : ""}`;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === "chip"
            ? "inline-flex max-w-full items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            : "text-xs font-medium text-accent-foreground underline-offset-2 hover:underline"
        }
      >
        {variant === "chip" && <FileText className="h-3 w-3 shrink-0" />}
        <span className="truncate">{children ?? `Source: ${label}`}</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Source reference</DialogTitle>
            <DialogDescription>Traceability details for this data point.</DialogDescription>
          </DialogHeader>
          <SourceDetails source={source} />
        </DialogContent>
      </Dialog>
    </>
  );
}
