import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Copy,
  Database,
  LoaderCircle,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { AIMessage } from "@/types";
import { SUGGESTED_QUESTIONS, queryAssistant } from "@/services/ai";
import { PageHeader, Panel, StatusBadge, EmptyState } from "@/components/app/common";
import { SourceCitation } from "@/components/app/SourceCitation";
import { SimpleBar } from "@/components/app/charts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { recordAudit } from "@/services/audit";

export const Route = createFileRoute("/_workspace/ai-assistant")({
  head: () => ({ meta: [{ title: "Coal Intelligence Assistant — COALINTEL AI" }] }),
  component: Assistant,
});
const KEY = "coalintel.ai.history.v1";
const initial: AIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "I can answer source-backed questions across the local coal-sector datasets and indexed demo documents. Ask about production, imports, demand, CMPDI financials or annual-report topics.",
  },
];
function Assistant() {
  const [messages, setMessages] = useState<AIMessage[]>(initial);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(0);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setMessages(JSON.parse(saved) as AIMessage[]);
    } catch {
      /* use welcome message */
    }
  }, []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, phase]);
  const save = (rows: AIMessage[]) => {
    setMessages(rows);
    localStorage.setItem(KEY, JSON.stringify(rows));
  };
  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    recordAudit("Submitted information query", "AI Query & Response", q.slice(0, 80), "Completed");
    save([...messages, { id: crypto.randomUUID(), role: "user", content: q }]);
    setInput("");
    setBusy(true);
    setPhase(0);
    const timer = window.setInterval(() => setPhase((p) => Math.min(p + 1, 3)), 320);
    try {
      const response = await queryAssistant(q);
      save([...messages, { id: crypto.randomUUID(), role: "user", content: q }, response]);
    } catch {
      save([
        ...messages,
        { id: crypto.randomUUID(), role: "user", content: q },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "The demo knowledge service could not complete the query. Please try again.",
        },
      ]);
    } finally {
      clearInterval(timer);
      setBusy(false);
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };
  const phases = [
    "Analyzing query…",
    "Retrieving relevant data…",
    "Checking source records…",
    "Preparing response…",
  ];
  return (
    <>
      <PageHeader
        title="AI Query & Response"
        subtitle="Natural-language access to source-linked coal-sector information. Generated interpretations require human review."
        actions={<StatusBadge status="Illustrative" />}
      />
      <Panel title="Submit information query" className="mb-4" action={<span className="text-xs text-muted-foreground">Local prototype knowledge base · no external API</span>}>
        <form onSubmit={submit}>
          <div className="flex items-end gap-2">
            <Textarea aria-label="Information query" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a question about production, imports, demand, CMPDI financials or indexed documents" rows={3} className="max-h-32 resize-y" />
            <Button type="submit" disabled={busy || !input.trim()}><Send className="mr-2 h-4 w-4" />Submit query</Button>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground"><Database className="h-3 w-3" />Responses use supported local data; unsupported requests receive no invented figures.</div>
        </form>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <Panel className="flex min-h-[440px] flex-col" bodyClassName="flex flex-1 flex-col p-0">
          <div className="flex items-center gap-3 border-b px-5 py-3">
            <div className="flex-1">
              <div className="text-sm font-semibold">Query and response register</div>
              <div className="text-xs text-muted-foreground">Responses and source references for this session</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => save(initial)}>
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Clear history
            </Button>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
            {messages.length === 1 && (
              <div className="mx-auto max-w-2xl pt-6">
                <h2 className="text-sm font-semibold">Suggested queries</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Answers are deterministic and linked to local source records.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.slice(0, 6).map((q) => (
                    <button
                      key={q}
                      onClick={() => void ask(q)}
                      className="rounded-lg border bg-card p-3 text-left text-xs transition hover:border-primary/50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <article
                key={m.id}
                className="rounded-md border bg-card p-4"
              >
                <div className="space-y-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{m.role === "user" ? "Submitted query" : "Response"}</div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {m.content.replaceAll("**", "")}
                  </div>
                  {m.role === "assistant" && m.meta && (
                    <div className="space-y-3 rounded-xl border bg-muted/20 p-3 text-left">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Meta label="Period" value={m.meta.period} />
                        <Meta label="Dataset" value={m.meta.dataset} />
                        <Meta label="Confidence" value={`${m.meta.confidence}%`} />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StatusBadge status={m.meta.status} />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigator.clipboard.writeText(m.content)}
                          >
                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                            Copy answer
                          </Button>
                          {m.sources?.map((s) => (
                            <SourceCitation key={s.id} source={s} variant="link">
                              View source
                            </SourceCitation>
                          ))}
                        </div>
                      </div>
                      {m.table && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b">
                                {m.table.columns.map((c) => (
                                  <th
                                    key={c}
                                    className="px-2 py-2 text-left font-medium text-muted-foreground"
                                  >
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {m.table.rows.map((r, i) => (
                                <tr key={i} className="border-b last:border-0">
                                  {r.map((v, j) => (
                                    <td key={j} className="px-2 py-2">
                                      {v}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {m.chart && (
                        <div className="h-48">
                          <SimpleBar
                            data={m.chart.data}
                            x={m.chart.xKey}
                            series={m.chart.keys.map((k) => ({ key: k, name: k }))}
                          />
                        </div>
                      )}
                      {m.docs?.map((d) => (
                        <Link
                          key={d.id}
                          to="/documents/$id"
                          params={{ id: d.id }}
                          className="block text-xs text-accent-foreground underline"
                        >
                          {d.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {busy && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                <span>{phases[phase]}</span>
              </div>
            )}
            <div ref={bottom} />
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel title="Suggested questions">
            <div className="space-y-1">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => void ask(q)}
                  className="flex w-full gap-2 rounded-md p-2 text-left text-xs hover:bg-muted"
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {q}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Knowledge coverage">
            <ul className="space-y-2 text-xs text-muted-foreground">
              {[
                "Production and subsidiary summaries",
                "Coal imports and demand",
                "Dispatch and lignite demo data",
                "CMPDI financials",
                "Annual-report topic index",
                "Parliamentary response drafts",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-success">●</span>
                  {x}
                </li>
              ))}
            </ul>
          </Panel>
          <EmptyState
            title="Source-first responses"
            description="Each supported answer includes its period, status and source reference."
          />
        </div>
      </div>
    </>
  );
}
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs font-medium">{value}</div>
    </div>
  );
}
