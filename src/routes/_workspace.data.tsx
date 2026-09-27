import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpDown, Columns3, Download, Search } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState, ErrorState, LoadingBlock, PageHeader, Panel, StatusBadge } from "@/components/app/common";
import { SourceCitation } from "@/components/app/SourceCitation";
import { download, listDatasets, toCSV } from "@/services/datasets";

export const Route = createFileRoute("/_workspace/data")({
  validateSearch: z.object({ tab: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Structured Coal Data — COALINTEL AI" },
      { name: "description", content: "Production, dispatch, demand, imports, lignite and CMPDI financial datasets with provenance." },
      { property: "og:title", content: "Structured Coal Data — COALINTEL AI" },
      { property: "og:description", content: "Source-derived structured coal datasets with Target/Actual/Provisional separation." },
    ],
  }),
  component: DataPage,
});

const PAGE = 8;

function DataPage() {
  const { tab } = Route.useSearch();
  const nav = useNavigate({ from: "/data" });
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["datasets"], queryFn: listDatasets });
  const active = data?.find((d) => d.id === tab) ?? data?.[0];
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    if (!active) return [];
    let r = active.records.filter((x) => (status === "all" || x.category === status) && (!q || Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())));
    if (sort) r = [...r].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
    return r;
  }, [active, q, status, sort]);

  if (isLoading) return <LoadingBlock rows={8} />;
  if (isError || !data || !active) return <ErrorState message="Could not load datasets." onRetry={() => refetch()} />;

  const cols = active.columns.filter((c) => !hidden.includes(c.key));
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = rows.slice(page * PAGE, page * PAGE + PAGE);
  const statuses = Array.from(new Set(active.records.map((r) => String(r.category))));
  const reset = () => { setQ(""); setStatus("all"); setSort(null); setPage(0); setHidden([]); };

  return (
    <>
      <PageHeader eyebrow="Structured Data" title="Structured Coal Data" subtitle="Source-derived datasets. Target, Actual, Provisional and Illustrative values are kept separate — never merged." />
      <Tabs value={active.id} onValueChange={(v) => { reset(); nav({ search: { tab: v } }); }}>
        <TabsList className="mb-4 h-auto flex-wrap justify-start">
          {data.map((d) => <TabsTrigger key={d.id} value={d.id}>{d.name}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <Panel bodyClassName="p-0">
          <div className="flex flex-col gap-2 border-b p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="h-9 pl-9" placeholder={`Search ${active.name.toLowerCase()}…`} value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
              <SelectTrigger className="h-9 md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All data statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-9"><Columns3 /> Columns</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                {active.columns.map((c) => (
                  <DropdownMenuCheckboxItem key={c.key} checked={!hidden.includes(c.key)} onCheckedChange={(v) => setHidden((h) => (v ? h.filter((x) => x !== c.key) : [...h, c.key]))}>{c.label}</DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9" onClick={() => download(`${active.id}.csv`, toCSV(rows, cols.map((c) => c.key)), "text/csv")}><Download /> CSV</Button>
            <Button variant="outline" size="sm" className="h-9" onClick={() => download(`${active.id}.json`, JSON.stringify({ dataset: active.name, source: active.source, records: rows }, null, 2), "application/json")}><Download /> JSON</Button>
          </div>
          {view.length === 0 ? (
            <div className="p-4"><EmptyState title="No records match" action={<Button size="sm" variant="outline" onClick={reset}>Reset</Button>} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    {cols.map((c) => (
                      <th key={c.key} className={c.numeric ? "px-4 py-2.5 text-right" : "px-4 py-2.5 text-left"}>
                        <button className="inline-flex items-center gap-1 font-medium hover:text-foreground" onClick={() => setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === 1 ? -1 : 1 }))}>
                          {c.label} <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {view.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40">
                      {cols.map((c) => (
                        <td key={c.key} className={c.numeric ? "tabular px-4 py-2.5 text-right font-medium" : "px-4 py-2.5"}>
                          {c.key === "category" ? <StatusBadge status={String(r[c.key])} /> : c.numeric ? Number(r[c.key]).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : r[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
            <span>{rows.length} records</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <span>Page {page + 1} of {pages}</span>
              <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </Panel>
        <Panel title="Data Provenance">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs text-muted-foreground">Source</dt><dd className="font-medium">{active.source.document}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Dataset Type</dt><dd className="font-medium">Structured</dd></div>
            <div><dt className="text-xs text-muted-foreground">Unit</dt><dd className="font-medium">{active.unit}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Period</dt><dd className="font-medium">{active.source.period}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Last Updated</dt><dd className="font-medium">Demo dataset</dd></div>
          </dl>
          <div className="mt-4"><SourceCitation source={active.source} /></div>
        </Panel>
      </div>
    </>
  );
}
