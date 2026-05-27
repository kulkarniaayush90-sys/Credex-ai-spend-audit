"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { auditInputSchema } from "@/lib/validation";
import { useAuditStore } from "@/state/use-audit-store";
import { TOOL_NAMES } from "@/lib/audit-engine/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AuditResults } from "@/components/audit/audit-results";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditInput, AuditReport } from "@/lib/audit-engine";
import { defaultAuditDraft } from "@/state/use-audit-store";
import type { AuditApiResponse } from "@/lib/api/contracts";

export function AuditWorkbench() {
  const { draft, setDraft } = useAuditStore();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuditInput>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: draft ?? defaultAuditDraft
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "tools"
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setDraft(value as AuditInput);
    });

    return () => subscription.unsubscribe();
  }, [form, setDraft]);

  const watched = form.watch();

  const activeCount = useMemo(() => watched.tools.filter((tool) => tool.active).length, [watched.tools]);

  const onSubmit = form.handleSubmit((values) => {
    setError(null);
    setIsSubmitting(true);
    void (async () => {
      try {
        const response = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });

        const payload = (await response.json()) as AuditApiResponse;
        if (!response.ok || !("report" in payload)) {
          setError("error" in payload ? payload.error : "The audit could not be generated.");
          return;
        }

        setReport(payload.report);
        setPublicUrl(payload.publicUrl ?? null);
        window.history.replaceState(null, "", `/audit/${payload.report.id}`);
      } catch {
        setError("The audit could not be generated right now.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  });

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-white/10 via-transparent to-cyan-500/10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted">Free AI spend audit</Badge>
            <Badge tone="muted">{activeCount} tools selected</Badge>
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Map your AI stack and find waste fast</CardTitle>
          <CardDescription className="max-w-3xl text-base text-slate-300">
            Pick the tools you actually use, set your current plans, and let the deterministic audit engine calculate where
            the savings are. AI only writes the summary, never the math.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Team size">
              <Input type="number" min="1" {...form.register("teamSize")} />
            </Field>
            <Field label="Primary use case">
              <Textarea placeholder="e.g. Product engineering, content ops, internal tooling" {...form.register("primaryUseCase")} />
            </Field>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{TOOL_NAMES[index]}</h3>
                      <Badge tone={form.watch(`tools.${index}.active`) ? "success" : "muted"}>
                        {form.watch(`tools.${index}.active`) ? "included" : "inactive"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">Configure the current plan, spend, and seat footprint.</p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10" {...form.register(`tools.${index}.active`)} />
                    Use this tool
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Field label="Plan">
                    <Select {...form.register(`tools.${index}.planType`)}>
                      <option value="free">Free</option>
                      <option value="individual">Individual</option>
                      <option value="pro">Pro</option>
                      <option value="team">Team</option>
                      <option value="business">Business</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="api">API</option>
                      <option value="usage">Usage</option>
                    </Select>
                  </Field>
                  <Field label="Monthly spend">
                    <Input type="number" min="0" step="1" {...form.register(`tools.${index}.monthlySpend`)} />
                  </Field>
                  <Field label="Seats">
                    <Input type="number" min="0" step="1" {...form.register(`tools.${index}.seats`)} />
                  </Field>
                </div>
              </motion.div>
            ))}
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" disabled={isSubmitting} className="rounded-full px-6">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="inline-flex items-center gap-2">Run audit <ArrowRight className="h-4 w-4" /></span>}
          </Button>
        </CardContent>
      </Card>

      {isSubmitting && !report ? (
        <Card>
          <CardHeader>
            <CardTitle>Building your report</CardTitle>
            <CardDescription>We are calculating the deterministic recommendations and preparing the summary.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </CardContent>
        </Card>
      ) : null}

      {report ? <AuditResults report={report} publicUrl={publicUrl ?? `/audit/${report.id}`} /> : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
