"use client";

import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { leadCaptureSchema, type LeadCaptureDTO } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadCaptureForm({ reportId, teamSize }: { reportId: string; teamSize: number }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadCaptureDTO>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      auditId: reportId,
      email: "",
      company: "",
      role: "",
      teamSize,
      honeypot: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    setError(null);
    setIsSubmitting(true);
    void (async () => {
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });

        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error ?? "Could not submit the form.");
          return;
        }

        setSubmitted(true);
      } catch {
        setError("Could not submit the form right now.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Lead captured
        </div>
        <p className="mt-2 text-emerald-100/80">Thanks. The Credex team can follow up with a tailored savings review.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="hidden">
        <Label htmlFor="honeypot">Company website</Label>
        <Input id="honeypot" {...form.register("honeypot")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="founder@company.com" {...form.register("email")} />
        </Field>
        <Field label="Company" error={form.formState.errors.company?.message}>
          <Input placeholder="Northstar Labs" {...form.register("company")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role" error={form.formState.errors.role?.message}>
          <Input placeholder="Head of Engineering" {...form.register("role")} />
        </Field>
        <Field label="Team size" error={form.formState.errors.teamSize?.message}>
          <Input type="number" min="1" {...form.register("teamSize")} />
        </Field>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get the Credex follow-up"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
