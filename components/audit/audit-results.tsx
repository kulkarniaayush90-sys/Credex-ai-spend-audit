"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, BarChart3, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LeadCaptureForm } from "@/components/audit/lead-capture-form";
import { formatCurrency } from "@/lib/utils";
import type { AuditReport } from "@/lib/audit-engine";

export function AuditResults({ report, publicUrl }: { report: AuditReport; publicUrl?: string }) {
  const [copied, setCopied] = useState(false);
  const ctaCopy =
    report.ctaLevel === "strong"
      ? "Credex can likely save you meaningful budget this quarter."
      : report.ctaLevel === "soft"
        ? "There are real savings here, but we should keep the message grounded."
        : "Your stack looks fairly efficient. We can still help with a renewal check.";

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-none bg-gradient-to-br from-cyan-500/15 via-transparent to-violet-500/10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={report.confidenceLabel === "strong" ? "success" : report.confidenceLabel === "medium" ? "warning" : "muted"}>
              {report.confidenceLabel} confidence
            </Badge>
            <Badge tone="muted">Public audit #{report.id}</Badge>
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Audit results</CardTitle>
          <CardDescription className="max-w-3xl text-base text-slate-300">{report.summary}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Metric label="Current monthly spend" value={formatCurrency(report.totals.monthlyCurrent)} icon={<BarChart3 className="h-4 w-4" />} />
          <Metric label="Optimized monthly spend" value={formatCurrency(report.totals.monthlyOptimized)} icon={<TrendingDown className="h-4 w-4" />} />
          <Metric label="Annual savings" value={formatCurrency(report.totals.annualSavings)} icon={<Sparkles className="h-4 w-4" />} />
        </CardContent>
        <CardFooter className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-white">{ctaCopy}</p>
            <p className="text-sm text-slate-300">
              {report.ctaLevel === "strong"
                ? "This is a good conversation starter for the Credex team."
                : report.ctaLevel === "soft"
                  ? "We will lead with specific changes, not hype."
                  : "The most honest story here is efficiency, not heavy savings."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <ArrowRight className="h-4 w-4" />
            Shareable report ready
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tool-by-tool recommendations</CardTitle>
            <CardDescription>Deterministic audit logic keeps the recommendations auditable and repeatable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {publicUrl ? (
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">Public share URL</p>
                    <p className="mt-1 break-all text-sm text-slate-300">{publicUrl}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={async () => {
                      await navigator.clipboard.writeText(publicUrl);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1800);
                    }}
                  >
                    {copied ? "Copied" : "Copy link"}
                  </Button>
                </div>
              </div>
            ) : null}
            {report.recommendations.map((item) => (
              <div key={item.tool} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.tool}</p>
                    <p className="mt-1 text-sm text-slate-300">{item.recommendation}</p>
                  </div>
                  <Badge tone={item.savings > 0 ? "success" : "muted"}>{formatCurrency(item.savings)}/mo savings</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.reasoning}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Stat label="Current spend" value={formatCurrency(item.currentSpend)} />
                  <Stat label="Optimized spend" value={formatCurrency(item.optimizedSpend)} />
                  <Stat label="Confidence" value={`${item.confidence}%`} />
                </div>
                {item.alternative ? (
                  <div className="mt-3 flex items-center gap-2 text-xs text-cyan-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Alternative considered: {item.alternative}
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spend chart</CardTitle>
              <CardDescription>A simple visual compare of current vs optimized monthly spend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MiniBar label="Current" value={report.totals.monthlyCurrent} max={Math.max(report.totals.monthlyCurrent, report.totals.monthlyOptimized)} />
              <MiniBar label="Optimized" value={report.totals.monthlyOptimized} max={Math.max(report.totals.monthlyCurrent, report.totals.monthlyOptimized)} accent />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credex lead capture</CardTitle>
              <CardDescription>Capture a qualified lead after the user sees the value. This keeps the funnel honest.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeadCaptureForm reportId={report.id} teamSize={report.teamSize} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why this report feels trustworthy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <ReasonRow text="Deterministic audit rules, not AI math" />
              <ReasonRow text="Public URL contains only the opaque audit ID" />
              <ReasonRow text="Fallback summary keeps the report usable when AI fails" />
              <ReasonRow text="Lead form is protected with a honeypot and server-side validation" />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-1 font-medium text-white">{value}</div>
    </div>
  );
}

function MiniBar({ label, value, max, accent }: { label: string; value: number; max: number; accent?: boolean }) {
  const width = max ? Math.max(8, (value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white">{formatCurrency(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-white/10">
        <div
          className={accent ? "h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" : "h-3 rounded-full bg-gradient-to-r from-slate-500 to-slate-300"}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function ReasonRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
      <span>{text}</span>
    </div>
  );
}
