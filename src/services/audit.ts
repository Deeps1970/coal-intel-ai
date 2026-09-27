export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  reference: string;
  status: string;
}

const KEY = "coalintel.audit.v1";

export function listAuditEntries(): AuditEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const entries = JSON.parse(localStorage.getItem(KEY) ?? "[]") as AuditEntry[];
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export function recordAudit(action: string, module: string, reference: string, status = "Completed") {
  if (typeof localStorage === "undefined") return;
  const entry: AuditEntry = {
    id: globalThis.crypto?.randomUUID?.() ?? `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: "Demo User",
    action,
    module,
    reference,
    status,
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...listAuditEntries()].slice(0, 500)));
}
