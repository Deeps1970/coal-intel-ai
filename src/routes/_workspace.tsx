import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { isSignedIn } from "@/lib/auth";

export const Route = createFileRoute("/_workspace")({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isSignedIn()) nav({ to: "/login" });
  }, [nav]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block", collapsed ? "w-[68px]" : "w-64")}>
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="no-print flex items-center justify-center gap-2 bg-sidebar px-4 py-1 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-sidebar-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sidebar-primary" />
          <span className="font-semibold text-sidebar-primary">Demo Mode</span>
          <span className="hidden opacity-70 sm:inline">• SIH 2026 Prototype • PS 26023 • Source-derived demo datasets, not live data</span>
        </div>
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main key={path} className="animate-fade-up mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
