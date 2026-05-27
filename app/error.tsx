"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
        <p className="mt-3 text-slate-300">The audit UI hit an unexpected issue. You can retry without losing your data.</p>
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}

