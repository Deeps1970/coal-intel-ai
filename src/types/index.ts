export type DataStatus = "Actual" | "Provisional" | "Target" | "Projection" | "Illustrative";

export interface SourceReference {
  id: string;
  document: string;
  section?: string;
  page?: number;
  table?: string;
  period: string;
  status: DataStatus;
  confidence: number;
  excerpt?: string;
}

export type DocStatus =
  | "Uploaded"
  | "Processing"
  | "Processed"
  | "Needs Validation"
  | "Validated"
  | "Failed";

export type FileType = "PDF" | "DOCX" | "XLSX" | "CSV" | "PNG" | "JPG" | "JPEG";

export interface Entity {
  id: string;
  label: string;
  type:
    | "Company"
    | "Coalfield"
    | "Mine"
    | "Production"
    | "Dispatch"
    | "Financial Year"
    | "Location"
    | "Quantity"
    | "Date";
  page?: number;
  confidence: number;
}

export interface CoalDocument {
  id: string;
  name: string;
  type: FileType;
  source: string;
  department: string;
  category: string;
  uploadedAt: string;
  status: DocStatus;
  accuracy: number | null;
  topics: string[];
  pages: number;
  records: number;
  entities: Entity[];
  sizeMb: number;
  summary: string;
  excerpt: string;
  tables: { caption: string; ref: string; columns: string[]; rows: (string | number)[][] }[];
  pipeline: PipelineStage[];
}

export type StageStatus = "done" | "running" | "pending" | "error" | "warning";
export interface PipelineStage {
  key: string;
  label: string;
  status: StageStatus;
  detail: string;
}

export interface DatasetColumn {
  key: string;
  label: string;
  numeric?: boolean;
  unit?: string;
}

export type DatasetRecord = { id: string } & Record<string, string | number>;

export interface Dataset {
  id: string;
  name: string;
  description: string;
  unit: string;
  source: SourceReference;
  columns: DatasetColumn[];
  records: DatasetRecord[];
}

export type ReportStatus = "Draft" | "Generated" | "Under Review" | "Validated" | "Published";

export interface Report {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  author: string;
  sources: string[];
  period: string;
  format: "PDF" | "DOCX" | "XLSX";
  validation: "Pending" | "Passed" | "Partial";
  status: ReportStatus;
}

export interface Topic {
  id: string;
  name: string;
  frequency: number;
  documents: number;
  pages: number[];
  trend: { fy: string; mentions: number }[];
  keywords: string[];
  entities: string[];
  relatedDocIds: string[];
}

export type ValidationStatus = "Validated" | "Review Required" | "Conflict" | "Missing Source";

export interface ValidationRecord {
  id: string;
  record: string;
  entity: string;
  source: SourceReference;
  extracted: string;
  expected: string;
  status: ValidationStatus;
  confidence: number;
  extractedText: string;
  history: { at: string; by: string; action: string }[];
}

export interface AIMeta {
  source: string;
  dataset: string;
  period: string;
  status: DataStatus;
  confidence: number;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  meta?: AIMeta;
  table?: { columns: string[]; rows: (string | number)[][] };
  chart?: { data: Record<string, string | number>[]; keys: string[]; xKey: string };
  sources?: SourceReference[];
  docs?: { id: string; name: string }[];
  followUps?: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  time: string;
  tone: "success" | "warning" | "info" | "error";
  read: boolean;
}
