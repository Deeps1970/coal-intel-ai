import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Eye, FolderUp, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingBlock, PageHeader, Panel, StatusBadge } from "@/components/app/common";
import { UploadZone } from "@/components/app/UploadZone";
import { WorkflowStrip } from "@/components/app/WorkflowStrip";
import { listDocuments } from "@/services/documents";

export const Route = createFileRoute("/_workspace/documents/")({
  head: () => ({
    meta: [
      { title: "Document Intelligence — COALINTEL AI" },
      { name: "description", content: "Upload, process, validate and search geological, mining and administrative documents." },
      { property: "og:title", content: "Document Intelligence — COALINTEL AI" },
      { property: "og:description", content: "Upload, process, validate and search geological, mining and administrative documents." },
    ],
  }),
  component: DocumentsPage,
});

const ALL = "all";

function DocumentsPage() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["documents"], queryFn: listDocuments });
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [f, setF] = useState({ type: ALL, status: ALL, dept: ALL, cat: ALL, date: ALL });

  const opts = useMemo(() => {
    const d = data ?? [];
    const u = (k: (x: (typeof d)[number]) => string) => Array.from(new Set(d.map(k)));
    return { type: u((x) => x.type), status: u((x) => x.status), dept: u((x) => x.department), cat: u((x) => x.category) };
  }, [data]);

  const rows = (data ?? []).filter((d) => {
    const days = (Date.now() - new Date(d.uploadedAt).getTime()) / 864e5;
    return (
      (!q || `${d.name} ${d.topics.join(" ")}`.toLowerCase().includes(q.toLowerCase())) &&
      (f.type === ALL || d.type === f.type) &&
      (f.status === ALL || d.status === f.status) &&
      (f.dept === ALL || d.department === f.dept) &&
      (f.cat === ALL || d.category === f.cat) &&
      (f.date === ALL || days <= Number(f.date))
    );
  });

  const filter = (key: keyof typeof f, label: string, values: string[] | [string, string][]) => (
    <Select value={f[key]} onValueChange={(v) => setF((s) => ({ ...s, [key]: v }))}>
      <SelectTrigger className="h-9 w-full sm:w-[150px]"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All {label}</SelectItem>
        {values.map((v) => (Array.isArray(v) ? <SelectItem key={v[0]} value={v[0]}>{v[1]}</SelectItem> : <SelectItem key={v} value={v}>{v}</SelectItem>))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <PageHeader
        eyebrow="Ingest • Extract"
        title="Document Intelligence"
        subtitle="Upload, process, validate and search geological, mining and administrative documents."
        actions={
          <>
            <Button onClick={() => fileRef.current?.click()}><Upload /> Upload Document</Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}><FolderUp /> Bulk Upload</Button>
          </>
        }
      />
      <WorkflowStrip active="Extract" className="mb-5" />
      <UploadZone inputRef={fileRef} onUploaded={() => qc.invalidateQueries({ queryKey: ["documents"] })} />

      <Panel className="mt-6" bodyClassName="p-0">
        <div className="flex flex-col gap-2 border-b p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="h-9 pl-9" placeholder="Search documents or topics…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            {filter("type", "File Types", opts.type)}
            {filter("status", "Statuses", opts.status)}
            {filter("date", "Dates", [["7", "Last 7 days"], ["30", "Last 30 days"], ["90", "Last 90 days"]])}
            {filter("dept", "Departments", opts.dept)}
            {filter("cat", "Categories", opts.cat)}
          </div>
        </div>
        {isLoading ? (
          <div className="p-4"><LoadingBlock rows={6} /></div>
        ) : isError ? (
          <div className="p-4"><ErrorState message="Could not load documents." onRetry={() => refetch()} /></div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState title="No documents match your filters" description="Clear filters or upload a new document." action={<Button size="sm" variant="outline" onClick={() => { setQ(""); setF({ type: ALL, status: ALL, dept: ALL, cat: ALL, date: ALL }); }}>Clear filters</Button>} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>{["Document", "Type", "Source", "Uploaded", "Processing Status", "Extraction Accuracy", "Topics", ""].map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((d) => (
                  <tr key={d.id} className="cursor-pointer transition-colors hover:bg-muted/40" onClick={() => nav({ to: "/documents/$id", params: { id: d.id } })}>
                    <td className="max-w-[300px] px-4 py-3">
                      <div className="truncate font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.category} • {d.department}</div>
                    </td>
                    <td className="px-4 py-3"><span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">{d.type}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.source}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{d.uploadedAt}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      {d.accuracy == null ? <span className="text-muted-foreground">—</span> : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><div className={d.accuracy >= 90 ? "h-full bg-success" : "h-full bg-warning"} style={{ width: `${d.accuracy}%` }} /></div>
                          <span className="tabular text-xs">{d.accuracy.toFixed(1)}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex max-w-[220px] flex-wrap gap-1">{d.topics.slice(0, 3).map((t) => <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                        <Link to="/documents/$id" params={{ id: d.id }}><Eye /> Open</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
