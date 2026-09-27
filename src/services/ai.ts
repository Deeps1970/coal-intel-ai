import { SOURCES } from "@/data/sources";
import { SUB_PROD, SUBSIDIARIES } from "@/data/coal";
import type { AIMessage } from "@/types";
import { mockCall } from "./api";

export const SUGGESTED_QUESTIONS = [
  "What was India's coal production in FY2024-25?",
  "Compare coal production across CIL subsidiaries.",
  "What was CIL production in FY2023-24 versus FY2024-25?",
  "Show coal imports for the last five years.",
  "What are the major coal demand sectors?",
  "Summarize the latest uploaded annual report.",
  "Find documents related to coal dispatch.",
  "Generate a parliamentary response on coal production.",
];

const AR = "Ministry of Coal Annual Report 2025-26";
const id = () => Math.random().toString(36).slice(2);

function answer(q: string): Omit<AIMessage, "id" | "role"> {
  const s = q.toLowerCase();

  if (s.includes("parliament")) {
    return {
      content:
        "**Draft reply (AI-assisted — requires human validation)**\n\nThe coal production in the country during 2023-24 was 997.25 MT, which increased to 1047.52 MT in 2024-25, registering a growth of about 5.0%. Coal India Limited produced 781.06 MT in 2024-25 against 773.65 MT in 2023-24. During April–December 2025 (provisional), total production stood at 721.65 MT.\n\nThe Government has taken several steps to enhance production, including commercial auction of coal blocks, operationalisation of captive mines and infrastructure augmentation.",
      meta: { source: AR, dataset: "Production", period: "FY2023-24 – Apr–Dec 2025", status: "Actual", confidence: 97 },
      sources: [SOURCES.production, SOURCES.productionProv],
      followUps: ["Generate this as a formal report", "Add a table of company-wise production", "Show dispatch comparison"],
    };
  }
  if (s.includes("subsidiar") || (s.includes("compare") && s.includes("across"))) {
    const rows = SUBSIDIARIES.map((c) => [c, SUB_PROD[c].fy24, SUB_PROD[c].fy25, +(SUB_PROD[c].fy25 - SUB_PROD[c].fy24).toFixed(2)]);
    return {
      content:
        "MCL remained the largest CIL subsidiary in FY2024-25 at 225.06 MT, followed by SECL (167.5 MT) and NCL (139.1 MT). MCL recorded the largest increase (+18.41 MT), while SECL declined by 19.8 MT. Subsidiary split is an illustrative demo extract reconciled to the CIL total of 781.06 MT.",
      meta: { source: "CIL Subsidiary Production Summary (demo extract)", dataset: "Production", period: "FY2023-24 vs FY2024-25", status: "Illustrative", confidence: 92 },
      table: { columns: ["Subsidiary", "FY2023-24 (MT)", "FY2024-25 (MT)", "Change"], rows },
      chart: { xKey: "company", keys: ["FY2023-24", "FY2024-25"], data: SUBSIDIARIES.map((c) => ({ company: c, "FY2023-24": SUB_PROD[c].fy24, "FY2024-25": SUB_PROD[c].fy25 })) },
      sources: [SOURCES.subsidiary, SOURCES.production],
      followUps: ["Which company had the largest increase?", "Which company declined?", "Show dispatch comparison."],
    };
  }
  if (s.includes("cil") && (s.includes("2023") || s.includes("versus") || s.includes("vs"))) {
    return {
      content: "CIL production was 773.65 MT in FY2023-24 and 781.06 MT in FY2024-25 — an increase of 7.41 MT (~0.96%).",
      meta: { source: AR, dataset: "Production", period: "FY2023-24 – FY2024-25", status: "Actual", confidence: 99 },
      table: { columns: ["Period", "CIL Production (MT)", "Status"], rows: [["FY2023-24", 773.65, "Actual"], ["FY2024-25", 781.06, "Actual"], ["Apr–Dec 2025", 529.19, "Provisional"]] },
      chart: { xKey: "fy", keys: ["CIL"], data: [{ fy: "FY2023-24", CIL: 773.65 }, { fy: "FY2024-25", CIL: 781.06 }] },
      sources: [SOURCES.production],
      followUps: ["Compare coal production across CIL subsidiaries.", "What was CIL's FY2024-25 target?"],
    };
  }
  if (s.includes("compare") && (s.includes("2023") || s.includes("production"))) {
    const rows = [["CIL", 773.65, 781.06], ["SCCL", 70.02, 69.01], ["Captive & Others", 153.58, 197.46], ["Total", 997.25, 1047.52]];
    return {
      content: "All-India production grew from 997.25 MT (FY2023-24) to 1047.52 MT (FY2024-25), +50.27 MT. Captive & Others drove most of the growth (+43.88 MT); SCCL declined marginally (−1.01 MT).",
      meta: { source: AR, dataset: "Production", period: "FY2023-24 vs FY2024-25", status: "Actual", confidence: 99 },
      table: { columns: ["Company", "FY2023-24", "FY2024-25"], rows },
      chart: { xKey: "company", keys: ["FY2023-24", "FY2024-25"], data: rows.slice(0, 3).map(([c, a, b]) => ({ company: c, "FY2023-24": a, "FY2024-25": b })) },
      sources: [SOURCES.production],
      followUps: ["Which company had the largest increase?", "Which company declined?", "Show dispatch comparison."],
    };
  }
  if (s.includes("largest increase")) {
    return { content: "Captive & Others recorded the largest increase (+43.88 MT). Within CIL, MCL rose the most (+18.41 MT, illustrative split).", meta: { source: AR, dataset: "Production", period: "FY2023-24 vs FY2024-25", status: "Actual", confidence: 96 }, sources: [SOURCES.production, SOURCES.subsidiary], followUps: ["Which company declined?"] };
  }
  if (s.includes("declin")) {
    return { content: "SCCL declined from 70.02 MT to 69.01 MT (−1.01 MT). Within CIL, SECL declined by 19.8 MT (illustrative split).", meta: { source: AR, dataset: "Production", period: "FY2023-24 vs FY2024-25", status: "Actual", confidence: 95 }, sources: [SOURCES.production, SOURCES.subsidiary], followUps: ["Show dispatch comparison."] };
  }
  if (s.includes("import")) {
    return {
      content: "Coal imports rose from 209.02 MT (FY2021-22) to a peak of 264.53 MT (FY2023-24) and declined to 243.62 MT in FY2024-25 (−7.9%). Only four years are available in the source dataset; FY2025-26 annual data is not yet reported.",
      meta: { source: AR, dataset: "Imports", period: "FY2021-22 – FY2024-25", status: "Actual", confidence: 98 },
      table: { columns: ["Period", "Total Import (MT)"], rows: [["FY2021-22", 209.02], ["FY2022-23", 237.67], ["FY2023-24", 264.53], ["FY2024-25", 243.62]] },
      chart: { xKey: "fy", keys: ["Imports"], data: [["FY2021-22", 209.02], ["FY2022-23", 237.67], ["FY2023-24", 264.53], ["FY2024-25", 243.62]].map(([fy, v]) => ({ fy, Imports: v })) },
      sources: [SOURCES.imports],
      followUps: ["Break down FY2024-25 imports by type", "What are the major coal demand sectors?"],
    };
  }
  if (s.includes("demand") || s.includes("sector")) {
    return {
      content: "Total coal demand in FY2024-25 was 1267.13 MT. Power (Utility) dominated at 905.78 MT (71.5%), followed by Other (217.87 MT), Coking – Steel + Coke Oven (67.91 MT) and Power (Captive) (62.45 MT).",
      meta: { source: AR, dataset: "Demand", period: "FY2024-25", status: "Actual", confidence: 99 },
      table: { columns: ["Sector", "Demand (MT)"], rows: [["Power (Utility)", 905.78], ["Other", 217.87], ["Coking – Steel + Coke Oven", 67.91], ["Power (Captive)", 62.45], ["Cement", 7.75], ["Sponge Iron", 7.37], ["Total", 1267.13]] },
      sources: [SOURCES.demand],
      followUps: ["Show coal imports for the last five years.", "Compare FY2023-24 and FY2024-25 production."],
    };
  }
  if (s.includes("summar") || s.includes("annual report")) {
    return {
      content: "**Ministry of Coal Annual Report 2025-26 — summary**\n\n• All-India production: 1047.52 MT in FY2024-25 (+5.0%).\n• CIL: 781.06 MT; SCCL: 69.01 MT; Captive & Others: 197.46 MT.\n• Apr–Dec 2025 (provisional): 721.65 MT.\n• Imports fell to 243.62 MT from 264.53 MT.\n• Demand: 1267.13 MT, led by the power sector.",
      meta: { source: AR, dataset: "Document: Annual Report 2025-26", period: "FY2024-25", status: "Actual", confidence: 97 },
      docs: [{ id: "doc-ar-2526", name: "Ministry of Coal Annual Report 2025-26.pdf" }],
      sources: [SOURCES.production, SOURCES.imports, SOURCES.demand],
      followUps: ["Generate a parliamentary response on coal production.", "What are the major coal demand sectors?"],
    };
  }
  if (s.includes("dispatch")) {
    return {
      content: "Found 2 processed documents mentioning coal dispatch. Illustrative dispatch data shows CIL offtake of 763.5 MT in FY2024-25 versus 753.5 MT in FY2023-24.",
      meta: { source: "Document index", dataset: "Dispatch", period: "FY2023-24 – FY2024-25", status: "Illustrative", confidence: 90 },
      docs: [{ id: "doc-dispatch-q3", name: "Coal Dispatch Statement Q3 2025.pdf" }, { id: "doc-ar-2526", name: "Ministry of Coal Annual Report 2025-26.pdf" }],
      chart: { xKey: "company", keys: ["FY2023-24", "FY2024-25"], data: [["CIL", 753.5, 763.5], ["SCCL", 69.9, 68.9], ["Captive & Others", 149.6, 193.2]].map(([c, a, b]) => ({ company: c, "FY2023-24": a, "FY2024-25": b })) },
      sources: [SOURCES.dispatch],
      followUps: ["Generate a dispatch report", "Compare coal production across CIL subsidiaries."],
    };
  }
  if (s.includes("production") || s.includes("2024-25") || s.includes("india")) {
    return {
      content: "India's total coal production in FY2024-25 was **1047.52 MT**, up from 997.25 MT in FY2023-24. CIL contributed 781.06 MT, SCCL 69.01 MT and Captive & Others 197.46 MT.",
      meta: { source: AR, dataset: "Production", period: "FY2024-25", status: "Actual", confidence: 99 },
      table: { columns: ["Company", "FY2024-25 (MT)"], rows: [["CIL", 781.06], ["SCCL", 69.01], ["Captive & Others", 197.46], ["Total", 1047.52]] },
      sources: [SOURCES.production],
      followUps: ["Compare FY2023-24 and FY2024-25 production.", "Compare coal production across CIL subsidiaries."],
    };
  }
  return {
    content: "I couldn't find a source-backed answer for that in the indexed datasets or documents. In demo mode I can answer questions about coal production, subsidiaries, imports, demand, dispatch, CMPDI financials and the processed annual reports.",
    followUps: SUGGESTED_QUESTIONS.slice(0, 3),
  };
}

export async function queryAssistant(question: string): Promise<AIMessage> {
  return mockCall("query", () => ({ id: id(), role: "assistant" as const, ...answer(question) }), 900);
}
