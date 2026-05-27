import type { AuditReport } from "@/lib/audit-engine";

export type AuditSuccessResponse = {
  report: AuditReport;
  publicUrl: string;
};

export type AuditErrorResponse = {
  error: string;
  issues?: unknown;
};

export type AuditApiResponse = AuditSuccessResponse | AuditErrorResponse;

