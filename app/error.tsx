"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid flex-1 place-items-center px-4 py-24">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-safety-300/40 text-ink-900">
          <TriangleAlert className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold">Something went wrong</h1>
        <p className="mt-3 text-ink-500">
          An unexpected error occurred. Please try again. If it keeps happening, call or WhatsApp us.
        </p>
        {error.digest && <p className="mt-2 font-mono text-xs text-ink-400">Ref: {error.digest}</p>}
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={reset} className={buttonClasses()}>
            <RotateCcw className="size-4" /> Try again
          </button>
          <Link href="/" className={buttonClasses({ variant: "secondary" })}>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
