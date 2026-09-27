import { AlertTriangle, Check, Circle, Loader2, X } from "lucide-react";
import type { PipelineStage } from "@/types";
import { cn } from "@/lib/utils";

const ICON = {
  done: <Check className="h-3.5 w-3.5" />,
  running: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  pending: <Circle className="h-2.5 w-2.5" />,
  error: <X className="h-3.5 w-3.5" />,
  warning: <AlertTriangle className="h-3.5 w-3.5" />,
};
const TONE = {
  done: "bg-success text-success-foreground border-success",
  running: "bg-chart-3 text-success-foreground border-chart-3",
  pending: "bg-card text-muted-foreground border-border",
  error: "bg-destructive text-destructive-foreground border-destructive",
  warning: "bg-warning text-primary-foreground border-warning",
};

export function Pipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
      {stages.map((s, i) => (
        <li key={s.key} className={cn("relative rounded-lg border bg-card p-3 transition-colors", s.status === "running" && "border-chart-3/50", s.status === "error" && "border-destructive/40")}>
          <div className="flex items-center gap-2">
            <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors", TONE[s.status])}>{ICON[s.status]}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="mt-2 text-[12.5px] font-medium leading-tight">{s.label}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {s.status === "error" ? "Failed — see details" : s.status === "warning" ? "Needs analyst review" : s.status === "pending" ? "Queued" : s.detail}
          </div>
        </li>
      ))}
    </ol>
  );
}
