export const TOOL_NAMES = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf"
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

export type PlanTier =
  | "free"
  | "individual"
  | "pro"
  | "team"
  | "business"
  | "enterprise"
  | "api"
  | "usage";

export type ToolCategory = "coding" | "general-llm" | "api";

export interface ToolInput {
  tool: ToolName;
  active: boolean;
  planType: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  primaryUseCase: string;
  tools: ToolInput[];
}

export interface PlanPricing {
  tier: PlanTier;
  label: string;
  monthlyPrice: number;
  includedSeats: number;
  billingMode: "perSeat" | "flat" | "usage" | "custom";
  minimumSeats?: number;
  notes?: string;
}

export interface AlternativeOption {
  name: string;
  monthlyPrice: number;
  rationale: string;
}

export interface ToolPricingModel {
  tool: ToolName;
  category: ToolCategory;
  plans: PlanPricing[];
  alternatives: AlternativeOption[];
  apiOptimization?: string;
  startupCreditHint?: string;
}

export type RecommendationType =
  | "downgrade"
  | "seat-rightsizing"
  | "alternative"
  | "api-optimization"
  | "credits";

export interface ToolRecommendation {
  tool: ToolName;
  recommendation: string;
  reasoning: string;
  currentSpend: number;
  optimizedSpend: number;
  savings: number;
  annualSavings: number;
  confidence: number;
  type: RecommendationType;
  alternative: string | null;
}

export interface AuditTotals {
  monthlyCurrent: number;
  monthlyOptimized: number;
  monthlySavings: number;
  annualSavings: number;
}

export interface AuditReport {
  id: string;
  createdAt: string;
  teamSize: number;
  primaryUseCase: string;
  summary: string;
  confidenceLabel: "strong" | "medium" | "light";
  ctaLevel: "strong" | "soft" | "honest";
  totals: AuditTotals;
  recommendations: ToolRecommendation[];
}
