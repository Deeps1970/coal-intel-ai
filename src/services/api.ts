/**
 * API boundary. Every service call goes through `mockCall`, keyed by the
 * FastAPI endpoint it will map to. To integrate the Python backend, replace
 * `mockCall` with a fetch to `${API_BASE}${endpoint}` — components stay unchanged.
 */
export const API_ENDPOINTS = {
  uploadDocument: "POST /api/documents/upload",
  listDocuments: "GET /api/documents",
  getDocument: "GET /api/documents/:id",
  processDocument: "POST /api/documents/:id/process",
  listDatasets: "GET /api/datasets",
  datasetRecords: "GET /api/datasets/:id/records",
  query: "POST /api/query",
  generateReport: "POST /api/reports/generate",
  listReports: "GET /api/reports",
  validation: "POST /api/validation",
  listTopics: "GET /api/topics",
} as const;

export type Endpoint = keyof typeof API_ENDPOINTS;

export async function mockCall<T>(_endpoint: Endpoint, resolver: () => T, latency = 350): Promise<T> {
  await new Promise((r) => setTimeout(r, latency + Math.random() * 150));
  return structuredClone(resolver());
}
