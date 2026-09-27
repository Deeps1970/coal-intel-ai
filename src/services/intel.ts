import { TOPICS, KEYWORDS, VALIDATION, NOTIFICATIONS } from "@/data/misc";
import { DOCUMENTS } from "@/data/documents";
import { DATASETS } from "@/data/coal";
import { REPORTS } from "@/data/misc";
import type { ValidationRecord } from "@/types";
import { mockCall } from "./api";

const validation = [...VALIDATION];

export const listTopics = () => mockCall("listTopics", () => ({ topics: TOPICS, keywords: KEYWORDS }));
export const listValidation = () => mockCall("validation", () => validation);
export async function updateValidation(id: string, status: ValidationRecord["status"], action: string) {
  return mockCall("validation", () => {
    const v = validation.find((x) => x.id === id)!;
    v.status = status;
    v.history.unshift({ at: new Date().toISOString().slice(0, 16).replace("T", " "), by: "Demo User", action });
    return v;
  });
}
export const getNotifications = () => NOTIFICATIONS;

export const ENTITIES = [
  { id: "cil", name: "Coal India Limited", short: "CIL", kind: "Company" },
  { id: "sccl", name: "Singareni Collieries Company Limited", short: "SCCL", kind: "Company" },
  { id: "cmpdi", name: "Central Mine Planning & Design Institute", short: "CMPDI", kind: "Company" },
  { id: "mcl", name: "Mahanadi Coalfields Limited", short: "MCL", kind: "Company" },
  { id: "secl", name: "South Eastern Coalfields Limited", short: "SECL", kind: "Company" },
];

export function searchAll(q: string) {
  const s = q.toLowerCase().trim();
  const tokens = s.split(/\s+/).filter(Boolean);
  const hit = (text: string) => tokens.length > 0 && tokens.some((t) => text.toLowerCase().includes(t));
  let uploaded = [] as typeof DOCUMENTS;
  let reports = REPORTS;
  try {
    if (typeof localStorage !== "undefined") {
      uploaded = JSON.parse(localStorage.getItem("coalintel.uploaded-documents.v1") ?? "[]") as typeof DOCUMENTS;
      reports = JSON.parse(localStorage.getItem("coalintel.reports.v1") ?? "null") as typeof REPORTS ?? REPORTS;
      if (!Array.isArray(reports)) reports = REPORTS;
    }
  } catch { /* retain bundled sample index */ }
  const docs = [...uploaded, ...DOCUMENTS.filter((d) => !uploaded.some((u) => u.id === d.id))];
  return {
    documents: docs.filter((d) => hit(`${d.name} ${d.topics.join(" ")} ${d.summary}`)).slice(0, 5),
    datasets: DATASETS.filter((d) => hit(`${d.name} ${d.description}`)),
    reports: reports.filter((r) => hit(`${r.title} ${r.type}`)).slice(0, 4),
    topics: TOPICS.filter((t) => hit(`${t.name} ${t.keywords.join(" ")}`)).slice(0, 4),
    entities: ENTITIES.filter((e) => hit(`${e.name} ${e.short}`)),
  };
}
