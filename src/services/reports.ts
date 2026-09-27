import { REPORTS } from "@/data/misc";
import type { Report } from "@/types";
import { mockCall } from "./api";
import { recordAudit } from "./audit";

const KEY = "coalintel.reports.v1";
const readStore = (): Report[] => {
  if (typeof localStorage === "undefined") return [...REPORTS];
  try { const saved = localStorage.getItem(KEY); if (saved) return JSON.parse(saved) as Report[]; } catch { /* fall back to bundled examples */ }
  return [...REPORTS];
};
const writeStore = (rows: Report[]) => { if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(rows)); };

export const REPORT_TYPES = [
  "Executive Summary",
  "Production Report",
  "Mining Report",
  "Coal Dispatch Report",
  "Financial Report",
  "Parliamentary Response",
  "Administrative Query Response",
  "Custom Report",
];
export const REPORT_SOURCES = [
  "Coal Production",
  "Coal Dispatch",
  "Coal Demand",
  "Coal Imports",
  "Lignite Production",
  "Lignite Dispatch",
  "CMPDI Financials",
  "Documents",
];
export const REPORT_PERIODS = ["FY2024-25", "FY2023-24 – FY2024-25", "Apr–Dec 2025 (Provisional)", "FY2021-22 – FY2024-25"];

export const listReports = () => mockCall("listReports", readStore);
export const getReport = (id: string) =>
  mockCall("listReports", () => {
    const r = readStore().find((x) => x.id === id);
    if (!r) throw new Error("Report not found");
    return r;
  });

export async function generateReport(input: { type: string; sources: string[]; period: string; format: Report["format"] }) {
  return mockCall(
    "generateReport",
    () => {
      const r: Report = {
        id: `rpt-${Date.now().toString(36)}`,
        title: `${input.type} – ${input.period}`,
        type: input.type,
        createdAt: new Date().toISOString().slice(0, 10),
        author: "Demo User",
        sources: input.sources,
        period: input.period,
        format: input.format,
        validation: "Pending",
        status: "Generated",
      };
      const rows = readStore(); rows.unshift(r); writeStore(rows);
      recordAudit("Generated report", "Report Generator", r.id, "Completed");
      return r;
    },
    400,
  );
}

export async function updateReportStatus(id: string, status: Report["status"]) {
  return mockCall("listReports", () => {
    const rows = readStore();
    const r = rows.find((x) => x.id === id)!;
    r.status = status;
    if (status === "Validated" || status === "Published") r.validation = "Passed";
    writeStore(rows);
    return r;
  });
}
