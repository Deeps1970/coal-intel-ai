import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/app/common";
import { DEMO_PASSWORD, DEMO_USER, signIn, signInDemo } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — COALINTEL AI" },
      { name: "description", content: "Sign in to COALINTEL AI or continue in demo mode to explore the coal intelligence platform." },
      { property: "og:title", content: "Sign in — COALINTEL AI" },
      { property: "og:description", content: "Turn coal sector data into actionable intelligence." },
    ],
  }),
  component: LoginPage,
});

const PIPE = ["Ingest", "Extract", "Validate", "Analyze", "Query", "Report"];

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"form" | "demo" | null>(null);

  const finish = () => setTimeout(() => nav({ to: "/dashboard" }), 500);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      <div className="relative flex flex-col justify-between overflow-hidden bg-sidebar p-8 text-sidebar-accent-foreground md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(var(--sidebar-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--sidebar-foreground) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
        />
        <div className="relative flex items-center justify-between">
          <Logo />
          <span className="rounded border border-sidebar-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-sidebar-primary">SIH 2026 Prototype • PS 26023</span>
        </div>
        <div className="relative my-16 max-w-xl">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-sidebar-primary">AI-Powered Geological, Mining & Reporting Intelligence</div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">Turn Coal Sector Data Into Actionable Intelligence</h1>
          <p className="mt-5 max-w-lg text-base text-sidebar-foreground/75">
            AI-assisted document processing, analytics, reporting and knowledge retrieval for geological and mining information.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {PIPE.map((p, i) => (
              <span key={p} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
                <span className="rounded border border-sidebar-border bg-sidebar-accent px-2.5 py-1.5">{p}</span>
                {i < PIPE.length - 1 && <span className="text-sidebar-primary">→</span>}
              </span>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-sidebar-foreground/50">
          Independent hackathon prototype. Not an official Ministry of Coal or Coal India Limited product. Figures are source-derived demo data.
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">Access the coal intelligence workspace.</p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              setBusy("form");
              setTimeout(() => {
                if (signIn(email, password)) finish();
                else {
                  setBusy(null);
                  setError("Invalid credentials. Use the demo credentials below or continue with demo.");
                }
              }, 500);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organisation.in" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={!!busy}>
              {busy === "form" ? <Loader2 className="animate-spin" /> : <ArrowRight />} Sign In
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" disabled={!!busy} onClick={() => { setBusy("demo"); signInDemo(); finish(); }}>
            {busy === "demo" ? <Loader2 className="animate-spin" /> : <PlayCircle />} Continue with Demo
          </Button>
          <div className="mt-6 rounded-lg border border-dashed border-primary/50 bg-accent/60 p-4 text-xs">
            <div className="mb-1.5 font-mono font-semibold uppercase tracking-wider text-accent-foreground">Demo Mode</div>
            <p className="text-muted-foreground">No external accounts or API keys required.</p>
            <button type="button" className="mt-2 font-mono text-foreground hover:underline" onClick={() => { setEmail(DEMO_USER.email); setPassword(DEMO_PASSWORD); }}>
              {DEMO_USER.email} / {DEMO_PASSWORD}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
