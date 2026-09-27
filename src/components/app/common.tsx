import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden>
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.9 3.8L12 12 5.1 8.1 12 4.3Z" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-[15px] font-semibold tracking-[0.08em]">COALINTEL AI</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-60">Reporting Intelligence</div>
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-foreground">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DemoTag({ label = "Demo Data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded border border-dashed border-primary/60 bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
      {label}
    </span>
  );
}

const tones: Record<string, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/15 text-accent-foreground border-warning/40",
  error: "bg-destructive/10 text-destructive border-destructive/25",
  info: "bg-chart-3/10 text-chart-3 border-chart-3/25",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-accent text-accent-foreground border-primary/30",
};

const STATUS_TONE: Record<string, keyof typeof tones> = {
  Validated: "success", Processed: "success", Published: "success", Passed: "success", Actual: "success",
  Processing: "info", Uploaded: "neutral", Generated: "info", Draft: "neutral",
  "Needs Validation": "warning", "Review Required": "warning", "Under Review": "warning", Pending: "warning", Partial: "warning",
  Provisional: "primary", Target: "info", Projection: "info", Illustrative: "neutral",
  Failed: "error", Conflict: "error", "Missing Source": "error",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = tones[STATUS_TONE[status] ?? "neutral"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium", tone, className)}>
      {status === "Processing" ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status}
    </span>
  );
}

export function Panel({ title, action, children, className, bodyClassName }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn("animate-fade-up rounded-xl border bg-card text-card-foreground", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          <h3 className="text-sm font-semibold">{title}</h3>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
      <Inbox className="mb-3 h-8 w-8 text-muted-foreground/60" />
      <div className="text-sm font-medium">{title}</div>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <AlertTriangle className="mb-3 h-7 w-7 text-destructive" />
      <div className="text-sm font-medium">{message}</div>
      {onRetry && (
        <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
