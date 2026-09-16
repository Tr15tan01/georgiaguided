"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Archive, PhoneOutgoing, Trash2, X } from "lucide-react";
import { addInquiryNote, deleteInquiry, deleteInquiryNote, updateInquiryStatus } from "@/actions/admin/inquiries";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ConfirmButton } from "./confirm";
import { useToast } from "./toast";

export function InquiryActions({ id, status }: { id: string; status: InquiryStatus }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();
  const change = (s: string) =>
    start(async () => {
      const res = await updateInquiryStatus(id, s);
      toast(res.ok ? "success" : "error", res.message);
      router.refresh();
    });

  return (
    <section className="adm-card space-y-3 p-5" aria-labelledby="status-h">
      <h2 id="status-h" className="font-semibold">Status</h2>
      <label htmlFor="inq-status" className="sr-only">Inquiry status</label>
      <select id="inq-status" className="adm-input" value={status} disabled={pending} onChange={(e) => change(e.target.value)}>
        {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
      </select>
      <div className="grid gap-2">
        {status === "NEW" && <button type="button" className="adm-btn adm-btn-primary" disabled={pending} onClick={() => change("CONTACTED")}><PhoneOutgoing className="size-4" />Mark as contacted</button>}
        {status !== "ARCHIVED" && <button type="button" className="adm-btn" disabled={pending} onClick={() => change("ARCHIVED")}><Archive className="size-4" />Archive</button>}
        <ConfirmButton
          className="adm-btn text-[#b3261e]"
          title="Delete this inquiry?"
          description="The request and all internal notes will be permanently removed. Consider archiving instead."
          confirmLabel="Delete inquiry"
          onConfirm={async () => {
            const res = await deleteInquiry(id);
            toast(res.ok ? "success" : "error", res.message);
            if (res.ok) { router.push("/admin/inquiries"); router.refresh(); }
          }}
        >
          <Trash2 className="size-4" />Delete
        </ConfirmButton>
      </div>
    </section>
  );
}

export function InquiryNotes({ id, notes }: { id: string; notes: { _id: string; body: string; author: string; createdAt: string }[] }) {
  const router = useRouter();
  const toast = useToast();
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  return (
    <section className="adm-card p-5 sm:p-6" aria-labelledby="notes-h">
      <h2 id="notes-h" className="font-semibold">Internal notes</h2>
      <p className="mb-4 text-xs text-ink-soft">Only visible to the team. Never shown to the traveler.</p>
      {notes.length > 0 && (
        <ol className="mb-5 space-y-3">
          {[...notes].reverse().map((n) => (
            <li key={n._id} className="group rounded-lg border border-line bg-paper p-3">
              <div className="mb-1 flex items-center justify-between gap-2 text-xs text-ink-soft">
                <span><span className="font-medium text-ink">{n.author}</span> · {formatDate(n.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <button
                  type="button"
                  className="adm-icon !size-6 opacity-60 group-hover:opacity-100"
                  aria-label="Delete note"
                  disabled={pending}
                  onClick={() => start(async () => { const r = await deleteInquiryNote(id, n._id); toast(r.ok ? "success" : "error", r.message); router.refresh(); })}
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm">{n.body}</p>
            </li>
          ))}
        </ol>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const r = await addInquiryNote(id, body);
            toast(r.ok ? "success" : "error", r.message);
            if (r.ok) { setBody(""); router.refresh(); }
          });
        }}
      >
        <label htmlFor="note" className="adm-label">Add a note</label>
        <textarea id="note" rows={3} className="adm-input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="e.g. Sent a quote for 8 days, awaiting reply." />
        <div className="mt-2 flex justify-end"><button type="submit" className="adm-btn adm-btn-primary" disabled={pending || !body.trim()}>{pending ? "Saving…" : "Add note"}</button></div>
      </form>
    </section>
  );
}
