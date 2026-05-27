import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 text-center">
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Report not found</h2>
        <p className="text-slate-300">That audit link does not exist or has not been stored yet.</p>
        <Button asChild>
          <Link href="/">Back to audit</Link>
        </Button>
      </div>
    </div>
  );
}

