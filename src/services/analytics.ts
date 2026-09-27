import { CMPDI, SUB_PROD, SUBSIDIARIES } from "@/data/coal";
import { SOURCES } from "@/data/sources";

export const KPIS = [
  { key: "docs", label: "Documents Processed", value: "1,248", delta: "+86 this month" },
  { key: "records", label: "Structured Records", value: "18,642", delta: "+2,140 this month" },
  { key: "accuracy", label: "Extraction Accuracy", value: "96.8%", delta: "+1.2 pts" },
  { key: "automation", label: "Automation Rate", value: "82.4%", delta: "+4.1 pts" },
  { key: "reports", label: "Reports Generated", value: "147", delta: "+12 this week" },
  { key: "pending", label: "Pending Validation", value: "23", delta: "5 conflicts" },
];

export const productionTrend = [
  { fy: "FY2022-23", actual: 893.19, provisional: null as number | null, label: "Actual" },
  { fy: "FY2023-24", actual: 997.25, provisional: null, label: "Actual" },
  { fy: "FY2024-25", actual: 1047.52, provisional: 1047.52, label: "Actual" },
  { fy: "FY2025-26*", actual: null, provisional: 721.65, label: "Provisional Apr–Dec" },
];

export const productionByCompany = [
  ...SUBSIDIARIES.map((c) => ({ company: c, fy24: SUB_PROD[c].fy24, fy25: SUB_PROD[c].fy25 })),
  { company: "SCCL", fy24: 70.02, fy25: 69.01 },
  { company: "Captive & Others", fy24: 153.58, fy25: 197.46 },
];

export const importsTrend = [
  { fy: "FY2021-22", total: 209.02 },
  { fy: "FY2022-23", total: 237.67 },
  { fy: "FY2023-24", coking: 58.1, power: 99.25, nonReg: 107.18, total: 264.53 },
  { fy: "FY2024-25", coking: 57.46, power: 84.9, nonReg: 101.26, total: 243.62 },
];

export const demandBySector = [
  { sector: "Power (Utility)", value: 905.78 },
  { sector: "Other", value: 217.87 },
  { sector: "Coking", value: 67.91 },
  { sector: "Power (Captive)", value: 62.45 },
  { sector: "Cement", value: 7.75 },
  { sector: "Sponge Iron", value: 7.37 },
];

export const dispatchByCompany = [
  { company: "CIL", fy24: 753.5, fy25: 763.5 },
  { company: "SCCL", fy24: 69.9, fy25: 68.9 },
  { company: "Captive & Others", fy24: 149.6, fy25: 193.2 },
];

export const ligniteProduction = [
  { company: "NLCIL", fy24: 25.6, fy25: 26.4 },
  { company: "GMDC", fy24: 8.9, fy25: 9.2 },
  { company: "RSMML", fy24: 1.4, fy25: 1.3 },
  { company: "Others", fy24: 11.7, fy25: 11.5 },
];

export const cmpdiFinancials = CMPDI.filter((m) =>
  ["Revenue from Operations", "Total Income", "PBT", "PAT"].includes(m.metric),
).map((m) => ({ metric: m.metric.replace("Revenue from Operations", "Revenue"), fy24: m.fy24, fy25: m.fy25 }));

export const CHART_SOURCES = {
  production: SOURCES.production,
  company: SOURCES.subsidiary,
  imports: SOURCES.imports,
  demand: SOURCES.demand,
  dispatch: SOURCES.dispatch,
  lignite: SOURCES.lignite,
  cmpdi: SOURCES.cmpdi,
};
