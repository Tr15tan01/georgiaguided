"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Copy, ImagePlus, Search, Trash2, Upload } from "lucide-react";
import { deleteMedia, listMedia, mediaUsage, updateMedia, uploadMedia } from "@/actions/admin/media";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ConfirmButton } from "./confirm";
import { useToast } from "./toast";

export function MediaLibrary() {
  const toast = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [configured, setConfigured] = useState(true);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, start] = useTransition();
  const [uploading, startUpload] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  const load = useCallback((query: string, p: number) => {
    start(async () => {
      const res = await listMedia(query, p);
      setItems(res.items);
      setPages(res.pages);
      setTotal(res.total);
      setConfigured(res.configured);
      setLoaded(true);
    });
  }, []);
  useEffect(() => load("", 1), [load]);

  const upload = (files: FileList | File[] | null) => {
    if (!files || !files.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    startUpload(async () => {
      const res = await uploadMedia(fd);
      toast(res.ok ? "success" : "error", res.message);
      if (res.ok && res.items) { setItems((c) => [...res.items!, ...c]); setTotal((t) => t + res.items!.length); setSelected(res.items[0]); }
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <form role="search" className="relative w-full sm:w-72" onSubmit={(e) => { e.preventDefault(); setPage(1); load(q, 1); }}>
            <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by alt text or ID" aria-label="Search images" className="adm-input pl-9" />
          </form>
          <span className="text-sm text-ink-soft">{total} image{total === 1 ? "" : "s"}</span>
          <label className={cn("adm-btn adm-btn-primary ml-auto cursor-pointer", (!configured || uploading) && "pointer-events-none opacity-50")}>
            <Upload className="size-4" />{uploading ? "Uploading…" : "Upload images"}
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="sr-only" disabled={!configured} onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
          </label>
        </div>

        <div
          onDragOver={(e) => { if (configured) { e.preventDefault(); setDragOver(true); } }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
          className={cn("adm-card min-h-64 p-4 transition-colors", dragOver && "border-accent bg-accent/5")}
          aria-busy={loading}
        >
          {!loaded ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Loading">
              {Array.from({ length: 10 }).map((_, i) => <li key={i} className="aspect-square animate-pulse rounded-md bg-line" />)}
            </ul>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-center text-ink-soft">
              <ImagePlus className="size-10" />
              <p>{q ? "No images match your search." : "Drop photographs here or use Upload."}</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((m) => (
                <li key={m._id}>
                  <button
                    type="button"
                    onClick={() => setSelected(m)}
                    aria-pressed={selected?._id === m._id}
                    className={cn("relative block aspect-square w-full overflow-hidden rounded-md border-2 bg-line", selected?._id === m._id ? "border-accent" : "border-transparent")}
                  >
                    <Image src={m.url} alt={m.alt} fill sizes="200px" className="object-cover" unoptimized={m.url.endsWith(".svg")} />
                    {!m.alt && <span className="adm-badge absolute left-1.5 top-1.5 bg-[#b3261e] text-white">No alt</span>}
                  </button>
                  <p className="mt-1 truncate text-xs text-ink-soft">{m.alt || m.publicId}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {pages > 1 && (
          <div className="mt-3 flex items-center justify-end gap-2 text-sm">
            <button type="button" className="adm-btn" disabled={page <= 1 || loading} onClick={() => { setPage(page - 1); load(q, page - 1); }}>Previous</button>
            <span className="text-ink-soft">{page} / {pages}</span>
            <button type="button" className="adm-btn" disabled={page >= pages || loading} onClick={() => { setPage(page + 1); load(q, page + 1); }}>Next</button>
          </div>
        )}
      </div>

      <aside className="xl:sticky xl:top-8 xl:self-start">
        {selected ? (
          <MediaDetails
            key={selected._id}
            item={selected}
            onSaved={(m) => { setItems((c) => c.map((x) => (x._id === m._id ? m : x))); setSelected(m); }}
            onDeleted={(id) => { setItems((c) => c.filter((x) => x._id !== id)); setTotal((t) => t - 1); setSelected(null); }}
          />
        ) : (
          <div className="adm-card p-6 text-center text-sm text-ink-soft">Select an image to edit its details.</div>
        )}
      </aside>
    </div>
  );
}

function MediaDetails({ item, onSaved, onDeleted }: { item: MediaItem; onSaved: (m: MediaItem) => void; onDeleted: (id: string) => void }) {
  const toast = useToast();
  const [alt, setAlt] = useState(item.alt);
  const [caption, setCaption] = useState(item.caption ?? "");
  const [usage, setUsage] = useState<number | null>(null);
  const [pending, start] = useTransition();
  useEffect(() => { mediaUsage(item.publicId).then(setUsage).catch(() => setUsage(null)); }, [item.publicId]);

  return (
    <div className="adm-card overflow-hidden">
      <div className="relative aspect-[4/3] bg-line">
        <Image src={item.url} alt={item.alt} fill sizes="360px" className="object-contain" unoptimized={item.url.endsWith(".svg")} />
      </div>
      <form
        className="space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await updateMedia(item._id, alt, caption);
            toast(res.ok ? "success" : "error", res.message);
            if (res.ok) onSaved({ ...item, alt, caption });
          });
        }}
      >
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div><dt className="text-ink-soft">Dimensions</dt><dd>{item.width && item.height ? `${item.width} × ${item.height}` : "—"}</dd></div>
          <div><dt className="text-ink-soft">Size</dt><dd>{item.bytes ? `${Math.round(item.bytes / 1024)} KB` : "—"}</dd></div>
          <div><dt className="text-ink-soft">Used in</dt><dd>{usage == null ? "…" : `${usage} item${usage === 1 ? "" : "s"}`}</dd></div>
          <div><dt className="text-ink-soft">Format</dt><dd className="uppercase">{item.format ?? item.url.split(".").pop()}</dd></div>
        </dl>
        <div>
          <label htmlFor="m-alt" className="adm-label">Alt text</label>
          <textarea id="m-alt" rows={2} className="adm-input" value={alt} onChange={(e) => setAlt(e.target.value)} />
          <p className="adm-help">Describe what the photo shows. Used as the default when the image is chosen.</p>
        </div>
        <div>
          <label htmlFor="m-cap" className="adm-label">Caption</label>
          <input id="m-cap" className="adm-input" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>{pending ? "Saving…" : "Save details"}</button>
          <button type="button" className="adm-btn" onClick={() => { navigator.clipboard?.writeText(item.url); toast("success", "Image URL copied."); }}><Copy className="size-4" />Copy URL</button>
          <ConfirmButton
            className="adm-btn ml-auto text-[#b3261e]"
            title="Delete this image?"
            description={usage ? `It is still used in ${usage} item(s), so deletion will be blocked until you replace it there.` : "The file will be removed from the library and from Cloudinary."}
            confirmLabel="Delete image"
            onConfirm={async () => {
              const res = await deleteMedia(item._id);
              toast(res.ok ? "success" : "error", res.message);
              if (res.ok) onDeleted(item._id);
            }}
          >
            <Trash2 className="size-4" />Delete
          </ConfirmButton>
        </div>
      </form>
    </div>
  );
}
