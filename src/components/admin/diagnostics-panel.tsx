"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, Stethoscope } from "lucide-react";
import { runDiagnostics, type Diagnostics } from "@/actions/admin/diagnostics";

export function DiagnosticsPanel() {
  const [result, setResult] = useState<Diagnostics | null>(null);
  const [crashed, setCrashed] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = () =>
    start(async () => {
      setCrashed(null);
      try {
        setResult(await runDiagnostics());
      } catch (err) {
        console.error(err);
        setResult(null);
        setCrashed(
          "The request to the server failed before it could run (HTTP 500). This usually means an environment variable is missing on the server, or the server rejected the request. Check your hosting provider's function logs for the entry that matches this moment.",
        );
      }
    });

  return (
    <div className="max-w-2xl space-y-4">
      <button type="button" className="adm-btn adm-btn-primary" onClick={run} disabled={pending}>
        <Stethoscope className="size-4" />{pending ? "Running…" : "Run checks"}
      </button>

      {crashed && (
        <div role="alert" className="adm-card border-[#b3261e] p-5">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-4 text-[#b3261e]" />Server request failed</p>
          <p className="mt-2 text-sm text-ink-soft">{crashed}</p>
        </div>
      )}

      {result && (
        <div className="adm-card p-5">
          <p className="flex items-center gap-2 font-semibold">
            {result.ok ? <CheckCircle2 className="size-4 text-moss" /> : <AlertTriangle className="size-4 text-[#b3261e]" />}
            {result.ok ? "All checks passed" : "A check failed"}
          </p>
          {result.error && <p className="mt-2 break-words rounded-md bg-paper p-3 font-mono text-xs">{result.error}</p>}
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {[
              ["Session", result.session],
              ["Database", result.database],
              ["Images in library", result.mediaCount === null ? "not checked" : String(result.mediaCount)],
              ["Cloudinary", result.cloudinary],
              ["Email", result.email],
              ["Site URL", result.siteUrl],
              ["Node.js", result.node],
              ["Checked at", new Date(result.checkedAt).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k}><dt className="text-xs text-ink-soft">{k}</dt><dd className="break-words">{v}</dd></div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
