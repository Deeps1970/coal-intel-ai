import type { Dataset, DatasetRecord } from "@/types";
import { SOURCES } from "./sources";

let n = 0;
const r = (o: Record<string, string | number>): DatasetRecord => ({ id: `r${++n}`, ...o });

export const SUBSIDIARIES = ["ECL", "BCCL", "CCL", "NCL", "WCL", "SECL", "MCL", "NEC"] as const;

// Illustrative subsidiary split, reconciled to reported CIL totals (773.65 / 781.06 MT).
export const SUB_PROD: Record<string, { fy24: number; fy25: number }> = {
  ECL: { fy24: 47.6, fy25: 51.9 },
  BCCL: { fy24: 40.5, fy25: 40.5 },
  CCL: { fy24: 86.1, fy25: 87.5 },
  NCL: { fy24: 136.2, fy25: 139.1 },
  WCL: { fy24: 69.1, fy25: 69.3 },
  SECL: { fy24: 187.3, fy25: 167.5 },
  MCL: { fy24: 206.65, fy25: 225.06 },
  NEC: { fy24: 0.2, fy25: 0.2 },
};

const production: DatasetRecord[] = [
  r({ company: "CIL", fy: "FY2023-24", category: "Actual", value: 773.65 }),
  r({ company: "SCCL", fy: "FY2023-24", category: "Actual", value: 70.02 }),
  r({ company: "Captive & Others", fy: "FY2023-24", category: "Actual", value: 153.58 }),
  r({ company: "All India", fy: "FY2023-24", category: "Actual", value: 997.25 }),
  r({ company: "CIL", fy: "FY2024-25", category: "Target", value: 838.0 }),
  r({ company: "CIL", fy: "FY2024-25", category: "Actual", value: 781.06 }),
  r({ company: "SCCL", fy: "FY2024-25", category: "Actual", value: 69.01 }),
  r({ company: "Captive & Others", fy: "FY2024-25", category: "Actual", value: 197.46 }),
  r({ company: "All India", fy: "FY2024-25", category: "Actual", value: 1047.52 }),
  r({ company: "CIL", fy: "Apr–Dec 2025", category: "Provisional", value: 529.19 }),
  r({ company: "SCCL", fy: "Apr–Dec 2025", category: "Provisional", value: 43.73 }),
  r({ company: "Captive & Others", fy: "Apr–Dec 2025", category: "Provisional", value: 148.73 }),
  r({ company: "All India", fy: "Apr–Dec 2025", category: "Provisional", value: 721.65 }),
  r({ company: "CIL", fy: "FY2025-26", category: "Target", value: 875.0 }),
  ...SUBSIDIARIES.flatMap((c) => [
    r({ company: c, fy: "FY2023-24", category: "Illustrative", value: SUB_PROD[c].fy24 }),
    r({ company: c, fy: "FY2024-25", category: "Illustrative", value: SUB_PROD[c].fy25 }),
  ]),
];

const dispatch: DatasetRecord[] = [
  r({ company: "CIL", fy: "FY2023-24", category: "Illustrative", value: 753.5 }),
  r({ company: "SCCL", fy: "FY2023-24", category: "Illustrative", value: 69.9 }),
  r({ company: "Captive & Others", fy: "FY2023-24", category: "Illustrative", value: 149.6 }),
  r({ company: "CIL", fy: "FY2024-25", category: "Illustrative", value: 763.5 }),
  r({ company: "SCCL", fy: "FY2024-25", category: "Illustrative", value: 68.9 }),
  r({ company: "Captive & Others", fy: "FY2024-25", category: "Illustrative", value: 193.2 }),
];

const demand: DatasetRecord[] = [
  ["Coking – Steel + Coke Oven", 67.91],
  ["Power (Utility)", 905.78],
  ["Power (Captive)", 62.45],
  ["Cement", 7.75],
  ["Sponge Iron", 7.37],
  ["Other", 217.87],
  ["Total", 1267.13],
].map(([sector, value]) => r({ sector, fy: "FY2024-25", category: "Actual", value }));

const imports: DatasetRecord[] = [
  r({ fy: "FY2021-22", type: "Total Import", category: "Actual", value: 209.02 }),
  r({ fy: "FY2022-23", type: "Total Import", category: "Actual", value: 237.67 }),
  r({ fy: "FY2023-24", type: "Coking Coal", category: "Illustrative", value: 58.1 }),
  r({ fy: "FY2023-24", type: "Power", category: "Illustrative", value: 99.25 }),
  r({ fy: "FY2023-24", type: "Non-Regulated Sector", category: "Illustrative", value: 107.18 }),
  r({ fy: "FY2023-24", type: "Total Import", category: "Actual", value: 264.53 }),
  r({ fy: "FY2024-25", type: "Coking Coal", category: "Illustrative", value: 57.46 }),
  r({ fy: "FY2024-25", type: "Power", category: "Illustrative", value: 84.9 }),
  r({ fy: "FY2024-25", type: "Non-Regulated Sector", category: "Illustrative", value: 101.26 }),
  r({ fy: "FY2024-25", type: "Total Import", category: "Actual", value: 243.62 }),
];

const ligniteProd: DatasetRecord[] = [
  ["NLCIL", 25.6, 26.4],
  ["GMDC", 8.9, 9.2],
  ["RSMML", 1.4, 1.3],
  ["Others", 11.7, 11.5],
].flatMap(([company, a, b]) => [
  r({ company, fy: "FY2023-24", category: "Illustrative", value: a }),
  r({ company, fy: "FY2024-25", category: "Illustrative", value: b }),
]);

const ligniteDisp: DatasetRecord[] = [
  ["NLCIL", 25.1, 26.0],
  ["GMDC", 8.7, 9.0],
  ["RSMML", 1.3, 1.3],
  ["Others", 11.4, 11.2],
].flatMap(([company, a, b]) => [
  r({ company, fy: "FY2023-24", category: "Illustrative", value: a }),
  r({ company, fy: "FY2024-25", category: "Illustrative", value: b }),
]);

export const CMPDI = [
  { metric: "Revenue from Operations", fy24: 1732.69, fy25: 2102.76 },
  { metric: "Other Income", fy24: 37.49, fy25: 74.77 },
  { metric: "Total Income", fy24: 1770.18, fy25: 2177.53 },
  { metric: "Total Expenses", fy24: 1037.34, fy25: 1295.39 },
  { metric: "PBT", fy24: 732.84, fy25: 882.14 },
  { metric: "PAT", fy24: 503.23, fy25: 666.91 },
];

const cmpdi: DatasetRecord[] = CMPDI.flatMap((m) => [
  r({ metric: m.metric, fy: "FY2023-24", category: "Actual", value: m.fy24 }),
  r({ metric: m.metric, fy: "FY2024-25", category: "Actual", value: m.fy25 }),
]);

const cols = (first: string, firstLabel: string, unit: string) => [
  { key: first, label: firstLabel },
  { key: "fy", label: "Period" },
  { key: "category", label: "Data Status" },
  { key: "value", label: `Value (${unit})`, numeric: true, unit },
];

export const DATASETS: Dataset[] = [
  { id: "production", name: "Production", description: "Coal production by company and period", unit: "MT", source: SOURCES.production, columns: cols("company", "Company", "MT"), records: production },
  { id: "dispatch", name: "Dispatch", description: "Coal dispatch / offtake by company", unit: "MT", source: SOURCES.dispatch, columns: cols("company", "Company", "MT"), records: dispatch },
  { id: "demand", name: "Demand", description: "Sector-wise coal demand", unit: "MT", source: SOURCES.demand, columns: cols("sector", "Sector", "MT"), records: demand },
  { id: "imports", name: "Imports", description: "Coal imports by type", unit: "MT", source: SOURCES.imports, columns: cols("type", "Import Type", "MT"), records: imports },
  { id: "lignite-production", name: "Lignite Production", description: "Lignite production by company", unit: "MT", source: SOURCES.lignite, columns: cols("company", "Company", "MT"), records: ligniteProd },
  { id: "lignite-dispatch", name: "Lignite Dispatch", description: "Lignite dispatch by company", unit: "MT", source: SOURCES.lignite, columns: cols("company", "Company", "MT"), records: ligniteDisp },
  { id: "cmpdi", name: "CMPDI Financials", description: "CMPDI profit & loss highlights", unit: "₹ Cr", source: SOURCES.cmpdi, columns: cols("metric", "Metric", "₹ Cr"), records: cmpdi },
];
