import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, TrendingUp, Hash, Search } from "lucide-react";
import { TOPICS, KEYWORDS } from "@/data/misc";
import { DOCUMENTS } from "@/data/documents";
import { PageHeader, Panel, DemoTag, EmptyState } from "@/components/app/common";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_workspace/topics")({
  validateSearch: (s: Record<string, unknown>) => ({ topic: typeof s.topic === "string" ? s.topic : undefined }),
  head: () => ({ meta: [{ title: "Topic Intelligence — COALINTEL AI" }] }),
  component: TopicsPage,
});

function TopicsPage() {
  const search = Route.useSearch();
  const [selected, setSelected] = useState(search.topic ?? "production");
  const [filter, setFilter] = useState("All Documents");
  const [query, setQuery] = useState("");
  const topics = useMemo(() => TOPICS.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const topic = TOPICS.find((t) => t.id === selected) ?? TOPICS[0];
  const docs = DOCUMENTS.filter((d) => {
    const matchesFilter = filter === "All Documents" || (filter === "Annual Report" && d.category === "Annual Report") || (filter.startsWith("FY") && d.category === "Annual Report") || (filter === "CMPDI" && `${d.source} ${d.name}`.toLowerCase().includes("cmpdi")) || (filter === "CIL" && `${d.source} ${d.name} ${d.topics.join(" ")}`.toLowerCase().includes("cil"));
    return topic.relatedDocIds.includes(d.id) && matchesFilter;
  });
  return <>
    <PageHeader title="Document Topic Analysis" subtitle="Review topic frequency, recurring terms, trends and related source documents." actions={<DemoTag label="Prototype topic index" />} />
    <div className="mb-4 flex flex-wrap gap-2">{["All Documents", "Annual Report", "FY2024-25", "FY2023-24", "CMPDI", "CIL"].map((f) => <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>{f}</Button>)}</div>
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <Panel title="Topic frequency cloud" action={<span className="text-xs text-muted-foreground">Select a term to explore</span>}>
        <div className="flex min-h-[260px] flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-lg border bg-muted/30 p-6">
          {KEYWORDS.map((word, i) => {
            const match = TOPICS.find((t) => t.name.toLowerCase() === word.text.toLowerCase()) ?? TOPICS.find((t) => t.keywords.some((k) => k.toLowerCase() === word.text.toLowerCase()) || t.entities.some((e) => e.toLowerCase() === word.text.toLowerCase()));
            const size = 12 + Math.round(word.weight * 0.22);
            return <button key={word.text} onClick={() => match && setSelected(match.id)} className={`font-semibold transition hover:-translate-y-0.5 hover:text-primary ${i % 4 === 0 ? "text-primary" : i % 3 === 0 ? "text-chart-3" : "text-foreground"}`} style={{ fontSize: size, opacity: 0.58 + word.weight / 240 }} title={`${word.weight} relative frequency`}>{word.text}</button>;
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Word size reflects relative term frequency in the local demo corpus. Topic frequencies are sample index counts.</p>
      </Panel>
      <Panel title="Topic frequency table" action={<span className="text-xs text-muted-foreground">Indexed corpus counts · select a topic</span>}>
        <div className="max-h-[330px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card text-left text-xs text-muted-foreground"><tr className="border-b"><th className="px-2 py-2 font-medium">Topic</th><th className="px-2 py-2 text-right font-medium">Mentions</th><th className="px-2 py-2 text-right font-medium">Documents</th></tr></thead>
            <tbody>{[...TOPICS].sort((a,b)=>b.frequency-a.frequency).map((t)=><tr key={t.id} className={`cursor-pointer border-b last:border-0 hover:bg-muted/50 ${selected===t.id ? "bg-accent/30" : ""}`} onClick={()=>setSelected(t.id)}><td className="px-2 py-2 font-medium">{t.name}</td><td className="px-2 py-2 text-right font-mono tabular">{t.frequency.toLocaleString()}</td><td className="px-2 py-2 text-right tabular">{t.documents}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Counts are sample index values from the local prototype corpus.</p>
      </Panel>
    </div>
    <div className="mt-4">
      <Panel title="Selected topic overview" action={<span className="font-mono text-xs text-muted-foreground">{topic.trend.at(-1)?.fy}</span>}>
        <div className="flex items-start justify-between"><div><div className="text-xl font-semibold">{topic.name}</div><div className="mt-1 text-sm text-muted-foreground">{topic.documents} source documents</div></div><Hash className="h-5 w-5 text-primary" /></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><Metric label="Mentions" value={topic.frequency.toLocaleString()} /><Metric label="Trend" value={`${(((topic.trend.at(-1)?.mentions ?? 0) / (topic.trend.at(-2)?.mentions ?? 1) - 1) * 100).toFixed(1)}%`} positive /></div>
        <div className="mt-5"><div className="mb-2 text-xs font-medium">Related terms</div><div className="flex flex-wrap gap-1.5">{topic.keywords.map((k) => <button className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs hover:border-primary" key={k} onClick={() => setQuery(k)}>{k}</button>)}</div></div>
        <div className="mt-5 rounded-lg border bg-accent/35 p-3"><div className="text-xs font-semibold">AI summary</div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{topic.name} appears across {topic.documents} indexed documents, with {topic.frequency.toLocaleString()} detected mentions. Common related concepts include {topic.keywords.slice(0, 3).join(", ")}. Review the linked source material before using this sample analysis.</p></div>
      </Panel>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title="Topic catalogue" action={<div className="relative"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 w-44 pl-8" placeholder="Find a topic" value={query} onChange={(e) => setQuery(e.target.value)} /></div>}>
        <div className="grid max-h-[420px] gap-2 overflow-y-auto sm:grid-cols-2">{topics.map((t) => <button key={t.id} onClick={() => setSelected(t.id)} className={`rounded-lg border p-3 text-left transition hover:border-primary/50 ${selected === t.id ? "border-primary bg-accent/40" : "bg-card"}`}><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{t.name}</span><span className="font-mono text-xs">{t.frequency.toLocaleString()}</span></div><div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><TrendingUp className="h-3 w-3 text-success"/> {t.documents} docs · {t.keywords.slice(0, 2).join(", ")}</div></button>)}</div>
      </Panel>
      <Panel title="Related documents" action={<span className="text-xs text-muted-foreground">{docs.length} matched</span>}>
        {docs.length ? <div className="space-y-2">{docs.map((d) => <Link key={d.id} to="/documents/$id" params={{ id: d.id }} className="flex items-center gap-3 rounded-lg border p-3 transition hover:border-primary/50"><FileText className="h-4 w-4 shrink-0 text-primary"/><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.category} · {d.uploadedAt}</div></div><span className="text-xs text-muted-foreground">Open</span></Link>)}</div> : <EmptyState title="No related documents match this filter" description="Try another document category or period."/>}
        <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">Recent mentions: {topic.pages.map((p) => `p. ${p}`).join(" · ")} <span className="ml-2">(source page references)</span></div>
      </Panel>
    </div>
  </>;
}
function Metric({label,value,positive}:{label:string;value:string;positive?:boolean}) { return <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className={`mt-1 text-lg font-semibold tabular ${positive ? "text-success" : ""}`}>{value}</div></div>; }
