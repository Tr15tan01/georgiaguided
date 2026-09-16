"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/** Honeypot, render timestamp and source path. */
export function FormGuards() {
  const [ts, setTs] = useState("");
  const pathname = usePathname();
  useEffect(() => setTs(String(Date.now())), []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="_ts" value={ts} />
      <input type="hidden" name="sourcePath" value={pathname} />
    </>
  );
}

export function SubmitButton({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className="btn btn-primary w-full disabled:opacity-70 sm:w-auto">
      {pending ? pendingText : children}
    </button>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
}

export function Field({ label, name, error, hint, textarea, rows = 5, className, required, ...rest }: FieldProps) {
  const id = `f-${name}`;
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {!required && <span className="font-normal text-ink-soft"> (optional)</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          defaultValue={rest.defaultValue as string | undefined}
          placeholder={rest.placeholder}
          className="field resize-y"
        />
      ) : (
        <input id={id} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className="field" {...rest} />
      )}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-soft">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

export function ChipGroup({ legend, name, options, defaultValues = [], hint }: { legend: string; name: string; options: string[]; defaultValues?: string[]; hint?: string }) {
  if (!options.length) return null;
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      {hint && <p className="-mt-1 mb-3 text-sm text-ink-soft">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="checkbox" name={name} value={o} defaultChecked={defaultValues.includes(o)} className="peer sr-only" />
            <span className={cn(
              "inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[0.95rem] transition-colors",
              "hover:border-ink/40 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
            )}>
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FormMessage({ status, message }: { status: string; message?: string }) {
  if (!message || status === "idle") return null;
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-4 py-3", status === "error" ? "border-[#b3261e]/40 bg-[#b3261e]/8" : "border-moss/40 bg-moss/10")}
    >
      {message}
    </div>
  );
}
