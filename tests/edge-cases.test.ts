import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit-engine";
import { TOOL_NAMES } from "@/lib/audit-engine/types";

function inactiveTools() {
  return TOOL_NAMES.map((tool) => ({
    tool,
    active: false,
    planType: "pro",
    monthlySpend: 0,
    seats: 0
  }));
}

describe("edge cases", () => {
  it("handles high team sizes without overflowing calculations", () => {
    const report = runAudit({
      teamSize: 4500,
      primaryUseCase: "Enterprise delivery organization",
      tools: inactiveTools()
    });

    expect(report.teamSize).toBe(4500);
    expect(report.totals.monthlySavings).toBe(0);
  });

  it("handles mixed tool stacks", () => {
    const tools = inactiveTools().map((tool) =>
      tool.tool === "ChatGPT" || tool.tool === "Windsurf"
        ? { ...tool, active: true, monthlySpend: tool.tool === "ChatGPT" ? 25 : 30, seats: 5 }
        : tool
    );

    const report = runAudit({
      teamSize: 5,
      primaryUseCase: "Design and product support",
      tools
    });

    expect(report.recommendations.length).toBe(2);
    expect(report.totals.monthlyCurrent).toBeGreaterThan(0);
  });
});

