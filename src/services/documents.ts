import { buildPipeline, DOCUMENTS } from "@/data/documents";
import type { CoalDocument, FileType } from "@/types";
import { mockCall } from "./api";

const store: CoalDocument[] = [...DOCUMENTS];

export const ACCEPTED_TYPES: FileType[] = ["PDF", "DOCX", "XLSX", "CSV", "PNG", "JPG", "JPEG"];
export const MAX_MB = 50;

export const listDocuments = () => mockCall("listDocuments", () => store);
export const getDocument = (id: string) =>
  mockCall("getDocument", () => {
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
        id: `doc-${Date.now().toString(36)}`,
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
      const d = store.find((x) => x.id === id);
      if (!d) throw new Error("Document not found");
      const idx = d.pipeline.findIndex((s) => s.status !== "done");
      if (idx === -1) return d;
      d.pipeline[idx].status = "done";
      if (idx + 1 < d.pipeline.length) d.pipeline[idx + 1].status = "running";
      if (idx === d.pipeline.length - 1) {
        d.status = "Processed";
        d.accuracy = 94 + Math.round(Math.random() * 50) / 10;
        d.records = 40 + Math.round(Math.random() * 200);
        d.topics = ["Coal Production", "Mining"];
        d.summary = "Demo extraction complete. Document classified and indexed for AI query.";
        d.excerpt = "Extracted text available. (Demo mode — content simulated.)";
        d.entities = [{ id: "e1", label: "CIL", type: "Company", confidence: 95.2 }];
      }
      return d;
    },
    100,
  );
}

export async function setDocumentStatus(id: string, status: CoalDocument["status"]) {
  return mockCall("processDocument", () => {
    const d = store.find((x) => x.id === id)!;
    d.status = status;
    if (status === "Validated") d.pipeline.forEach((s) => (s.status = "done"));
    return d;
  });
}
