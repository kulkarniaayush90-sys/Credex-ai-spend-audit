import { auditInputSchema } from "@/lib/validation";
import { runAudit } from "@/lib/audit-engine";
import { buildPublicAuditUrl } from "@/lib/share";
import { generateAuditSummary } from "@/lib/summary";
import { saveAuditReport } from "@/lib/store";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AuditErrorResponse, AuditSuccessResponse } from "@/lib/api/contracts";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = auditInputSchema.safeParse(json);

  if (!parsed.success) {
    const response: AuditErrorResponse = {
      error: "Invalid audit payload",
      issues: parsed.error.flatten()
    };
    return Response.json(response, { status: 400 });
  }

  const baseReport = runAudit(parsed.data);
  const summary = await generateAuditSummary(baseReport);
  const report = await saveAuditReport({ ...baseReport, summary });

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("audit_reports").upsert({
        id: report.id,
        report_json: report,
        created_at: report.createdAt
      });
    } catch (error) {
      console.error("Failed to persist audit report", error);
    }
  }

  const response: AuditSuccessResponse = {
    report,
    publicUrl: buildPublicAuditUrl(report.id)
  };

  return Response.json(response);
}
