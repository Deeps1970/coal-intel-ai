import { DATASETS } from "@/data/coal";
import type { DatasetRecord } from "@/types";
import { mockCall } from "./api";

export const listDatasets = () => mockCall("listDatasets", () => DATASETS, 250);
export const getDatasetRecords = (id: string) =>
  mockCall("datasetRecords", () => DATASETS.find((d) => d.id === id)?.records ?? []);

export function toCSV(rows: DatasetRecord[], keys: string[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export function download(filename: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
