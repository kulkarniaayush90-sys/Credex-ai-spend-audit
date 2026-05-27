import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-semibold text-slate-950">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white">Credex AI Spend Audit</span>
              <Badge tone="muted">MVP</Badge>
            </div>
            <p className="text-xs text-slate-400">Free AI SaaS spend audit for startups</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/#audit" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5 sm:inline-flex">
            Run audit
          </Link>
          <div aria-hidden="true" className="h-10 w-10 shrink-0" />
        </div>
      </div>
    </header>
  );
}
