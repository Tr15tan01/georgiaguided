"use client";

import { useId, useMemo, useRef, useState, useTransition } from "react";
import { Bold, ChevronDown, Eye, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Pencil, Plus, Quote, Search, X } from "lucide-react";
import type { Field, RefOptions } from "@/admin/fields";
import { getPath, setPath } from "@/admin/fields";
import type { LinkItem, MediaRef, Seo } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { previewMarkdown } from "@/actions/admin/preview";
import { ImageField, MediaDialog, toRef } from "./image-picker";
import { SortableList } from "./sortable-list";
import { Thumb } from "./thumb";

type Doc = Record<string, unknown>;

export interface FieldProps {
  field: Field;
  doc: Doc;
  onChange: (doc: Doc) => void;
  errors: Record<string, string>;
  refOptions: RefOptions;
  /** Prefix used for error lookup when nested inside repeaters. */
  errorPrefix?: string;
}

export function FieldRow({ field, doc, onChange, errors, refOptions, errorPrefix = "" }: FieldProps) {
  const id = useId();
  const value = getPath(doc, field.name);
  const set = (v: unknown) => onChange(setPath(doc, field.name, v));
  const errKey = errorPrefix + field.name;
  const error = errors[errKey] ?? Object.entries(errors).find(([k]) => k.startsWith(errKey + "."))?.[1];
  const described = [field.help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": described } as const;

  let control: React.ReactNode;
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      control = <input {...common} type={field.type === "text" ? "text" : field.type} className="adm-input" value={String(value ?? "")} placeholder={field.placeholder} required={field.required} onChange={(e) => set(e.target.value)} />;
      break;
    case "number":
      control = (
        <input {...common} type="number" inputMode="decimal" className="adm-input" value={value === undefined || value === null ? "" : String(value)}
          onChange={(e) => set(e.target.value === "" ? undefined : Number(e.target.value))} />
      );
      break;
    case "datetime":
      control = <input {...common} type="datetime-local" className="adm-input" value={toLocalInput(value)} onChange={(e) => set(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
      break;
    case "textarea":
      control = <textarea {...common} rows={4} className="adm-input" value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} />;
      break;
    case "checkbox":
      return (
        <div className={cn(field.wide && "sm:col-span-2")}>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm">
            <input type="checkbox" className="mt-0.5 size-4 accent-[var(--wine)]" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} />
            <span>{field.label}</span>
          </label>
          {field.help && <p className="adm-help pl-6">{field.help}</p>}
        </div>
      );
    case "select":
      control = (
        <select {...common} className="adm-input" value={String(value ?? "")} onChange={(e) => set(e.target.value)}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case "slug":
      control = <SlugInput {...common} value={String(value ?? "")} source={String(getPath(doc, field.from) ?? "")} onChange={set} />;
      break;
    case "markdown":
      control = <MarkdownEditor id={id} value={String(value ?? "")} onChange={set} invalid={Boolean(error)} />;
      break;
    case "image":
      control = <ImageField id={id} value={value as MediaRef | null} onChange={set} />;
      break;
    case "gallery":
      control = <GalleryField value={(value as MediaRef[]) ?? []} onChange={set} />;
      break;
    case "stringList":
      control = <StringList value={(value as string[]) ?? []} onChange={set} itemLabel={field.itemLabel ?? "item"} />;
      break;
    case "tags":
      control = <TagsInput id={id} value={(value as string[]) ?? []} onChange={set} suggestions={field.suggestions} />;
      break;
    case "refs":
      control = <RefsField id={id} value={(value as string[]) ?? []} onChange={set} options={refOptions[field.resource] ?? []} />;
      break;
    case "link":
      control = <LinkEditor value={(value as LinkItem) ?? { label: "", href: "" }} onChange={set} />;
      break;
    case "links":
      control = <LinksEditor value={(value as LinkItem[]) ?? []} onChange={set} />;
      break;
    case "seo":
      control = <SeoEditor value={(value as Seo) ?? {}} onChange={set} errors={errors} prefix={errKey} />;
      break;
    case "repeater":
      control = (
        <Repeater field={field} value={(value as Doc[]) ?? []} onChange={set} errors={errors} refOptions={refOptions} errorPrefix={errKey} />
      );
      break;
  }

  const labelFor = ["gallery", "stringList", "repeater", "link", "links", "seo"].includes(field.type) ? undefined : id;
  return (
    <div className={cn(field.wide && "sm:col-span-2")}>
      {labelFor ? (
        <label htmlFor={labelFor} className="adm-label">{field.label}{field.required && <span className="text-accent"> *</span>}</label>
      ) : (
        <p className="adm-label">{field.label}</p>
      )}
      {control}
      {field.help && <p id={`${id}-help`} className="adm-help">{field.help}</p>}
      {error && <p id={`${id}-err`} className="adm-error">{error}</p>}
    </div>
  );
}

export function FieldGrid(props: Omit<FieldProps, "field"> & { fields: Field[] }) {
  const { fields, ...rest } = props;
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      {fields.map((f) => <FieldRow key={f.name} field={f} {...rest} />)}
    </div>
  );
}

function toLocalInput(v: unknown): string {
  if (!v) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

/* ─── Slug ─── */
function SlugInput({ value, source, onChange, ...rest }: { value: string; source: string; onChange: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex gap-2">
      <input {...rest} className="adm-input font-mono text-sm" value={value} onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))} onBlur={() => onChange(slugify(value))} />
      <button type="button" className="adm-btn" onClick={() => onChange(slugify(source))} disabled={!source} title="Generate from title">Generate</button>
    </div>
  );
}

/* ─── Markdown ─── */
function MarkdownEditor({ id, value, onChange, invalid }: { id: string; value: string; onChange: (v: string) => void; invalid: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [html, setHtml] = useState("");
  const [pending, start] = useTransition();
  const [mediaOpen, setMediaOpen] = useState(false);

  const wrap = (before: string, after = before, placeholder = "text") => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length); });
  };
  const linePrefix = (prefix: string) => {
    const ta = ref.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length); });
  };
  const insert = (text: string) => {
    const ta = ref.current;
    const s = ta?.selectionStart ?? value.length;
    onChange(value.slice(0, s) + text + value.slice(s));
  };

  const tools: [string, React.ComponentType<{ className?: string }>, () => void][] = [
    ["Heading", Heading2, () => linePrefix("## ")],
    ["Subheading", Heading3, () => linePrefix("### ")],
    ["Bold", Bold, () => wrap("**")],
    ["Italic", Italic, () => wrap("_")],
    ["Link", Link2, () => wrap("[", "](/plan-your-trip)", "link text")],
    ["Bulleted list", List, () => linePrefix("- ")],
    ["Numbered list", ListOrdered, () => linePrefix("1. ")],
    ["Quote", Quote, () => linePrefix("> ")],
    ["Image", ImagePlus, () => setMediaOpen(true)],
  ];

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-raised", invalid ? "border-[#b3261e]" : "border-line")}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line px-1.5 py-1">
        {tools.map(([label, Icon, fn]) => (
          <button key={label} type="button" className="adm-icon" title={label} aria-label={label} onClick={fn} disabled={mode === "preview"}>
            <Icon className="size-4" />
          </button>
        ))}
        <div className="ml-auto flex rounded-md border border-line p-0.5 text-xs" role="tablist" aria-label="Editor mode">
          <button type="button" role="tab" aria-selected={mode === "write"} onClick={() => setMode("write")} className={cn("flex items-center gap-1 rounded px-2 py-1", mode === "write" && "bg-accent text-accent-ink")}><Pencil className="size-3" />Write</button>
          <button type="button" role="tab" aria-selected={mode === "preview"} onClick={() => { setMode("preview"); start(async () => setHtml(await previewMarkdown(value))); }} className={cn("flex items-center gap-1 rounded px-2 py-1", mode === "preview" && "bg-accent text-accent-ink")}><Eye className="size-3" />Preview</button>
        </div>
      </div>
      {mode === "write" ? (
        <textarea ref={ref} id={id} rows={16} value={value} onChange={(e) => onChange(e.target.value)} className="block w-full resize-y bg-transparent p-3 font-mono text-[0.85rem] leading-relaxed outline-none" spellCheck />
      ) : (
        <div className="prose prose-gg max-h-[32rem] max-w-none overflow-y-auto p-4 font-sans text-sm">
          {pending ? <p>Rendering…</p> : html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <p className="text-ink-soft">Nothing to preview.</p>}
        </div>
      )}
      <div className="flex justify-between border-t border-line px-3 py-1 text-xs text-ink-soft">
        <span>Markdown supported</span>
        <span>{value.trim() ? value.trim().split(/\s+/).length : 0} words</span>
      </div>
      <MediaDialog open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={(items) => items[0] && insert(`\n![${items[0].alt}](${items[0].url})\n`)} />
    </div>
  );
}

/* ─── Gallery ─── */
function GalleryField({ value, onChange }: { value: MediaRef[]; onChange: (v: MediaRef[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <SortableList
          layout="grid"
          items={value}
          onChange={onChange}
          itemLabel={(m, i) => m.alt || `image ${i + 1}`}
          render={(m, i) => (
            <div className="space-y-1.5">
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-line">
                <Thumb src={m.url} alt={m.alt} width={320} />
              </div>
              <input aria-label={`Alt text for image ${i + 1}`} placeholder="Alt text" className="adm-input !min-h-8 text-xs" value={m.alt} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
            </div>
          )}
        />
      )}
      <button type="button" className="adm-btn" onClick={() => setOpen(true)}><Plus className="size-4" />Add images</button>
      <MediaDialog multiple open={open} onClose={() => setOpen(false)} onSelect={(items) => onChange([...value, ...items.map(toRef)])} />
    </div>
  );
}

/* ─── String list ─── */
function StringList({ value, onChange, itemLabel }: { value: string[]; onChange: (v: string[]) => void; itemLabel: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <SortableList
          items={value}
          onChange={onChange}
          itemLabel={(s) => s.slice(0, 40)}
          render={(s, i) => (
            <input aria-label={`${itemLabel} ${i + 1}`} className="adm-input !border-transparent !bg-transparent hover:!border-line focus:!border-[var(--wine)]" value={s} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          )}
        />
      )}
      <div className="flex gap-2">
        <input aria-label={`New ${itemLabel}`} className="adm-input" placeholder={`Add a ${itemLabel}…`} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button type="button" className="adm-btn" onClick={add} disabled={!draft.trim()}><Plus className="size-4" />Add</button>
      </div>
    </div>
  );
}

/* ─── Tags ─── */
function TagsInput({ id, value, onChange, suggestions = [] }: { id: string; value: string[]; onChange: (v: string[]) => void; suggestions?: string[] }) {
  const [draft, setDraft] = useState("");
  const add = (t: string) => {
    const v = t.trim().replace(/,$/, "");
    if (v && !value.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...value, v]);
    setDraft("");
  };
  const remaining = suggestions.filter((s) => !value.includes(s));
  return (
    <div>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-raised px-2 py-1.5 focus-within:border-accent">
        {value.map((t) => (
          <span key={t} className="adm-badge border-line bg-paper">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="text-ink-soft hover:text-ink"><X className="size-3" /></button>
          </span>
        ))}
        <input
          id={id}
          className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none"
          value={draft}
          placeholder={value.length ? "" : "Type and press Enter"}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(draft); }
            if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={() => draft && add(draft)}
        />
      </div>
      {remaining.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {remaining.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="adm-badge border-dashed border-line text-ink-soft hover:border-accent hover:text-accent"><Plus className="size-3" />{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── References ─── */
function RefsField({ id, value, onChange, options }: { id: string; value: string[]; onChange: (v: string[]) => void; options: { value: string; label: string }[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const byId = useMemo(() => new Map(options.map((o) => [o.value, o.label])), [options]);
  const filtered = options.filter((o) => !value.includes(o.value) && o.label.toLowerCase().includes(q.toLowerCase())).slice(0, 30);
  const selected = value.filter((v) => byId.has(v));
  return (
    <div className="space-y-2">
      {selected.length > 0 ? (
        <SortableList items={selected} onChange={onChange} itemLabel={(v) => byId.get(v) ?? v} render={(v) => <p className="py-1.5 text-sm">{byId.get(v)}</p>} />
      ) : (
        <p className="rounded-lg border border-dashed border-line px-3 py-2 text-sm text-ink-soft">Nothing selected.</p>
      )}
      <div className="relative">
        <button type="button" className="adm-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={`${id}-list`}>
          <Plus className="size-4" />Add <ChevronDown className="size-3.5" />
        </button>
        {open && (
          <div id={`${id}-list`} className="absolute left-0 z-20 mt-1 w-[min(24rem,80vw)] rounded-lg border border-line bg-raised p-2 shadow-xl shadow-black/10">
            <div className="relative mb-2">
              <Search aria-hidden className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
              <input id={id} autoFocus className="adm-input pl-8" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)} />
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {filtered.length === 0 && <li className="px-2 py-2 text-sm text-ink-soft">No matches</li>}
              {filtered.map((o) => (
                <li key={o.value}>
                  <button type="button" className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-paper" onClick={() => { onChange([...value, o.value]); setQ(""); }}>{o.label}</button>
                </li>
              ))}
            </ul>
            <div className="mt-1 flex justify-end border-t border-line pt-2"><button type="button" className="adm-btn" onClick={() => setOpen(false)}>Done</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Links ─── */
function LinkEditor({ value, onChange }: { value: LinkItem; onChange: (v: LinkItem) => void }) {
  const id = useId();
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-l`} className="sr-only">Label</label>
        <input id={`${id}-l`} className="adm-input" placeholder="Label" value={value?.label ?? ""} onChange={(e) => onChange({ ...value, label: e.target.value })} />
      </div>
      <div>
        <label htmlFor={`${id}-h`} className="sr-only">Link</label>
        <input id={`${id}-h`} className="adm-input font-mono text-sm" placeholder="/tours or https://…" value={value?.href ?? ""} onChange={(e) => onChange({ ...value, href: e.target.value })} />
      </div>
    </div>
  );
}

export function LinksEditor({ value, onChange }: { value: LinkItem[]; onChange: (v: LinkItem[]) => void }) {
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <SortableList items={value} onChange={onChange} itemLabel={(l) => l.label || "link"} render={(l, i) => <LinkEditor value={l} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />} />
      )}
      <button type="button" className="adm-btn" onClick={() => onChange([...value, { label: "", href: "" }])}><Plus className="size-4" />Add link</button>
    </div>
  );
}

/* ─── SEO ─── */
function SeoEditor({ value, onChange, errors, prefix }: { value: Seo; onChange: (v: Seo) => void; errors: Record<string, string>; prefix: string }) {
  const id = useId();
  const title = value.title ?? "";
  const desc = value.description ?? "";
  const counter = (n: number, ideal: number, max: number) => (
    <span className={cn("tabular-nums", n > max ? "text-[#b3261e]" : n > ideal ? "text-brass" : "text-ink-soft")}>{n}/{ideal}</span>
  );
  return (
    <div className="space-y-5 rounded-lg border border-line p-4">
      <div>
        <div className="flex justify-between"><label htmlFor={`${id}-t`} className="adm-label">SEO title</label><span className="text-xs">{counter(title.length, 60, 120)}</span></div>
        <input id={`${id}-t`} className="adm-input" value={title} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Defaults to the page title" />
        {errors[`${prefix}.title`] && <p className="adm-error">{errors[`${prefix}.title`]}</p>}
      </div>
      <div>
        <div className="flex justify-between"><label htmlFor={`${id}-d`} className="adm-label">Meta description</label><span className="text-xs">{counter(desc.length, 160, 320)}</span></div>
        <textarea id={`${id}-d`} rows={3} className="adm-input" value={desc} onChange={(e) => onChange({ ...value, description: e.target.value })} placeholder="Defaults to the short description" />
      </div>
      <div>
        <label htmlFor={`${id}-c`} className="adm-label">Canonical URL</label>
        <input id={`${id}-c`} className="adm-input font-mono text-sm" value={value.canonical ?? ""} onChange={(e) => onChange({ ...value, canonical: e.target.value })} placeholder="Leave empty to use this page's own address" />
        {errors[`${prefix}.canonical`] && <p className="adm-error">{errors[`${prefix}.canonical`]}</p>}
      </div>
      <div>
        <p className="adm-label">Social sharing image (Open Graph)</p>
        <ImageField id={`${id}-og`} value={value.ogImage} onChange={(v) => onChange({ ...value, ogImage: v })} />
        <p className="adm-help">1200×630 works best. Defaults to the main image.</p>
      </div>
      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" className="mt-0.5 size-4 accent-[var(--wine)]" checked={Boolean(value.noindex)} onChange={(e) => onChange({ ...value, noindex: e.target.checked })} />
        <span>Hide from search engines (noindex). Use sparingly.</span>
      </label>
      <div className="rounded-md bg-paper p-3">
        <p className="mb-1 text-xs uppercase tracking-wider text-ink-soft">Search preview</p>
        <p className="truncate text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Page title"}</p>
        <p className="line-clamp-2 text-sm text-ink-soft">{desc || "The meta description will appear here."}</p>
      </div>
    </div>
  );
}

/* ─── Repeater ─── */
function Repeater({ field, value, onChange, errors, refOptions, errorPrefix }: {
  field: Extract<Field, { type: "repeater" }>;
  value: Doc[];
  onChange: (v: Doc[]) => void;
  errors: Record<string, string>;
  refOptions: RefOptions;
  errorPrefix: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(value.length === 0 ? null : -1);
  const blank = () => Object.fromEntries(field.fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]));
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <SortableList
          items={value}
          onChange={onChange}
          itemLabel={(item, i) => String(item[field.titleKey] || `${field.itemLabel} ${i + 1}`)}
          render={(item, i) => {
            const isOpen = openIdx === i;
            const hasError = Object.keys(errors).some((k) => k.startsWith(`${errorPrefix}.${i}.`));
            return (
              <div>
                <button type="button" onClick={() => setOpenIdx(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-2 py-1.5 text-left text-sm font-medium">
                  <span className="text-xs tabular-nums text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("flex-1 truncate", hasError && "text-[#b3261e]")}>{String(item[field.titleKey] || `Untitled ${field.itemLabel}`)}</span>
                  <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="pb-2 pt-3">
                    <FieldGrid
                      fields={field.fields}
                      doc={item}
                      onChange={(d) => onChange(value.map((x, j) => (j === i ? d : x)))}
                      errors={errors}
                      refOptions={refOptions}
                      errorPrefix={`${errorPrefix}.${i}.`}
                    />
                  </div>
                )}
              </div>
            );
          }}
        />
      )}
      <button type="button" className="adm-btn" onClick={() => { onChange([...value, blank()]); setOpenIdx(value.length); }}>
        <Plus className="size-4" />Add {field.itemLabel}
      </button>
    </div>
  );
}
