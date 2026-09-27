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
        <div className="no-print flex min-h-7 items-center justify-center gap-2 border-b bg-muted/50 px-4 text-center text-[10px] text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-primary">Demo Mode</span>
          <span>SIH 2026 Prototype · PS 26023 · Not an official Government / Ministry / CIL / CMPDI system</span>
        </div>
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main key={path} className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-5 md:px-7 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
