import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Ingest", to: "/documents" },
  { label: "Extract", to: "/documents" },
  { label: "Validate", to: "/validation" },
  { label: "Analyze", to: "/analytics" },
  { label: "Query", to: "/ai-assistant" },
  { label: "Report", to: "/reports" },
] as const;

export function WorkflowStrip({ active, className }: { active?: (typeof STEPS)[number]["label"]; className?: string }) {
  return (
    <nav aria-label="Workflow" className={cn("flex flex-wrap items-center gap-1 text-[11px] font-mono uppercase tracking-wider", className)}>
      {STEPS.map((s, i) => (
        <span key={s.label} className="flex items-center gap-1">
          <Link
            to={s.to}
            className={cn(
              "rounded px-2 py-1 transition-colors",
              active === s.label ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {String(i + 1).padStart(2, "0")} {s.label}
          </Link>
          {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
        </span>
      ))}
    </nav>
  );
}
