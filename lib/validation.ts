import { z } from "zod";
import { TOOL_NAMES } from "@/lib/audit-engine/types";

const toolInputSchema = z.object({
  tool: z.enum(TOOL_NAMES),
  active: z.boolean(),
  planType: z.string().min(1, "Pick a plan"),
  monthlySpend: z.coerce.number().min(0),
  seats: z.coerce.number().int().min(0)
});

export const auditInputSchema = z.object({
  teamSize: z.coerce.number().int().min(1).max(5000),
  primaryUseCase: z.string().min(8).max(140),
  tools: z.array(toolInputSchema).length(TOOL_NAMES.length)
});

export const leadCaptureSchema = z.object({
  auditId: z.string().min(6),
  email: z.string().email(),
  company: z.string().min(2).max(120),
  role: z.string().min(2).max(80),
  teamSize: z.coerce.number().int().min(1).max(5000),
  honeypot: z.string().max(0)
});

export type AuditInputDTO = z.infer<typeof auditInputSchema>;
export type LeadCaptureDTO = z.infer<typeof leadCaptureSchema>;
