"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditInput } from "@/lib/audit-engine";
import { TOOL_NAMES } from "@/lib/audit-engine/types";

function createDefaultTools() {
  return TOOL_NAMES.map((tool) => ({
    tool,
    active: false,
    planType: "pro",
    monthlySpend: 0,
    seats: 0
  }));
}

export const defaultAuditDraft: AuditInput = {
  teamSize: 8,
  primaryUseCase: "Shipping product features with a compact engineering team",
  tools: createDefaultTools()
};

interface AuditStore {
  draft: AuditInput;
  setDraft: (draft: AuditInput) => void;
  resetDraft: () => void;
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      draft: defaultAuditDraft,
      setDraft: (draft) => set({ draft }),
      resetDraft: () => set({ draft: defaultAuditDraft })
    }),
    {
      name: "credex-ai-audit-draft"
    }
  )
);

