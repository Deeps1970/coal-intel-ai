import { Link } from "@tanstack/react-router";
import {
  BarChart3, Bot, CheckCheck, ChevronsLeft, ChevronsRight, Cloud, Database, FileStack, FileText, LayoutDashboard, Settings, Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/app/common";
import { DEMO_USER } from "@/lib/auth";

export const NAV = [
  { section: "Overview", items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Data & Documents",
    items: [
      { to: "/documents", label: "Documents", icon: FileStack },
      { to: "/data", label: "Structured Data", icon: Database },
      { to: "/validation", label: "Data Validation", icon: CheckCheck },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
      { to: "/topics", label: "Topics & Word Cloud", icon: Cloud },
    ],
  },
  {
    section: "Reporting",
    items: [
      { to: "/reports", label: "Report Generator", icon: Wand2, search: { tab: "generate" } },
      { to: "/reports", label: "Generated Reports", icon: FileText, search: { tab: "history" } },
    ],
  },
  { section: "System", items: [{ to: "/settings", label: "Settings", icon: Settings }] },
] as const;

export function AppSidebar({ collapsed, onToggle, onNavigate }: { collapsed: boolean; onToggle?: () => void; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
        <Logo compact={collapsed} className="text-sidebar-accent-foreground" />
      </div>
      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        {NAV.map((g) => (
          <div key={g.section} className="mb-5">
            {!collapsed && <div className="mb-1.5 px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/45">{g.section}</div>}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      search={"search" in it ? it.search : undefined}
                      onClick={onNavigate}
                      title={collapsed ? it.label : undefined}
                      activeOptions={{ exact: false, includeSearch: "search" in it }}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        collapsed && "justify-center",
                      )}
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground [&_svg]:text-sidebar-primary" }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{it.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-primary">DU</div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-sidebar-accent-foreground">{DEMO_USER.name}</div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">{DEMO_USER.role}</div>
            </div>
          )}
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md py-1.5 text-[11px] text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
          </button>
        )}
      </div>
    </div>
  );
}
