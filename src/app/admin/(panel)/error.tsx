"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("[admin] page error", error);
  }, [error]);

  return (
    <div role="alert" className="adm-card mx-auto mt-10 max-w-xl p-8 text-center">
      <AlertTriangle className="mx-auto size-10 text-[#b3261e]" />
      <h1 className="mt-4 text-xl font-semibold">Something went wrong on this screen</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Your saved content is safe. Try again, or reload the page. If you were editing, changes since your last save may need to be re-entered.
      </p>
      {/* Client-side messages are safe to show; server errors only expose a reference code. */}
      <p className="mt-4 break-words rounded-md bg-paper px-3 py-2 font-mono text-xs text-ink-soft">
        {error.digest ? `Reference: ${error.digest}` : error.message || "Unknown error"}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => retry()}><RotateCcw className="size-4" />Try again</button>
        <button type="button" className="adm-btn" onClick={() => window.location.reload()}>Reload page</button>
        <Link href="/admin" className="adm-btn">Dashboard</Link>
      </div>
      <p className="mt-4 text-xs text-ink-soft">If this keeps happening, send the reference above to your developer — it matches an entry in the server logs.</p>
    </div>
  );
}
