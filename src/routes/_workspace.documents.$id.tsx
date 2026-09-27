import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, LoadingBlock, Panel, StatusBadge } from "@/components/app/common";
import { Pipeline } from "@/components/app/Pipeline";
import { SourceCitation } from "@/components/app/SourceCitation";
import { getDocument, processDocument, setDocumentStatus } from "@/services/documents";
import type { CoalDocument, SourceReference } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_workspace/documents/$id")({
  head: () => ({
    meta: [
      { title: "Document Viewer — COALINTEL AI" },
      { name: "description", content: "Processing pipeline, extracted text, tables, entities and AI summary for a coal sector document." },
      { property: "og:title", content: "Document Viewer — COALINTEL AI" },
      { property: "og:description", content: "Source-traceable document extraction results." },
    ],
  }),
  component: DocumentDetail,
});

function DocumentDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: doc, isLoading, isError, refetch } = useQuery({ queryKey: ["document", id], queryFn: () => getDocument(id) });
  const [page, setPage] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  // Advance simulated pipeline while processing.
  useEffect(() => {
    if (doc?.status !== "Processing") return;
    const t = setTimeout(async () => {
      await processDocument(id);
      qc.invalidateQueries({ queryKey: ["document", id] });
      qc.invalidateQueries({ queryKey: ["documents"] });
    }, 1400);
    return () => clearTimeout(t);
  }, [doc, id, qc]);

  if (isLoading) return <LoadingBlock rows={8} />;
  if (isError || !doc) return <ErrorState message="Document not found or failed to load." onRetry={() => refetch()} />;

  const jump = (p?: number) => {
    if (!p) return;
    setPage(Math.min(p, doc.pages));
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const srcFor = (ref: string, p?: number): SourceReference => ({
    id: ref, document: doc.name, page: p, table: ref.split("•")[1]?.trim(), period: "As reported", status: "Actual", confidence: doc.accuracy ?? 0, excerpt: doc.excerpt.slice(0, 180),
  });
  const setStatus = async (s: CoalDocument["status"]) => {
    await setDocumentStatus(id, s);
    toast.success(`Document marked as ${s}`);
    qc.invalidateQueries({ queryKey: ["document", id] });
    qc.invalidateQueries({ queryKey: ["documents"] });
  };

  const overview: [string, React.ReactNode][] = [
    ["Source", doc.source],
    ["Upload date", doc.uploadedAt],
    ["Status", <StatusBadge key="s" status={doc.status} />],
    ["Confidence", doc.accuracy != null ? `${doc.accuracy.toFixed(1)}%` : "—"],
    ["Pages", doc.pages],
    ["Extracted records", doc.records.toLocaleString()],
    ["Detected entities", doc.entities.length],
    ["Topics", doc.topics.join(", ") || "—"],
  ];

  return (
    <>
      <Link to="/documents" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Documents</Link>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-foreground">{doc.category} • {doc.type}</div>
          <h1 className="break-words text-2xl font-semibold tracking-tight">{doc.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {doc.status === "Failed" && <Button variant="outline" onClick={() => toast.info("Re-upload the file with consistent units to retry.")}><RotateCw /> Retry</Button>}
          {(doc.status === "Needs Validation" || doc.status === "Processed") && <Button variant="outline" onClick={() => setStatus("Validated")}><CheckCircle2 /> Mark Validated</Button>}
          <Button asChild><Link to="/ai-assistant"><Bot /> Ask AI about this</Link></Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4 xl:grid-cols-8">
        {overview.map(([k, v]) => (
          <div key={k} className="bg-card px-4 py-3">
            <div className="text-[11px] text-muted-foreground">{k}</div>
            <div className="mt-1 truncate text-sm font-medium">{v}</div>
          </div>
        ))}
      </div>

      <Panel title="Processing Pipeline" className="mb-6" action={doc.status === "Processing" ? <span className="text-xs text-chart-3">Live — advancing…</span> : null}>
        <Pipeline stages={doc.pipeline} />
        {doc.status === "Failed" && <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">Processing error: {doc.summary}</p>}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <div ref={previewRef}>
          <Panel title="Document Preview" action={<span className="font-mono text-xs text-muted-foreground">Page {page} / {doc.pages}</span>} bodyClassName="bg-muted/40 p-4">
            <div className="mx-auto aspect-[1/1.3] max-w-md overflow-hidden rounded-md bg-card p-8 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center justify-between border-b pb-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <span className="truncate">{doc.source}</span><span>p.{page}</span>
              </div>
              <p className="whitespace-pre-line text-[11px] leading-relaxed">{doc.excerpt}</p>
              {doc.tables[0] && (
                <table className="mt-5 w-full border text-[9.5px]">
                  <caption className="mb-1 text-left font-semibold">{doc.tables[0].caption}</caption>
                  <thead className="bg-muted"><tr>{doc.tables[0].columns.map((c) => <th key={c} className="border px-1.5 py-1 text-left">{c}</th>)}</tr></thead>
                  <tbody>{doc.tables[0].rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border px-1.5 py-1">{c}</td>)}</tr>)}</tbody>
                </table>
              )}
              <div className="mt-5 space-y-1.5">{[90, 96, 80, 92, 70].map((w, i) => <div key={i} className="h-1.5 rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button size="sm" variant="outline" disabled={page >= doc.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </Panel>
        </div>

        <Panel title="AI Extracted Information" bodyClassName="p-0">
          <Tabs defaultValue="summary">
            <TabsList className="m-4 mb-0 flex-wrap">
              <TabsTrigger value="summary">AI Summary</TabsTrigger>
              <TabsTrigger value="text">Extracted Text</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="summary" className="space-y-4">
                <p className="text-sm leading-relaxed">{doc.summary}</p>
                <div className="rounded-lg border p-3">
                  <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted-foreground">Confidence</span><span className="tabular font-medium">{doc.accuracy != null ? `${doc.accuracy.toFixed(1)}%` : "Pending"}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-success transition-all" style={{ width: `${doc.accuracy ?? 0}%` }} /></div>
                </div>
                <div>
                  <div className="mb-1.5 text-xs text-muted-foreground">Source references</div>
                  <div className="flex flex-wrap gap-2">
                    {doc.tables.map((t) => <button key={t.ref} onClick={() => jump(Number(t.ref.match(/Page (\d+)/)?.[1]))} className="rounded-md border bg-muted/50 px-2 py-1 font-mono text-[11px] hover:border-primary/50">{t.ref}</button>)}
                    {doc.tables.length === 0 && <span className="text-xs text-muted-foreground">No table references yet.</span>}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">AI-generated summary — requires human validation before use in official reporting.</p>
              </TabsContent>
              <TabsContent value="text">
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 font-sans text-sm leading-relaxed">{doc.excerpt}</pre>
              </TabsContent>
              <TabsContent value="tables" className="space-y-4">
                {doc.tables.length === 0 ? <EmptyState title="No tables extracted" description={doc.status === "Processing" ? "Table extraction is in progress." : "This document contains no detectable tables."} /> : doc.tables.map((t) => (
                  <div key={t.ref}>
                    <div className="mb-2 flex items-center justify-between gap-2"><span className="text-sm font-medium">{t.caption}</span><SourceCitation source={srcFor(t.ref, Number(t.ref.match(/Page (\d+)/)?.[1]))}>{t.ref}</SourceCitation></div>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs"><tr>{t.columns.map((c) => <th key={c} className="px-3 py-2 text-left font-medium">{c}</th>)}</tr></thead>
                        <tbody className="divide-y">{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={cn("px-3 py-2", typeof c === "number" && "tabular text-right")}>{c}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="entities">
                {doc.entities.length === 0 ? <EmptyState title="No entities detected yet" /> : (
                  <ul className="divide-y rounded-lg border">
                    {doc.entities.map((e) => (
                      <li key={e.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                        <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{e.type}</span>
                        <span className="flex-1 font-medium">{e.label}</span>
                        {e.page && <button className="font-mono text-[11px] text-accent-foreground hover:underline" onClick={() => jump(e.page)}>p.{e.page}</button>}
                        <span className="tabular text-xs text-muted-foreground">{e.confidence}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Panel>
      </div>
    </>
  );
}
