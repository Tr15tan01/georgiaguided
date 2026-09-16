"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Plus } from "lucide-react";
import type { RefOptions, Tab } from "@/admin/fields";
import { SECTION_DEFS } from "@/admin/sections";
import type { PageSection, SectionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { pagePath } from "@/lib/paths";
import { FieldGrid } from "./fields";
import { ResourceForm } from "./resource-form";
import { SortableList } from "./sortable-list";

type Doc = Record<string, unknown>;

const statusSelect = { name: "status", label: "Status", type: "select" as const, options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] };
const titleField = { name: "title", label: "Page title", type: "text" as const, required: true, wide: true, help: "Used as the H1 when the page has no hero, in breadcrumbs and in the browser tab." };

function detailsTab(system: boolean): Tab {
  if (system) return { label: "Details", fields: [titleField, statusSelect] };
  return {
    label: "Details",
    fields: [
      titleField,
      { name: "slug", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "kind", label: "Page type", type: "select", options: [{ value: "custom", label: "Custom page" }, { value: "legal", label: "Legal page" }] },
      statusSelect,
    ],
  };
}
const seoTab: Tab = { label: "SEO", fields: [{ name: "seo", label: "Search & social", type: "seo" }] };

export function PageEditor({ id, initial, refOptions }: { id: string | null; initial: Doc; refOptions: RefOptions }) {
  const system = initial.kind === "system";
  const slug = String(initial.slug ?? "");
  const tabs = [detailsTab(system), seoTab];
  return (
    <ResourceForm
      resource="pages"
      id={id}
      initial={initial}
      tabs={tabs}
      refOptions={refOptions}
      singular="page"
      listHref="/admin/pages"
      publicHref={id ? pagePath(slug) : null}
      previewType="pages"
      canDelete={!system}
      extraTab={{
        label: "Sections",
        first: true,
        render: (doc, set, errors) => (
          <SectionBuilder
            sections={(doc.sections as PageSection[]) ?? []}
            onChange={(sections) => set({ ...doc, sections })}
            errors={errors}
            refOptions={refOptions}
            path={system ? pagePath(slug) : null}
          />
        ),
      }}
    />
  );
}

function SectionBuilder({ sections, onChange, errors, refOptions, path }: {
  sections: PageSection[];
  onChange: (s: PageSection[]) => void;
  errors: Record<string, string>;
  refOptions: RefOptions;
  path: string | null;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const listingPage = path && ["/tours", "/destinations", "/services", "/blog"].includes(path);

  const add = (type: SectionType) => {
    const _key = Math.random().toString(36).slice(2, 10);
    onChange([...sections, { _key, type, enabled: true, data: {} }]);
    setOpen(_key);
    setAdding(false);
  };
  const update = (key: string, patch: Partial<PageSection>) => onChange(sections.map((s) => (s._key === key ? { ...s, ...patch } : s)));

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-semibold">Page sections</h2>
        <p className="text-sm text-ink-soft">
          Drag to reorder. Hidden sections stay saved but don&apos;t appear on the site.
          {listingPage && " Add a “Listing position” section to control where the list appears; otherwise it follows the first section."}
        </p>
      </div>
      {sections.length === 0 && <p className="mb-3 rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-soft">This page has no sections yet.</p>}
      <SortableList
        items={sections}
        onChange={onChange}
        itemLabel={(s) => SECTION_DEFS[s.type]?.label ?? s.type}
        render={(s, i) => {
          const def = SECTION_DEFS[s.type];
          const isOpen = open === s._key;
          const heading = String(s.data.heading ?? "");
          const hasError = Object.keys(errors).some((k) => k.startsWith(`sections.${i}.`));
          return (
            <div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setOpen(isOpen ? null : s._key)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left">
                  <span className={cn("adm-badge shrink-0 border-line", s.enabled ? "bg-paper" : "opacity-50")}>{def?.label ?? s.type}</span>
                  <span className={cn("truncate text-sm", !s.enabled && "text-ink-soft line-through", hasError && "text-[#b3261e]")}>{heading || def?.description}</span>
                  <ChevronDown className={cn("ml-auto size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
                </button>
                <button type="button" className="adm-icon" onClick={() => update(s._key, { enabled: !s.enabled })} aria-pressed={!s.enabled} aria-label={s.enabled ? "Hide section" : "Show section"} title={s.enabled ? "Hide section" : "Show section"}>
                  {s.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
              </div>
              {isOpen && def && (
                <div className="border-t border-line pb-2 pt-4">
                  <FieldGrid fields={def.fields} doc={s.data} onChange={(data) => update(s._key, { data })} errors={errors} refOptions={refOptions} errorPrefix={`sections.${i}.data.`} />
                </div>
              )}
            </div>
          );
        }}
      />
      <div className="relative mt-3">
        <button type="button" className="adm-btn" onClick={() => setAdding((a) => !a)} aria-expanded={adding}><Plus className="size-4" />Add section</button>
        {adding && (
          <ul className="absolute left-0 z-20 mt-1 grid w-[min(36rem,90vw)] gap-1 rounded-lg border border-line bg-raised p-2 shadow-xl shadow-black/10 sm:grid-cols-2">
            {(Object.keys(SECTION_DEFS) as SectionType[]).map((t) => (
              <li key={t}>
                <button type="button" onClick={() => add(t)} className="w-full rounded-md p-2 text-left hover:bg-paper">
                  <span className="block text-sm font-medium">{SECTION_DEFS[t].label}</span>
                  <span className="block text-xs text-ink-soft">{SECTION_DEFS[t].description}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
