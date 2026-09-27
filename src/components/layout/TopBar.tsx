import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getNotifications } from "@/services/intel";
import { DEMO_USER, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "./GlobalSearch";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard", documents: "Documents", data: "Structured Data", validation: "Data Validation",
  analytics: "Analytics", "ai-assistant": "AI Assistant", topics: "Topics & Word Cloud", reports: "Reports",
  settings: "Settings", entities: "Entities",
};

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const parts = path.split("/").filter(Boolean);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notes, setNotes] = useState(getNotifications);
  const nav = useNavigate();
  const unread = notes.filter((n) => !n.read).length;

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">COALINTEL</Link>
        {parts.map((p, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            <span className="text-muted-foreground/50">/</span>
            <span className={cn("truncate", i === parts.length - 1 ? "font-medium" : "text-muted-foreground")}>{LABELS[p] ?? p}</span>
          </span>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-9 items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 md:w-72"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search across all intelligence…</span>
          <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-mono text-[10px] md:inline">⌘K</kbd>
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5" />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{unread}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Notifications</span>
              <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setNotes((n) => n.map((x) => ({ ...x, read: true })))}>
                Mark all read
              </button>
            </div>
            <ul className="max-h-80 divide-y overflow-y-auto">
              {notes.map((n) => (
                <li key={n.id} className={cn("flex gap-3 px-4 py-3 text-sm", !n.read && "bg-accent/40")}>
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", { success: "bg-success", warning: "bg-warning", info: "bg-chart-3", error: "bg-destructive" }[n.tone])} />
                  <div>
                    <div className="leading-snug">{n.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{n.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-semibold">DU</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>{DEMO_USER.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{DEMO_USER.role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => nav({ to: "/settings" })}><User /> Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => nav({ to: "/settings" })}><Settings /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { signOut(); nav({ to: "/login" }); }}><LogOut /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
