"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { AlertCircle, ExternalLink, Eye, Save, Trash2 } from "lucide-react";
import type { RefOptions, Tab } from "@/admin/fields";
import { deleteResource, saveResource } from "@/actions/admin/content";
import { cn } from "@/lib/utils";
import { ConfirmButton } from "./confirm";
import { FieldGrid } from "./fields";
import { useToast } from "./toast";

type Doc = Record<string, unknown>;

interface Props {
  resource: string;
  id: string | null;
  initial: Doc;
  tabs: Tab[];
  refOptions: RefOptions;
  singular: string;
  listHref: string;
  publicHref?: string | null;
  previewType?: string;
  canDelete?: boolean;
  /** Extra content rendered as its own tab (e.g. the page section builder). */
  extraTab?: { label: string; render: (doc: Doc, set: (d: Doc) => void, errors: Record<string, string>) => React.ReactNode; first?: boolean };
}

export function ResourceForm({ resource, id, initial, tabs, refOptions, singular, listHref, publicHref, previewType, canDelete = true, extraTab }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [doc, setDoc] = useState<Doc>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  const allTabs = useMemo(() => {
    const base = tabs.map((t) => ({ label: t.label, fields: t.fields as Tab["fields"] | null }));
    if (!extraTab) return base;
    const x = { label: extraTab.label, fields: null };
    return extraTab.first ? [x, ...base] : [...base, x];
  }, [tabs, extraTab]);
  const [active, setActive] = useState(0);

  const dirty = JSON.stringify(doc) !== saved;
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const tabHasError = (i: number) => {
    const t = allTabs[i];
    if (!t.fields) return Object.keys(errors).some((k) => k.startsWith("sections"));
    return t.fields.some((f) => Object.keys(errors).some((k) => k === f.name || k.startsWith(f.name + ".")));
  };

  const save = (overrides?: Doc) => {
    const payload = { ...doc, ...overrides };
    start(async () => {
      const res = await saveResource(resource, id, JSON.stringify(payload));
      if (!res.ok) {
        setErrors(res.errors ?? {});
        toast("error", res.message);
        const firstBad = allTabs.findIndex((_, i) => {
          const t = allTabs[i];
          const errs = res.errors ?? {};
          if (!t.fields) return Object.keys(errs).some((k) => k.startsWith("sections"));
          return t.fields.some((f) => Object.keys(errs).some((k) => k === f.name || k.startsWith(f.name + ".")));
        });
        if (firstBad >= 0) setActive(firstBad);
        return;
      }
      setErrors({});
      setDoc(payload);
      setSaved(JSON.stringify(payload));
      toast("success", res.message);
      if (!id && res.id) router.replace(`${listHref}/${res.id}`);
      else router.refresh();
    });
  };

  const status = doc.status as string | undefined;
  const slug = doc.slug as string | undefined;

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
      {/* Tabs */}
      <div className="-mx-4 mb-6 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Editor sections" className="flex gap-1">
          {allTabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              id={`tab-${i}`}
              aria-selected={active === i}
              aria-controls={`panel-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
                active === i ? "text-ink after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-accent" : "text-ink-soft hover:text-ink",
              )}
            >
              {t.label}
              {tabHasError(i) && <AlertCircle aria-label="has errors" className="size-3.5 text-[#b3261e]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          {allTabs.map((t, i) => (
            <section key={t.label} role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`} hidden={active !== i} className="adm-card p-5 sm:p-6">
              {t.fields ? (
                <FieldGrid fields={t.fields} doc={doc} onChange={setDoc} errors={errors} refOptions={refOptions} />
              ) : (
                extraTab?.render(doc, setDoc, errors)
              )}
            </section>
          ))}
        </div>

        {/* Side panel */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="adm-card space-y-4 p-5">
            {status && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">Status</span>
                <StatusBadge status={status} />
              </div>
            )}
            {errors._form && <p className="adm-error">{errors._form}</p>}
            <button type="submit" className="adm-btn adm-btn-primary w-full" disabled={pending}>
              <Save className="size-4" />{pending ? "Saving…" : id ? "Save changes" : `Create ${singular}`}
            </button>
            {status !== undefined && (
              status === "published" ? (
                <button type="button" className="adm-btn w-full" disabled={pending} onClick={() => save({ status: "draft" })}>Unpublish</button>
              ) : (
                <button type="button" className="adm-btn w-full" disabled={pending} onClick={() => save({ status: "published" })}>Save &amp; publish</button>
              )
            )}
            <p className="text-center text-xs text-ink-soft" aria-live="polite">{dirty ? "Unsaved changes" : id ? "All changes saved" : "Not saved yet"}</p>
          </div>

          {id && slug && (
            <div className="adm-card space-y-2 p-5 text-sm">
              {previewType && (
                <a className="adm-btn w-full" href={`/api/preview?type=${previewType}&slug=${encodeURIComponent(slug)}`} target="_blank" rel="noopener">
                  <Eye className="size-4" />Preview {status !== "published" && "draft"}
                </a>
              )}
              {publicHref && status === "published" && (
                <a className="adm-btn w-full" href={publicHref} target="_blank" rel="noopener"><ExternalLink className="size-4" />View live</a>
              )}
              {previewType && <p className="text-xs text-ink-soft">Preview shows the last saved version.</p>}
            </div>
          )}

          {id && canDelete && (
            <ConfirmButton
              className="adm-btn w-full text-[#b3261e]"
              title={`Delete this ${singular}?`}
              description="This permanently removes it and any links to it from other content. This cannot be undone."
              confirmLabel="Delete"
              onConfirm={async () => {
                const res = await deleteResource(resource, id);
                toast(res.ok ? "success" : "error", res.message);
                if (res.ok) { setSaved(JSON.stringify(doc)); router.push(listHref); router.refresh(); }
              }}
            >
              <Trash2 className="size-4" />Delete {singular}
            </ConfirmButton>
          )}
          <Link href={listHref} className="block text-center text-sm text-ink-soft hover:text-ink">← Back to list</Link>
        </aside>
      </div>
    </form>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span className={cn("adm-badge", published ? "bg-moss/15 text-moss" : "bg-brass/15 text-brass")}>
      <span className={cn("size-1.5 rounded-full", published ? "bg-moss" : "bg-brass")} />
      {published ? "Published" : "Draft"}
    </span>
  );
}
