import { AUDIT_RULES, PRICING_MODELS } from "@/lib/audit-engine/pricing-data";
import type { AuditInput, PlanPricing, ToolInput, ToolPricingModel } from "@/lib/audit-engine/types";
import { clamp } from "@/lib/utils";

function normalizePlan(planType: string) {
  return planType.trim().toLowerCase();
}

function findModel(tool: ToolInput["tool"]) {
  return PRICING_MODELS.find((model) => model.tool === tool);
}

function planMatches(plan: PlanPricing, inputPlan: string) {
  const normalized = normalizePlan(inputPlan);
  return plan.tier === normalized || plan.label.toLowerCase() === normalized;
}

function chooseCurrentPlan(model: ToolPricingModel, toolInput: ToolInput) {
  const exact = model.plans.find((plan) => planMatches(plan, toolInput.planType));
  return exact ?? model.plans[0];
}

function getEffectiveSeats(plan: PlanPricing, input: AuditInput, toolInput: ToolInput) {
  if (plan.billingMode !== "perSeat") {
    return 1;
  }

  const observedSeats = toolInput.seats > 0 ? toolInput.seats : input.teamSize;
  const minimumSeats = plan.minimumSeats ?? 1;
  return Math.max(minimumSeats, Math.max(1, observedSeats));
}

function getComparableSeats(input: AuditInput, toolInput: ToolInput, plan: PlanPricing) {
  if (plan.billingMode !== "perSeat") {
    return 1;
  }

  const currentSeats = toolInput.seats > 0 ? toolInput.seats : input.teamSize;
  const minimumSeats = plan.minimumSeats ?? 1;
  const targetSeats = Math.max(1, Math.min(currentSeats, input.teamSize));
  return Math.max(minimumSeats, targetSeats);
}

function estimatePlanSpend(plan: PlanPricing, input: AuditInput, toolInput: ToolInput, currentSpend: number) {
  if (plan.billingMode === "custom") {
    return currentSpend;
  }

  if (plan.billingMode === "usage") {
    return currentSpend;
  }

  if (plan.billingMode === "flat") {
    return plan.monthlyPrice;
  }

  const seats = getComparableSeats(input, toolInput, plan);
  const inferredUnitPrice = toolInput.seats > 0 ? currentSpend / toolInput.seats : plan.monthlyPrice;
  const effectiveUnitPrice = Math.max(0, Math.min(plan.monthlyPrice, inferredUnitPrice || plan.monthlyPrice));
  return effectiveUnitPrice * seats;
}

function chooseOptimizedPlan(model: ToolPricingModel, input: AuditInput, toolInput: ToolInput, currentSpend: number) {
  const currentPlan = chooseCurrentPlan(model, toolInput);

  if (model.category === "api" || currentPlan.billingMode === "custom") {
    return currentPlan;
  }

  const sameFamilyPlans = model.plans.filter((plan) => plan.billingMode === "perSeat" || plan.billingMode === "flat");
  const threshold = Math.max(25, currentSpend * AUDIT_RULES.downgradeThreshold);

  const candidates = sameFamilyPlans
    .map((plan) => ({
      plan,
      spend: estimatePlanSpend(plan, input, toolInput, currentSpend)
    }))
    .filter(({ plan, spend }) => {
      if (plan.tier === "free" && currentSpend > 0) {
        return false;
      }

      if (input.teamSize > 2 && (plan.tier === "free" || plan.tier === "individual")) {
        return false;
      }

      return spend < currentSpend - threshold;
    })
    .sort((a, b) => a.spend - b.spend);

  return candidates[0]?.plan ?? currentPlan;
}

function chooseAlternativeSpend(model: ToolPricingModel, input: AuditInput, toolInput: ToolInput, currentSpend: number, currentOptimizedSpend: number) {
  if (model.category === "api") {
    return null;
  }

  const threshold = Math.max(25, currentSpend * AUDIT_RULES.alternativeThreshold);
  const comparablePlan = model.alternatives
    .map((alternative) => {
      const seats = Math.max(1, Math.min(input.teamSize, toolInput.seats > 0 ? toolInput.seats : input.teamSize));
      const inferredUnitPrice = toolInput.seats > 0 ? currentSpend / toolInput.seats : alternative.monthlyPrice;
      const spend = Math.max(0, Math.min(alternative.monthlyPrice, inferredUnitPrice || alternative.monthlyPrice)) * seats;
      return { alternative, spend };
    })
    .filter(({ spend }) => spend < currentSpend - threshold && spend < currentOptimizedSpend)
    .sort((a, b) => a.spend - b.spend)[0];

  return comparablePlan ?? null;
}

function buildReasoning(model: ToolPricingModel, current: PlanPricing, optimized: PlanPricing, input: AuditInput, toolInput: ToolInput) {
  const seatGap = Math.max(0, toolInput.seats - input.teamSize);
  const reasons: string[] = [];

  if (optimized.monthlyPrice < current.monthlyPrice) {
    reasons.push(`The ${current.label} plan is more expensive than a lower tier that still fits the observed team size.`);
  }

  if (seatGap > 0) {
    const minimumSeats = optimized.minimumSeats ?? 1;
    reasons.push(`You appear to be paying for ${seatGap} extra seat(s). The lower plan still respects a minimum of ${minimumSeats} seat(s) where applicable.`);
  }

  if (model.category === "api") {
    reasons.push("This is usage-based spend, so the only defensible savings are modest gains from routing, caching, and removing wasteful calls.");
  } else {
    reasons.push("The estimate is based on published per-seat pricing and the smaller of your reported spend or the vendor rate, which keeps the recommendation conservative.");
  }

  if (/prototype|internal|mvp|pilot|experiment/.test(input.primaryUseCase.toLowerCase()) && model.startupCreditHint) {
    reasons.push(`${model.startupCreditHint} Credit-based offsets are not counted as recurring monthly savings.`);
  }

  return reasons.join(" ");
}

function computeConfidence({
  savings,
  currentSpend,
  planSignal,
  seatSignal,
  apiSignal,
  hasPriceData
}: {
  savings: number;
  currentSpend: number;
  planSignal: boolean;
  seatSignal: boolean;
  apiSignal: boolean;
  hasPriceData: boolean;
}) {
  const savingsRatio = currentSpend > 0 ? savings / currentSpend : 0;
  const base = apiSignal ? 50 : 56;
  const ratioBoost = clamp(savingsRatio * 34, 0, 22);
  const planBoost = planSignal ? 8 : 0;
  const seatBoost = seatSignal ? 6 : 0;
  const dataBoost = hasPriceData ? 6 : 0;
  const apiPenalty = apiSignal ? 4 : 0;

  return Math.round(clamp(base + ratioBoost + planBoost + seatBoost + dataBoost - apiPenalty, 48, apiSignal ? 78 : 86));
}

export function evaluateTool(input: AuditInput, toolInput: ToolInput) {
  const model = findModel(toolInput.tool);
  if (!model || !toolInput.active) {
    return null;
  }

  const currentPlan = chooseCurrentPlan(model, toolInput);
  const currentSpend =
    toolInput.monthlySpend > 0
      ? toolInput.monthlySpend
      : currentPlan.billingMode === "perSeat"
        ? currentPlan.monthlyPrice * getEffectiveSeats(currentPlan, input, toolInput)
        : currentPlan.monthlyPrice;

  const optimizedPlan = chooseOptimizedPlan(model, input, toolInput, currentSpend);
  const optimizedPlanSpend = estimatePlanSpend(optimizedPlan, input, toolInput, currentSpend);

  let optimizedSpend = optimizedPlanSpend;
  const apiSignal = model.category === "api";

  if (apiSignal) {
    const cappedOptimization = Math.round(currentSpend * 0.12);
    optimizedSpend = Math.max(0, currentSpend - cappedOptimization);
  }

  const alternative = chooseAlternativeSpend(model, input, toolInput, currentSpend, optimizedSpend);
  if (alternative && alternative.spend < optimizedSpend) {
    optimizedSpend = alternative.spend;
  }

  const savings = Math.max(0, currentSpend - optimizedSpend);
  const annualSavings = savings * 12;
  const planSignal = optimizedPlan.tier !== currentPlan.tier;
  const seatSignal = toolInput.seats > input.teamSize;
  const hasPriceData = currentSpend > 0 && Number.isFinite(currentSpend);
  const confidence = computeConfidence({
    savings,
    currentSpend,
    planSignal,
    seatSignal,
    apiSignal,
    hasPriceData
  });

  const recommendation =
    apiSignal
      ? `Trim ${toolInput.tool} usage by routing simple requests to cheaper paths and reducing unnecessary calls.`
      : seatSignal
        ? `Rightsize ${toolInput.tool} seats to better match your active team.`
        : `Move ${toolInput.tool} to a lower-cost plan that still fits your team.`;

  const type = apiSignal ? "api-optimization" : seatSignal ? "seat-rightsizing" : planSignal ? "downgrade" : "alternative";

  return {
    tool: toolInput.tool,
    recommendation,
    reasoning: buildReasoning(model, currentPlan, optimizedPlan, input, toolInput),
    currentSpend,
    optimizedSpend,
    savings,
    annualSavings,
    confidence,
    type,
    alternative: alternative?.alternative.name ?? null
  };
}
