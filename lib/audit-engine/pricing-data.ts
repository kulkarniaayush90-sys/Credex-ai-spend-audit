import type { ToolPricingModel } from "@/lib/audit-engine/types";

export const PRICING_MODELS: ToolPricingModel[] = [
  {
    tool: "Cursor",
    category: "coding",
    plans: [
      { tier: "free", label: "Hobby", monthlyPrice: 0, includedSeats: 1, billingMode: "perSeat" },
      { tier: "individual", label: "Pro", monthlyPrice: 20, includedSeats: 1, billingMode: "perSeat" },
      { tier: "pro", label: "Pro+", monthlyPrice: 60, includedSeats: 1, billingMode: "perSeat" },
      { tier: "team", label: "Teams", monthlyPrice: 40, includedSeats: 1, billingMode: "perSeat" },
      { tier: "business", label: "Teams", monthlyPrice: 40, includedSeats: 1, billingMode: "perSeat" },
      { tier: "enterprise", label: "Enterprise", monthlyPrice: 0, includedSeats: 1, billingMode: "custom", notes: "Custom enterprise pricing." }
    ],
    alternatives: [
      {
        name: "Windsurf Pro",
        monthlyPrice: 15,
        rationale: "Lower entry price for solo developers and small teams."
      }
    ]
  },
  {
    tool: "GitHub Copilot",
    category: "coding",
    plans: [
      { tier: "individual", label: "Pro", monthlyPrice: 10, includedSeats: 1, billingMode: "perSeat" },
      { tier: "pro", label: "Pro+", monthlyPrice: 39, includedSeats: 1, billingMode: "perSeat" },
      { tier: "business", label: "Business", monthlyPrice: 19, includedSeats: 1, billingMode: "perSeat" },
      { tier: "enterprise", label: "Enterprise", monthlyPrice: 39, includedSeats: 1, billingMode: "perSeat" }
    ],
    alternatives: [
      {
        name: "Cursor Pro",
        monthlyPrice: 20,
        rationale: "If the team wants agentic editing plus inline codebase awareness."
      }
    ]
  },
  {
    tool: "Claude",
    category: "general-llm",
    plans: [
      { tier: "free", label: "Free", monthlyPrice: 0, includedSeats: 1, billingMode: "perSeat" },
      { tier: "pro", label: "Pro", monthlyPrice: 20, includedSeats: 1, billingMode: "perSeat" },
      {
        tier: "team",
        label: "Team",
        monthlyPrice: 30,
        includedSeats: 1,
        billingMode: "perSeat",
        minimumSeats: 5,
        notes: "Anthropic bills Team monthly at $30/member with a 5-member minimum."
      },
      {
        tier: "business",
        label: "Team",
        monthlyPrice: 30,
        includedSeats: 1,
        billingMode: "perSeat",
        minimumSeats: 5,
        notes: "Anthropic bills Team monthly at $30/member with a 5-member minimum."
      },
      { tier: "enterprise", label: "Enterprise", monthlyPrice: 0, includedSeats: 1, billingMode: "custom", notes: "Custom enterprise pricing." }
    ],
    alternatives: [
      {
        name: "ChatGPT Team",
        monthlyPrice: 25,
        rationale: "Often cheaper for collaborative knowledge work when seat sharing matters."
      }
    ]
  },
  {
    tool: "ChatGPT",
    category: "general-llm",
    plans: [
      { tier: "free", label: "Free", monthlyPrice: 0, includedSeats: 1, billingMode: "perSeat" },
      { tier: "pro", label: "Plus", monthlyPrice: 20, includedSeats: 1, billingMode: "perSeat" },
      {
        tier: "team",
        label: "Business",
        monthlyPrice: 30,
        includedSeats: 1,
        billingMode: "perSeat",
        minimumSeats: 2,
        notes: "OpenAI lists ChatGPT Business at $30/seat/month billed monthly, with a 2-seat minimum."
      },
      {
        tier: "business",
        label: "Business",
        monthlyPrice: 30,
        includedSeats: 1,
        billingMode: "perSeat",
        minimumSeats: 2,
        notes: "OpenAI lists ChatGPT Business at $30/seat/month billed monthly, with a 2-seat minimum."
      },
      { tier: "enterprise", label: "Enterprise", monthlyPrice: 0, includedSeats: 1, billingMode: "custom", notes: "Custom enterprise pricing." }
    ],
    alternatives: [
      {
        name: "Claude Pro",
        monthlyPrice: 20,
        rationale: "Comparable for single-user research and writing workflows."
      }
    ]
  },
  {
    tool: "Anthropic API",
    category: "api",
    plans: [
      { tier: "api", label: "Metered API", monthlyPrice: 0, includedSeats: 0, billingMode: "usage" }
    ],
    alternatives: [
      {
        name: "OpenAI API",
        monthlyPrice: 0,
        rationale: "A fit when model latency or tool-calling patterns are more important than a fixed seat plan."
      }
    ],
    apiOptimization:
      "Move low-volume prompts to a cheaper model tier and cache repetitive outputs before they hit the API.",
    startupCreditHint:
      "Check whether your startup qualifies for cloud credits or model-provider usage credits before the next renewal."
  },
  {
    tool: "OpenAI API",
    category: "api",
    plans: [
      { tier: "api", label: "Metered API", monthlyPrice: 0, includedSeats: 0, billingMode: "usage" }
    ],
    alternatives: [
      {
        name: "Anthropic API",
        monthlyPrice: 0,
        rationale: "Can be cheaper depending on prompt length and response patterns."
      }
    ],
    apiOptimization:
      "Route internal tooling and batch tasks to a cheaper model where quality thresholds allow it.",
    startupCreditHint:
      "Usage credits and startup programs can materially reduce effective spend during experimentation."
  },
  {
    tool: "Gemini",
    category: "api",
    plans: [
      {
        tier: "api",
        label: "Gemini API",
        monthlyPrice: 0,
        includedSeats: 0,
        billingMode: "usage",
        notes: "Google AI for Developers uses pay-as-you-go pricing; exact spend depends on tokens and model tier."
      }
    ],
    alternatives: [
      {
        name: "ChatGPT Team",
        monthlyPrice: 25,
        rationale: "Better collaborative packaging if most value comes from shared workspace usage."
      }
    ]
  },
  {
    tool: "Windsurf",
    category: "coding",
    plans: [
      { tier: "free", label: "Free", monthlyPrice: 0, includedSeats: 1, billingMode: "perSeat" },
      { tier: "pro", label: "Pro", monthlyPrice: 20, includedSeats: 1, billingMode: "perSeat" },
      { tier: "team", label: "Teams", monthlyPrice: 40, includedSeats: 1, billingMode: "perSeat" },
      { tier: "business", label: "Teams", monthlyPrice: 40, includedSeats: 1, billingMode: "perSeat" },
      { tier: "enterprise", label: "Enterprise", monthlyPrice: 0, includedSeats: 1, billingMode: "custom", notes: "Custom enterprise pricing." }
    ],
    alternatives: [
      {
        name: "Cursor Pro",
        monthlyPrice: 20,
        rationale: "A good comparison point for teams paying for two overlapping coding assistants."
      }
    ]
  }
];

export const AUDIT_RULES = {
  seatBuffer: 1,
  downgradeThreshold: 0.15,
  alternativeThreshold: 0.12,
  apiThreshold: 0.1,
  strongSavingsThreshold: 500,
  honestSavingsThreshold: 100
} as const;
