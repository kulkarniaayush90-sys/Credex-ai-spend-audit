import { type ReactNode } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { AuditWorkbench } from "@/components/audit/audit-workbench";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge tone="muted">Product Hunt-ready MVP</Badge>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Audit your AI spend like a real SaaS investor memo.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Credex AI Spend Audit turns your AI tool stack into a clear savings report with deterministic recommendations,
            public share links, and a lead capture funnel that feels premium instead of pushy.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              Rule-based audit engine
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              AI summary fallback built in
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Wand2 className="h-4 w-4 text-cyan-300" />
            <span>Designed for startups, engineering leads, and finance-conscious founders.</span>
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <CardContent className="space-y-5 p-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/10 p-5">
              <div className="text-sm uppercase tracking-[0.24em] text-cyan-200">What the report includes</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Bullet>Monthly and annual savings</Bullet>
                <Bullet>Per-tool downgrade recommendations</Bullet>
                <Bullet>Cheaper alternatives</Bullet>
                <Bullet>Shareable public URL</Bullet>
                <Bullet>AI summary with fallback</Bullet>
                <Bullet>Lead capture for Credex</Bullet>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Sample savings range</span>
                <span>$100 - $1,500 / month</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-white/10">
                <div className="h-3 w-[68%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                The app is intentionally honest. If the savings are small, the page says so and still gives the user a useful
                renewal review.
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <span className="text-slate-300">Open the audit matrix below</span>
              <ArrowRight className="h-4 w-4 text-cyan-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="audit" className="py-8">
        <AuditWorkbench />
      </section>
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{children}</div>;
}
