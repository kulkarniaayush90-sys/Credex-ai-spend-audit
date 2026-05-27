import type { AuditReport } from "@/lib/audit-engine";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type LeadRecord = {
  auditId: string;
  email: string;
  company: string;
  role: string;
  teamSize: number;
  createdAt: string;
};

type MemoryStore = {
  reports: Map<string, AuditReport>;
  leads: LeadRecord[];
};

const globalStore = globalThis as typeof globalThis & { __credexStore?: MemoryStore };

function getStore() {
  if (!globalStore.__credexStore) {
    globalStore.__credexStore = {
      reports: new Map<string, AuditReport>(),
      leads: []
    };
  }

  return globalStore.__credexStore;
}

export async function saveAuditReport(report: AuditReport) {
  getStore().reports.set(report.id, report);
  return report;
}

export async function getAuditReport(id: string) {
  const cached = getStore().reports.get(id);
  if (cached) {
    return cached;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("audit_reports").select("report_json").eq("id", id).maybeSingle();
  if (error || !data?.report_json) {
    return null;
  }

  const report = data.report_json as AuditReport;
  getStore().reports.set(id, report);
  return report;
}

export async function saveLeadRecord(record: LeadRecord) {
  getStore().leads.push(record);
  return record;
}

export async function getLeadRecords() {
  return getStore().leads;
}
