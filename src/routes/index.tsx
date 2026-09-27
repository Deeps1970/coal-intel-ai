import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isSignedIn } from "@/lib/auth";
import { Logo } from "@/components/app/common";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COALINTEL AI — From scattered reports to trusted intelligence" },
      { name: "description", content: "AI-powered geological, mining and reporting intelligence platform prototype for CMPDI/CIL subsidiaries (SIH 2026, PS 26023)." },
      { property: "og:title", content: "COALINTEL AI — From scattered reports to trusted intelligence" },
      { property: "og:description", content: "Ingest, extract, validate, analyze, query and report on coal sector data." },
    ],
  }),
  component: Index,
});

function Index() {
  const nav = useNavigate();
  useEffect(() => {
    nav({ to: isSignedIn() ? "/dashboard" : "/login", replace: true });
  }, [nav]);
  return (
    <div className="grid min-h-screen place-items-center bg-sidebar text-sidebar-accent-foreground">
      <Logo />
    </div>
  );
}
