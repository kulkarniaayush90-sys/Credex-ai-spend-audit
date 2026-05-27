import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>Built for startup teams that want honest AI spend visibility.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/#audit" className="transition hover:text-white">
            Run the audit
          </Link>
          <a href="mailto:hello@credex.ai" className="transition hover:text-white">
            hello@credex.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
