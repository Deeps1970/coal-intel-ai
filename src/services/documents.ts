import { buildPipeline, DOCUMENTS } from "@/data/documents";
import type { CoalDocument, FileType } from "@/types";
import { mockCall } from "./api";
import { recordAudit } from "./audit";

const KEY = "coalintel.uploaded-documents.v1";
const store: CoalDocument[] = [...DOCUMENTS];
function syncStore() {
  if (typeof localStorage === "undefined") return;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as CoalDocument[];
    for (const item of saved) if (!store.some((d) => d.id === item.id)) store.unshift(item);
    for (const item of saved) { const index = store.findIndex((d) => d.id === item.id); if (index >= 0) store[index] = item; }
  } catch { /* keep in-memory demo documents */ }
}
function persistUploads() {
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(store.filter((d) => d.id.startsWith("doc-upload-"))));
}

export const ACCEPTED_TYPES: FileType[] = ["PDF", "DOCX", "XLSX", "CSV", "PNG", "JPG", "JPEG"];
export const MAX_MB = 50;

export const listDocuments = () => mockCall("listDocuments", () => { syncStore(); return store; });
export const getDocument = (id: string) =>
  mockCall("getDocument", () => {
    syncStore();
    const d = store.find((x) => x.id === id);
    if (!d) throw new Error("Document not found");
    return d;
  });

export function validateFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toUpperCase() as FileType;
  if (!ACCEPTED_TYPES.includes(ext)) return `Unsupported file type .${ext?.toLowerCase()}`;
  if (file.size > MAX_MB * 1024 * 1024) return `File exceeds ${MAX_MB} MB limit`;
  return null;
}

export async function uploadDocument(file: File, meta: { department: string; category: string }) {
  return mockCall(
    "uploadDocument",
    () => {
      const ext = file.name.split(".").pop()!.toUpperCase() as FileType;
      const doc: CoalDocument = {
        id: `doc-upload-${Date.now().toString(36)}`,
        name: file.name,
        type: ext,
        source: "Uploaded by Demo User",
        department: meta.department,
        category: meta.category,
        uploadedAt: new Date().toISOString().slice(0, 10),
        status: "Processing",
        accuracy: null,
        topics: [],
        pages: Math.max(1, Math.round(file.size / 60000)),
        records: 0,
        entities: [],
        sizeMb: +(file.size / 1024 / 1024).toFixed(2),
        summary: "Processing — summary will be available after entity extraction.",
        excerpt: "Text extraction in progress…",
        tables: [],
        pipeline: buildPipeline(1, "running"),
      };
      store.unshift(doc);
      persistUploads();
      recordAudit("Uploaded document", "Documents", doc.id, "Uploaded");
      return doc;
    },
    200,
  );
}

/** Simulates the async pipeline advancing one stage. Returns updated doc. */
export async function processDocument(id: string) {
  return mockCall(
    "processDocument",
    () => {
      syncStore();
      const d = store.find((x) => x.id === id);
      if (!d) throw new Error("Document not found");
      const idx = d.pipeline.findIndex((s) => s.status !== "done");
      if (idx === -1) return d;
      d.pipeline[idx].status = "done";
      if (idx + 1 < d.pipeline.length) d.pipeline[idx + 1].status = "running";
      if (idx === d.pipeline.length - 1) {
        d.status = "Processed";
        d.accuracy = 96.2;
        d.records = Math.max(8, Math.round(d.pages * 5.4));
        d.topics = ["Coal Production", "Mining", "Dispatch"];
        d.summary = `Demo extraction complete for ${d.name}. The local pipeline classified the document, identified coal-sector entities, extracted a sample table and indexed its simulated text. Original file contents are not uploaded or OCR-processed in this prototype.`;
        d.excerpt = `${d.name}\n\nDEMO EXTRACT — simulated local content.\n\nCoal-sector records identified for review. Reporting period: FY2024-25. Production, dispatch and company references below are representative demo values and must be checked against the source document before use.`;
        d.entities = [
          { id: "e1", label: "Coal India Limited", type: "Company", confidence: 96.1 },
          { id: "e2", label: "CMPDI", type: "Company", confidence: 94.8 },
          { id: "e3", label: "SCCL", type: "Company", confidence: 93.4 },
          { id: "e4", label: "FY2024-25", type: "Financial Year", confidence: 97.2 },
          { id: "e5", label: "Coal Production", type: "Production", confidence: 95.5 },
          { id: "e6", label: "Coal Dispatch", type: "Dispatch", confidence: 91.8 },
        ];
        d.tables = [{ caption: "Illustrative extracted coal-sector metrics", ref: "Demo extract • Table 1", columns: ["Metric", "Period", "Value", "Status"], rows: [["Coal production", "FY2024-25", "1,047.52 MT", "Actual — source-derived"], ["Coal imports", "FY2024-25", "243.62 MT", "Actual — source-derived"], ["Dispatch", "FY2024-25", "Illustrative", "Demo only"]] }];
        recordAudit("Completed simulated processing", "Documents", d.id, "Processed");
      }
      persistUploads();
      return d;
    },
    100,
  );
}

export async function setDocumentStatus(id: string, status: CoalDocument["status"]) {
  return mockCall("processDocument", () => {
    syncStore();
    const d = store.find((x) => x.id === id)!;
    d.status = status;
    recordAudit(status === "Validated" ? "Validated document" : `Updated document status to ${status}`, "Documents", id, status);
    if (status === "Validated") d.pipeline.forEach((s) => (s.status = "done"));
    persistUploads();
    return d;
  });
}
