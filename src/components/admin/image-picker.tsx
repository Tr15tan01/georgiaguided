"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { AlertTriangle, ImagePlus, Search, Upload, X } from "lucide-react";
import { listMedia, uploadMedia } from "@/actions/admin/media";
import type { MediaItem, MediaRef } from "@/lib/types";
import { useToast } from "./toast";
import { cn } from "@/lib/utils";
import { Thumb } from "./thumb";

export function toRef(m: MediaItem): MediaRef {
  return { url: m.url, publicId: m.publicId, width: m.width, height: m.height, alt: m.alt ?? "", caption: m.caption ?? "" };
}

/** Modal media library: search, upload, select one or many. */
export function MediaDialog({ open, onClose, onSelect, multiple }: { open: boolean; onClose: () => void; onSelect: (items: MediaItem[]) => void; multiple?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [configured, setConfigured] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, start] = useTransition();
  const [uploading, startUpload] = useTransition();
  const toast = useToast();

  const load = useCallback((query: string, p: number) => {
    start(async () => {
      try {
        const res = await listMedia(query, p);
        setItems(Array.isArray(res?.items) ? res.items.filter((i) => i && i._id) : []);
        setPages(res?.pages ?? 1);
        setConfigured(Boolean(res?.configured));
        setError(res?.error ?? null);
      } catch (err) {
        // Never let a failed request take down the editor (unsaved work would be lost).
        console.error("[media] list failed", err);
        setError("The server couldn't handle this request (HTTP 500). Open Admin → Diagnostics to see which part is failing, and check your host's function logs.");
      }
    });
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
      setSelected([]);
      load(q, page);
    }
    if (!open && d.open) d.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const goTo = (p: number) => { setPage(p); load(q, p); };

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    startUpload(async () => {
      try {
        const res = await uploadMedia(fd);
        toast(res.ok ? "success" : "error", res.message);
        if (res.ok && res.items?.length) {
          setItems((cur) => [...res.items!, ...cur]);
          setSelected((s) => (multiple ? [...res.items!.map((i) => i._id), ...s] : [res.items![0]._id]));
        }
      } catch (err) {
        console.error("[media] upload failed", err);
        toast("error", "Upload failed. Images must be under 10 MB (check the file size), and Cloudinary must be configured. Please try again.");
      }
    });
  };

  const toggle = (id: string) => setSelected((s) => (multiple ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]));

  return (
    <dialog ref={ref} onClose={onClose} className="m-auto h-[min(48rem,calc(100dvh-2rem))] w-[min(64rem,calc(100vw-2rem))] rounded-xl border border-line bg-raised p-0 text-ink backdrop:bg-black/50">
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <h2 className="mr-auto font-sans text-lg font-semibold">Media library</h2>
          {/* Not a <form>: this dialog renders inside editor forms, and forms can't nest. */}
          <div role="search" className="relative">
            <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search alt text" aria-label="Search images" className="adm-input w-56 pl-9"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setPage(1); load(q, 1); } }} />
          </div>
          <label className={cn("adm-btn adm-btn-primary cursor-pointer", (!configured || uploading) && "pointer-events-none opacity-60")}>
            <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple className="sr-only" disabled={!configured || uploading} onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
          </label>
          <button type="button" className="adm-icon" onClick={onClose} aria-label="Close"><X className="size-5" /></button>
        </div>
        {!configured && <p className="border-b border-line bg-brass/10 px-4 py-2 text-sm">Uploads are disabled until Cloudinary credentials are set.</p>}
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <div role="alert" className="flex flex-col items-center gap-3 p-12 text-center">
              <AlertTriangle className="size-8 text-[#b3261e]" />
              <p className="max-w-md text-sm">{error}</p>
              <button type="button" className="adm-btn" onClick={() => load(q, page)}>Try again</button>
            </div>
          ) : loading && !items.length ? (
            <p className="p-8 text-center text-ink-soft">Loading images…</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center p-12 text-center text-ink-soft"><ImagePlus className="mb-3 size-10" />No images yet. Upload your first photograph.</div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {items.map((m) => (
                <li key={m._id}>
                  <button type="button" onClick={() => toggle(m._id)} aria-pressed={selected.includes(m._id)} className={cn("relative block aspect-square w-full overflow-hidden rounded-md border-2", selected.includes(m._id) ? "border-accent" : "border-transparent")}>
                    <Thumb src={m.url} alt={m.alt} width={320} />
                  </button>
                  <p className="mt-1 truncate text-xs text-ink-soft" title={m.alt ?? ""}>{m.alt || "No alt text"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line p-4">
          <div className="flex items-center gap-2 text-sm">
            <button type="button" className="adm-btn" disabled={page <= 1 || loading} onClick={() => goTo(page - 1)}>Previous</button>
            <span className="text-ink-soft">Page {page} of {pages}</span>
            <button type="button" className="adm-btn" disabled={page >= pages || loading} onClick={() => goTo(page + 1)}>Next</button>
          </div>
          <button type="button" className="adm-btn adm-btn-primary" disabled={!selected.length} onClick={() => { onSelect(selected.map((id) => items.find((i) => i._id === id)).filter((i): i is MediaItem => Boolean(i?.url))); onClose(); }}>
            {multiple ? `Add ${selected.length || ""} selected` : "Use image"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function ImageField({ value, onChange, id }: { value: MediaRef | null | undefined; onChange: (v: MediaRef | null) => void; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {value?.url ? (
        <div className="flex flex-col gap-3 rounded-lg border border-line p-3 sm:flex-row">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md bg-line sm:w-48">
            <Thumb src={value.url} alt={value.alt} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-medium" htmlFor={`${id}-alt`}>Alt text (describe the image for screen readers and search)</label>
            <input id={`${id}-alt`} className="adm-input" value={value.alt ?? ""} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
            <label className="block text-xs font-medium" htmlFor={`${id}-cap`}>Caption</label>
            <input id={`${id}-cap`} className="adm-input" value={value.caption ?? ""} onChange={(e) => onChange({ ...value, caption: e.target.value })} />
            <div className="flex gap-2 pt-1">
              <button type="button" className="adm-btn" onClick={() => setOpen(true)}>Replace</button>
              <button type="button" className="adm-btn" onClick={() => onChange(null)}>Remove</button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" id={id} onClick={() => setOpen(true)} className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line p-8 text-ink-soft hover:border-accent hover:text-accent">
          <ImagePlus className="size-7" /> Choose or upload an image
        </button>
      )}
      <MediaDialog open={open} onClose={() => setOpen(false)} onSelect={(items) => items[0] && onChange(toRef(items[0]))} />
    </div>
  );
}
