import Anthropic from "@anthropic-ai/sdk";
import { env, isAnthropicConfigured } from "@/lib/env";
import type { AuditReport } from "@/lib/audit-engine";

function buildPrompt(report: AuditReport) {
  const wins = report.recommendations
    .slice(0, 3)
    .map(
      (item) =>
        `${item.tool}: save ${Math.round(item.savings)} per month by ${item.recommendation.toLowerCase()}`
    )
    .join("; ");

  return [
    "You are writing a concise SaaS spend audit summary for a startup founder.",
    "Tone: crisp, credible, warm, specific.",
    "Length: around 100 words.",
    "Do not invent savings beyond the report data.",
    `Team size: ${report.teamSize}.`,
    `Primary use case: ${report.primaryUseCase}.`,
    `Monthly savings: $${Math.round(report.totals.monthlySavings)}.`,
    `Key opportunities: ${wins}.`,
    "Close with a practical next step and avoid hype."
  ].join("\n");
}

export async function generateAuditSummary(report: AuditReport) {
  if (!isAnthropicConfigured()) {
    return report.summary;
  }

  try {
    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY! });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 220,
      temperature: 0.4,
      system:
        "You summarize AI spend audit results for startup teams. Stay accurate, concise, and grounded in the numbers provided.",
      messages: [{ role: "user", content: buildPrompt(report) }]
    });

    const content = response.content
      .map((item) => ("text" in item ? item.text : ""))
      .join("")
      .trim();

    return content || report.summary;
  } catch {
    return report.summary;
  }
}
