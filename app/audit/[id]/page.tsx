import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditResults } from "@/components/audit/audit-results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuditReport } from "@/lib/store";
import { buildPublicAuditUrl } from "@/lib/share";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Public Audit Report",
    description: "Public AI spend audit report with shareable results and open graph preview."
  };
}

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getAuditReport(id);

  if (!report) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Public audit report</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <div>Monthly current: {formatCurrency(report.totals.monthlyCurrent)}</div>
          <div>Monthly savings: {formatCurrency(report.totals.monthlySavings)}</div>
          <div>Annual savings: {formatCurrency(report.totals.annualSavings)}</div>
        </CardContent>
      </Card>
      <AuditResults report={report} publicUrl={buildPublicAuditUrl(report.id)} />
    </div>
  );
}
