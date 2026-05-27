import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit-engine";
import { TOOL_NAMES } from "@/lib/audit-engine/types";

function makeTools(overrides: Partial<Record<(typeof TOOL_NAMES)[number], { active: boolean; planType: string; monthlySpend: number; seats: number }>> = {}) {
  return TOOL_NAMES.map((tool) => {
    const override = overrides[tool];
    return {
      tool,
      active: override?.active ?? false,
      planType: override?.planType ?? "pro",
      monthlySpend: override?.monthlySpend ?? 0,
      seats: override?.seats ?? 0
    };
  });
}

describe("audit engine", () => {
  it("finds a Cursor downgrade opportunity for a small team", () => {
    const report = runAudit({
      teamSize: 3,
      primaryUseCase: "product engineering",
      tools: makeTools({
        Cursor: { active: true, planType: "business", monthlySpend: 320, seats: 8 }
      })
    });

    const cursor = report.recommendations.find((item) => item.tool === "Cursor");
    expect(cursor?.savings).toBeGreaterThan(0);
    expect(cursor?.type).toBe("downgrade");
    expect(report.totals.monthlySavings).toBeGreaterThan(0);
  });

  it("flags seat rightsizing when seats exceed team size", () => {
    const report = runAudit({
      teamSize: 4,
      primaryUseCase: "shipping features",
      tools: makeTools({
        "GitHub Copilot": { active: true, planType: "business", monthlySpend: 190, seats: 10 }
      })
    });

    const copilot = report.recommendations.find((item) => item.tool === "GitHub Copilot");
    expect(copilot?.confidence).toBeGreaterThanOrEqual(60);
    expect(copilot?.recommendation.toLowerCase()).toContain("rightsize");
  });

  it("keeps API spend analysis deterministic", () => {
    const report = runAudit({
      teamSize: 8,
      primaryUseCase: "internal tooling with lots of prompt traffic",
      tools: makeTools({
        "Anthropic API": { active: true, planType: "api", monthlySpend: 600, seats: 0 }
      })
    });

    const api = report.recommendations.find((item) => item.tool === "Anthropic API");
    expect(api?.type).toBe("api-optimization");
    expect(api?.savings).toBeGreaterThan(0);
    expect(api?.reasoning).toMatch(/prompt routing|caching/i);
  });

  it("produces strong CTA messaging for meaningful savings", () => {
    const report = runAudit({
      teamSize: 5,
      primaryUseCase: "prototype and internal ops",
      tools: makeTools({
        Cursor: { active: true, planType: "business", monthlySpend: 400, seats: 10 },
        Claude: { active: true, planType: "team", monthlySpend: 300, seats: 10 },
        Windsurf: { active: true, planType: "business", monthlySpend: 400, seats: 10 },
        "OpenAI API": { active: true, planType: "api", monthlySpend: 1500, seats: 0 }
      })
    });

    expect(report.ctaLevel).toBe("strong");
    expect(report.totals.monthlySavings).toBeGreaterThanOrEqual(500);
  });

  it("stays honest when savings are minimal", () => {
    const report = runAudit({
      teamSize: 2,
      primaryUseCase: "light experimentation",
      tools: makeTools({
        Claude: { active: true, planType: "pro", monthlySpend: 20, seats: 1 }
      })
    });

    expect(report.ctaLevel).toBe("honest");
    expect(report.totals.monthlySavings).toBeLessThan(100);
  });

  it("returns zeroed totals when no tools are active", () => {
    const report = runAudit({
      teamSize: 6,
      primaryUseCase: "engineering",
      tools: makeTools()
    });

    expect(report.recommendations).toHaveLength(0);
    expect(report.totals.monthlySavings).toBe(0);
    expect(report.confidenceLabel).toBe("light");
  });
});
