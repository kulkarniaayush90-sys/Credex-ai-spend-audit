import { AUDIT_RULES } from "@/lib/audit-engine/pricing-data";
import { evaluateTool } from "@/lib/audit-engine/rules";
import type { AuditInput, AuditReport, ToolRecommendation } from "@/lib/audit-engine/types";

function confidenceLabelFromSavings(monthlySavings: number) {
  if (monthlySavings >= AUDIT_RULES.strongSavingsThreshold) return "strong" as const;
  if (monthlySavings >= AUDIT_RULES.honestSavingsThreshold) return "medium" as const;
  return "light" as const;
}

function ctaLevelFromSavings(monthlySavings: number) {
  if (monthlySavings >= AUDIT_RULES.strongSavingsThreshold) return "strong" as const;
  if (monthlySavings >= AUDIT_RULES.honestSavingsThreshold) return "soft" as const;
  return "honest" as const;
}

function buildTemplateSummary(input: AuditInput, recommendations: ToolRecommendation[], totalsMonthly: number) {
  const top = [...recommendations].sort((a, b) => b.savings - a.savings).slice(0, 2);
  const lead = top.length
    ? `${top[0].tool} is your biggest savings lever`
    : "your current stack is already fairly lean";
  const second = top[1] ? `, with ${top[1].tool} as a secondary optimization` : "";
  const urgency =
    totalsMonthly >= AUDIT_RULES.strongSavingsThreshold
      ? "This stack is leaving meaningful money on the table."
      : totalsMonthly >= AUDIT_RULES.honestSavingsThreshold
        ? "There is real savings potential without hurting team productivity."
        : "The stack is reasonably efficient, so the best move is to validate renewals carefully.";

  return `Based on a team of ${input.teamSize} and a ${input.primaryUseCase.toLowerCase()} workflow, ${lead}${second}. ${urgency} The recommended changes are focused on plan rightsizing, seat cleanup, and cheaper options that preserve day-to-day output.`;
}

export function runAudit(input: AuditInput): AuditReport {
  const recommendations = input.tools
    .map((toolInput) => evaluateTool(input, toolInput))
    .filter((item): item is ToolRecommendation => item !== null);

  const monthlyCurrent = recommendations.reduce((sum, item) => sum + item.currentSpend, 0);
  const monthlyOptimized = recommendations.reduce((sum, item) => sum + item.optimizedSpend, 0);
  const monthlySavings = Math.max(0, monthlyCurrent - monthlyOptimized);
  const annualSavings = monthlySavings * 12;

  return {
    id: crypto.randomUUID().split("-")[0],
    createdAt: new Date().toISOString(),
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    summary: buildTemplateSummary(input, recommendations, monthlySavings),
    confidenceLabel: confidenceLabelFromSavings(monthlySavings),
    ctaLevel: ctaLevelFromSavings(monthlySavings),
    totals: {
      monthlyCurrent,
      monthlyOptimized,
      monthlySavings,
      annualSavings
    },
    recommendations: recommendations.sort((a, b) => b.savings - a.savings)
  };
}
