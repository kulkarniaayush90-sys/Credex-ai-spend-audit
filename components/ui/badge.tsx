import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "muted";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30",
  success: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30",
  warning: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
  muted: "bg-white/5 text-slate-300 ring-1 ring-white/10"
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}

