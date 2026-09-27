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
      { name: "description", content: "Sign in to the COALINTEL AI SIH 2026 prototype." },
      { property: "og:title", content: "Sign in — COALINTEL AI" },
      {
        property: "og:description",
        content: "AI-assisted information management and reporting prototype.",
      },
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
      <div className="relative flex flex-col justify-between border-r bg-muted/35 p-8 text-foreground md:p-12">
        <div className="relative flex items-center justify-between">
          <Logo />
          <span className="rounded-sm border bg-card px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            SIH 2026 Prototype · PS 26023
          </span>
        </div>
        <div className="relative my-16 max-w-xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
            Designed for CMPDI / CIL reporting use case
          </div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight">
            AI-Assisted Geological, Mining & Reporting Information System
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Document management, structured coal-sector data, validation, analytical reports and
            administrative response drafting in one demonstration workflow.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {PIPE.map((p, i) => (
              <span
                key={p}
                className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground"
              >
                <span className="rounded-sm border bg-card px-2.5 py-1.5">{p}</span>
                {i < PIPE.length - 1 && <span className="text-primary">→</span>}
              </span>
            ))}
          </div>
        </div>
        <p className="relative max-w-lg text-xs leading-relaxed text-muted-foreground">
          Independent hackathon prototype. Not an official Ministry of Coal or Coal India Limited
          product. Figures are source-derived demo data.
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Access the coal intelligence workspace.
          </p>
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
                  setError(
                    "Invalid credentials. Use the demo credentials below or continue with demo.",
                  );
                }
              }, 500);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organisation.in"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={!!busy}>
              {busy === "form" ? <Loader2 className="animate-spin" /> : <ArrowRight />} Sign In
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            disabled={!!busy}
            onClick={() => {
              setBusy("demo");
              signInDemo();
              finish();
            }}
          >
            {busy === "demo" ? <Loader2 className="animate-spin" /> : <PlayCircle />} Continue with
            Demo
          </Button>
          <div className="mt-6 rounded-lg border border-dashed border-primary/50 bg-accent/60 p-4 text-xs">
            <div className="mb-1.5 font-mono font-semibold uppercase tracking-wider text-accent-foreground">
              Demo Mode
            </div>
            <p className="text-muted-foreground">No external accounts or API keys required.</p>
            <button
              type="button"
              className="mt-2 font-mono text-foreground hover:underline"
              onClick={() => {
                setEmail(DEMO_USER.email);
                setPassword(DEMO_PASSWORD);
              }}
            >
              {DEMO_USER.email} / {DEMO_PASSWORD}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
