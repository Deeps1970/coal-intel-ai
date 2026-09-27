import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Cloud, Database, FileStack, FileText } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { searchAll } from "@/services/intel";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("CIL production 2024-25");
  const nav = useNavigate();
  const res = searchAll(q);
  const go = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };
  const total = res.documents.length + res.datasets.length + res.records.length + res.reports.length + res.topics.length + res.entities.length;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search documents, datasets, reports, topics, companies…" value={q} onValueChange={setQ} />
      <CommandList className="max-h-[420px]">
        {total === 0 && <CommandEmpty>No results for “{q}”. Try “production”, “CMPDI” or “dispatch”.</CommandEmpty>}
        {res.documents.length > 0 && (
          <CommandGroup heading="Documents">
            {res.documents.map((d) => (
              <CommandItem key={d.id} value={`doc ${d.name}`} onSelect={() => go(() => nav({ to: "/documents/$id", params: { id: d.id } }))}>
                <FileStack /> <span className="truncate">{d.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {res.datasets.length > 0 && (
          <CommandGroup heading="Datasets">
            {res.datasets.map((d) => (
              <CommandItem key={d.id} value={`ds ${d.name}`} onSelect={() => go(() => nav({ to: "/data", search: { tab: d.id } }))}>
                <Database /> {d.name} <span className="ml-auto text-xs text-muted-foreground">{d.records.length} records</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {res.records.length > 0 && (
          <CommandGroup heading="Records">
            {res.records.map((r) => (
              <CommandItem key={`${r.datasetId}-${r.id}`} value={`record ${r.dataset} ${r.label} ${r.period}`} onSelect={() => go(() => nav({ to: "/data", search: { tab: r.datasetId } }))}>
                <Database /><span className="min-w-0 flex-1 truncate">{r.label}</span><span className="ml-auto text-[10px] text-muted-foreground">{r.dataset} · {r.period}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {res.reports.length > 0 && (
          <CommandGroup heading="Reports">
            {res.reports.map((r) => (
              <CommandItem key={r.id} value={`rpt ${r.title}`} onSelect={() => go(() => nav({ to: "/reports/$id", params: { id: r.id } }))}>
                <FileText /> <span className="truncate">{r.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {res.topics.length > 0 && (
          <CommandGroup heading="Topics">
            {res.topics.map((t) => (
              <CommandItem key={t.id} value={`topic ${t.name}`} onSelect={() => go(() => nav({ to: "/topics", search: { topic: t.id } }))}>
                <Cloud /> {t.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {res.entities.length > 0 && (
          <CommandGroup heading="Companies">
            {res.entities.map((e) => (
              <CommandItem key={e.id} value={`ent ${e.name} ${e.short}`} onSelect={() => go(() => nav({ to: "/entities/$id", params: { id: e.id } }))}>
                <Building2 /> {e.name} <span className="ml-auto text-xs text-muted-foreground">{e.short}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
