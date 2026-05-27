import { describe, expect, it } from "vitest";
import { auditInputSchema, leadCaptureSchema } from "@/lib/validation";
import { TOOL_NAMES } from "@/lib/audit-engine/types";

function baseTools() {
  return TOOL_NAMES.map((tool) => ({
    tool,
    active: false,
    planType: "pro",
    monthlySpend: 0,
    seats: 0
  }));
}

describe("validation", () => {
  it("accepts a full audit payload", () => {
    const result = auditInputSchema.safeParse({
      teamSize: 12,
      primaryUseCase: "Product engineering and internal automation",
      tools: baseTools()
    });

    expect(result.success).toBe(true);
  });

  it("rejects short primary use cases", () => {
    const result = auditInputSchema.safeParse({
      teamSize: 12,
      primaryUseCase: "short",
      tools: baseTools()
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid lead capture honeypots", () => {
    const result = leadCaptureSchema.safeParse({
      auditId: "abc12345",
      email: "founder@credex.ai",
      company: "Credex",
      role: "Founder",
      teamSize: 10,
      honeypot: "spam"
    });

    expect(result.success).toBe(false);
  });
});

