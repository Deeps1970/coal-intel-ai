import type { AppNotification, Report, Topic, ValidationRecord } from "@/types";
import { SOURCES } from "./sources";

const trend = (a: number[]) =>
  ["FY2021-22", "FY2022-23", "FY2023-24", "FY2024-25", "FY2025-26"].map((fy, i) => ({ fy, mentions: a[i] ?? 0 }));

const t = (
  id: string,
  name: string,
  frequency: number,
  documents: number,
  tr: number[],
  keywords: string[],
  entities: string[],
  relatedDocIds: string[],
  pages: number[],
): Topic => ({ id, name, frequency, documents, trend: trend(tr), keywords, entities, relatedDocIds, pages });

export const TOPICS: Topic[] = [
  t("production", "Coal Production", 1842, 412, [220, 290, 360, 420, 552], ["output", "MT", "target", "growth", "opencast"], ["CIL", "SCCL", "MCL", "SECL"], ["doc-ar-2526", "doc-prod-xlsx", "doc-pq-scan"], [14, 15, 18]),
  t("mining", "Mining", 1310, 356, [240, 250, 270, 260, 290], ["opencast", "underground", "overburden", "stripping ratio"], ["Gevra OCP", "Kusmunda OCP"], ["doc-safety-audit", "doc-geo-talcher"], [8, 19, 21]),
  t("dispatch", "Dispatch", 1104, 288, [180, 200, 220, 240, 264], ["offtake", "rake", "rail", "e-auction"], ["CIL", "Indian Railways"], ["doc-dispatch-q3", "doc-ar-2526"], [7, 24]),
  t("coking", "Coking Coal", 640, 142, [100, 120, 130, 140, 150], ["washery", "steel", "import substitution"], ["BCCL", "CCL"], ["doc-ar-2526"], [28]),
  t("power", "Power", 980, 260, [170, 185, 200, 205, 220], ["utility", "thermal", "FSA", "stock"], ["NTPC", "State Gencos"], ["doc-ar-2526", "doc-dispatch-q3"], [31, 32]),
  t("exploration", "Exploration", 720, 198, [120, 130, 150, 150, 170], ["drilling", "borehole", "GR", "resource"], ["CMPDI", "Talcher Coalfield"], ["doc-geo-talcher", "doc-cmpdi-2425"], [1, 12]),
  t("safety", "Safety", 590, 164, [110, 105, 120, 125, 130], ["accident", "slope stability", "DGMS", "audit"], ["SECL", "DGMS"], ["doc-safety-audit"], [8, 11]),
  t("environment", "Environment", 540, 150, [80, 95, 110, 120, 135], ["afforestation", "dust", "mine closure", "EC"], ["MoEFCC"], ["doc-safety-audit", "doc-ar-2526"], [56]),
  t("finance", "Finance", 820, 176, [140, 150, 160, 180, 190], ["revenue", "PAT", "capex", "dividend"], ["CMPDI", "CIL"], ["doc-cmpdi-2425", "doc-pq-scan"], [22]),
  t("land", "Land Acquisition", 360, 94, [60, 70, 72, 76, 82], ["R&R", "CBA Act", "compensation"], ["CIL Estate"], ["doc-land-csv"], [64]),
  t("infrastructure", "Infrastructure", 470, 120, [70, 80, 95, 105, 120], ["FMC", "silo", "conveyor", "rail siding"], ["MCL", "SECL"], ["doc-ar-2526"], [38]),
  t("transport", "Transportation", 430, 112, [70, 78, 85, 92, 105], ["rail corridor", "RCR", "logistics"], ["Indian Railways"], ["doc-dispatch-q3"], [7, 9]),
];

export const KEYWORDS: { text: string; weight: number }[] = [
  ["coal production", 100], ["CIL", 92], ["dispatch", 80], ["MT", 76], ["FY2024-25", 72], ["power sector", 68],
  ["imports", 60], ["SECL", 54], ["MCL", 58], ["exploration", 50], ["opencast", 46], ["safety", 44],
  ["coking coal", 42], ["CMPDI", 48], ["revenue", 38], ["rail rakes", 36], ["washery", 30], ["FMC", 28],
  ["land acquisition", 32], ["overburden", 26], ["afforestation", 24], ["target", 40], ["captive mines", 44],
  ["provisional", 30], ["borehole", 22], ["e-auction", 24], ["SCCL", 38], ["thermal", 34], ["PAT", 26],
].map(([text, weight]) => ({ text: text as string, weight: weight as number }));

export const REPORTS: Report[] = [
  { id: "rpt-001", title: "Executive Summary – Coal Sector FY2024-25", type: "Executive Summary", createdAt: "2026-09-24", author: "Demo User", sources: ["Production", "Imports", "Demand"], period: "FY2024-25", format: "PDF", validation: "Passed", status: "Validated" },
  { id: "rpt-002", title: "Parliamentary Response – Coal Production Growth", type: "Parliamentary Response", createdAt: "2026-09-23", author: "Demo User", sources: ["Production", "Annual Report 2025-26"], period: "FY2023-24 – FY2024-25", format: "DOCX", validation: "Passed", status: "Published" },
  { id: "rpt-003", title: "CMPDI Financial Performance Review", type: "Financial Report", createdAt: "2026-09-21", author: "R. Sharma", sources: ["CMPDI Financials"], period: "FY2024-25", format: "PDF", validation: "Partial", status: "Under Review" },
  { id: "rpt-004", title: "Dispatch Report – Q3 2025", type: "Coal Dispatch Report", createdAt: "2026-09-20", author: "A. Mehta", sources: ["Dispatch", "Dispatch Statement Q3"], period: "Oct–Dec 2025", format: "XLSX", validation: "Pending", status: "Generated" },
  { id: "rpt-005", title: "Production Report – CIL Subsidiaries", type: "Production Report", createdAt: "2026-09-18", author: "Demo User", sources: ["Production"], period: "FY2024-25", format: "PDF", validation: "Pending", status: "Draft" },
];

export const VALIDATION: ValidationRecord[] = [
  { id: "v1", record: "Coal Production", entity: "CIL", source: SOURCES.production, extracted: "781.06 MT", expected: "781.06 MT", status: "Validated", confidence: 99.4, extractedText: "Coal India Limited (CIL) produced 781.06 MT during 2024-25.", history: [{ at: "2026-09-18 10:12", by: "System", action: "Auto-validated against reference dataset" }] },
  { id: "v2", record: "Coal Production", entity: "All India", source: SOURCES.production, extracted: "1047.52 MT", expected: "1047.52 MT", status: "Validated", confidence: 99.6, extractedText: "Coal production in the country during 2024-25 was 1047.52 MT.", history: [{ at: "2026-09-18 10:12", by: "System", action: "Auto-validated" }] },
  { id: "v3", record: "Coal Production (P)", entity: "All India", source: SOURCES.productionProv, extracted: "721.65 MT", expected: "721.65 MT (Provisional)", status: "Review Required", confidence: 94.2, extractedText: "During April–December 2025 (provisional), production was 721.65 MT.", history: [{ at: "2026-09-18 10:13", by: "System", action: "Flagged: provisional period needs analyst confirmation" }] },
  { id: "v4", record: "Coal Imports", entity: "All India", source: SOURCES.imports, extracted: "243.62 MT", expected: "243.62 MT", status: "Validated", confidence: 98.3, extractedText: "Total import of coal was 243.62 MT in 2024-25.", history: [{ at: "2026-09-18 10:14", by: "System", action: "Auto-validated" }] },
  { id: "v5", record: "Dispatch", entity: "CIL", source: SOURCES.dispatch, extracted: "736.5 MT", expected: "763.5 MT", status: "Conflict", confidence: 71.8, extractedText: "Total dispatch by CIL stood at 736.5 MT (OCR: digits possibly transposed).", history: [{ at: "2026-09-22 15:40", by: "System", action: "Conflict: extracted value differs from reference by 27.0 MT" }] },
  { id: "v6", record: "PAT", entity: "CMPDI", source: SOURCES.cmpdi, extracted: "₹666.91 Cr", expected: "₹666.91 Cr", status: "Validated", confidence: 99.1, extractedText: "Profit After Tax ₹666.91 crore.", history: [{ at: "2026-09-16 09:02", by: "System", action: "Auto-validated" }] },
  { id: "v7", record: "Demand – Power (Utility)", entity: "Power Sector", source: SOURCES.demand, extracted: "905.78 MT", expected: "905.78 MT", status: "Validated", confidence: 98.9, extractedText: "Power (Utility) accounted for 905.78 MT.", history: [{ at: "2026-09-18 10:15", by: "System", action: "Auto-validated" }] },
  { id: "v8", record: "Seam VII thickness", entity: "Talcher Block 7", source: { ...SOURCES.production, id: "src-geo", document: "Geological Report – Talcher Block 7", section: "Borehole logs", page: 41, table: "Log TB-7/14", period: "2025", status: "Illustrative", confidence: 82 }, extracted: "11.2 m", expected: "—", status: "Missing Source", confidence: 82.0, extractedText: "Seam VII at 182.4 m depth with 11.2 m thickness.", history: [{ at: "2026-09-24 12:00", by: "System", action: "No reference dataset available for cross-check" }] },
  { id: "v9", record: "Coal Production", entity: "SCCL", source: SOURCES.production, extracted: "69.01 MT", expected: "69.01 MT", status: "Validated", confidence: 99.2, extractedText: "SCCL produced 69.01 MT.", history: [{ at: "2026-09-18 10:12", by: "System", action: "Auto-validated" }] },
  { id: "v10", record: "Revenue from Operations", entity: "CMPDI", source: SOURCES.cmpdi, extracted: "₹2012.76 Cr", expected: "₹2102.76 Cr", status: "Conflict", confidence: 76.4, extractedText: "Revenue from Operations ₹2012.76 crore (scan quality low).", history: [{ at: "2026-09-16 09:03", by: "System", action: "Conflict: digit transposition suspected" }] },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Annual Report 2024-25 processing completed", time: "5 min ago", tone: "success", read: false },
  { id: "n2", title: "23 records require validation", time: "32 min ago", tone: "warning", read: false },
  { id: "n3", title: "New report generated: Executive Summary FY2024-25", time: "2 h ago", tone: "info", read: false },
  { id: "n4", title: "Document extraction confidence below threshold (Dispatch Statement Q3)", time: "Yesterday", tone: "error", read: true },
];

export const ACTIVITY = [
  { title: "Annual Report 2024-25 processed", detail: "212 pages • 1,284 records", time: "09:42", tone: "success" },
  { title: "Coal Production Dataset imported", detail: "1,840 rows • 99.1% schema match", time: "09:10", tone: "success" },
  { title: "Parliamentary Query generated", detail: "Coal production growth FY24→FY25", time: "Yesterday", tone: "info" },
  { title: "24 documents validated", detail: "By Demo User", time: "Yesterday", tone: "success" },
  { title: "Topic extraction completed", detail: "12 topics • 4,210 keywords", time: "2 days ago", tone: "info" },
] as const;
