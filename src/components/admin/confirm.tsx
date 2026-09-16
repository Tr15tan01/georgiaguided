"use client";

import { useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}

export function ConfirmButton({ title, description, confirmLabel, onConfirm, children, className, danger = true }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const [, force] = useState(0);
  return (
    <>
      <button type="button" className={className} onClick={() => { ref.current?.showModal(); force((n) => n + 1); }}>
        {children}
      </button>
      <dialog ref={ref} className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-line bg-raised p-0 text-ink backdrop:bg-black/40">
        <div className="p-6">
          <h2 className="font-sans text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{description}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="adm-btn" onClick={() => ref.current?.close()} autoFocus>Cancel</button>
            <button
              type="button"
              disabled={pending}
              className={cn("adm-btn", danger ? "adm-btn-danger" : "adm-btn-primary")}
              onClick={() => start(async () => { await onConfirm(); ref.current?.close(); })}
            >
              {pending ? "Working…" : confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
