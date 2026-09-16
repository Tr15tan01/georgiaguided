"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, Save } from "lucide-react";
import type { Tab } from "@/admin/fields";
import { EXPERIENCES } from "@/admin/resources";
import { saveSettings } from "@/actions/admin/content";
import { cn } from "@/lib/utils";
import { FieldGrid } from "./fields";
import { useToast } from "./toast";

const TABS: Tab[] = [
  {
    label: "Company",
    fields: [
      { name: "companyName", label: "Company name", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text", placeholder: "+995 …" },
      { name: "whatsapp", label: "WhatsApp number", type: "text", help: "International format, used for the WhatsApp link." },
      { name: "businessHours", label: "Business hours", type: "text", placeholder: "Mon–Sat, 9:00–19:00 (GMT+4)" },
      { name: "address", label: "Address", type: "textarea", wide: true },
      { name: "googleMapsUrl", label: "Google Maps URL", type: "url", wide: true },
      { name: "logo", label: "Logo (optional — the wordmark is used otherwise)", type: "image", wide: true },
      { name: "favicon", label: "Favicon (square PNG)", type: "image", wide: true },
    ],
  },
  {
    label: "Navigation",
    fields: [
      { name: "navigation", label: "Main menu", type: "links", wide: true, help: "Keep it to six items or fewer." },
      { name: "headerCta", label: "Header button", type: "link", wide: true },
      { name: "socialLinks", label: "Social profiles", type: "links", wide: true, help: "Label with the network name, e.g. Instagram." },
    ],
  },
  {
    label: "Footer",
    fields: [
      { name: "footerDescription", label: "Footer description", type: "textarea", wide: true },
      {
        name: "footerColumns", label: "Link columns", type: "repeater", itemLabel: "column", titleKey: "title", wide: true,
        fields: [
          { name: "title", label: "Column title", type: "text", wide: true },
          { name: "links", label: "Links", type: "links", wide: true },
        ],
      },
      { name: "legalLinks", label: "Legal links", type: "links", wide: true },
    ],
  },
  {
    label: "SEO & analytics",
    fields: [
      { name: "defaultSeoTitle", label: "Default SEO title (homepage)", type: "text", required: true, wide: true },
      { name: "defaultSeoDescription", label: "Default meta description", type: "textarea", wide: true },
      { name: "defaultOgImage", label: "Default social sharing image (1200×630)", type: "image", wide: true },
      { name: "gaId", label: "Google Analytics 4 ID", type: "text", placeholder: "G-XXXXXXX", help: "Overrides NEXT_PUBLIC_GA_ID when set." },
      { name: "plausibleDomain", label: "Plausible domain (optional)", type: "text" },
    ],
  },
  {
    label: "Inquiry form",
    fields: [
      { name: "inquiryOptions.destinations", label: "Destination choices", type: "stringList", itemLabel: "destination", wide: true, help: "Leave empty to use your published destinations." },
      { name: "inquiryOptions.experiences", label: "Experience choices", type: "tags", suggestions: EXPERIENCES, wide: true },
      { name: "inquiryOptions.interests", label: "Extra services to offer", type: "tags", wide: true, help: "e.g. Private guide, Wine tastings, Photography stops." },
    ],
  },
];

export function SettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const router = useRouter();
  const toast = useToast();
  const [doc, setDoc] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);
  const [pending, start] = useTransition();
  const tabErr = (t: Tab) => t.fields.some((f) => Object.keys(errors).some((k) => k === f.name || k.startsWith(f.name + ".")));

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await saveSettings(JSON.stringify(doc));
          toast(res.ok ? "success" : "error", res.message);
          setErrors(res.errors ?? {});
          if (!res.ok) {
            const i = TABS.findIndex((t) => t.fields.some((f) => Object.keys(res.errors ?? {}).some((k) => k === f.name || k.startsWith(f.name + "."))));
            if (i >= 0) setActive(i);
          } else router.refresh();
        });
      }}
    >
      <div className="mb-6 overflow-x-auto border-b border-line">
        <div role="tablist" className="flex gap-1">
          {TABS.map((t, i) => (
            <button key={t.label} type="button" role="tab" id={`st-${i}`} aria-controls={`sp-${i}`} aria-selected={active === i} onClick={() => setActive(i)}
              className={cn("relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium", active === i ? "after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-accent" : "text-ink-soft hover:text-ink")}>
              {t.label}{tabErr(t) && <AlertCircle className="size-3.5 text-[#b3261e]" aria-label="has errors" />}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-4xl">
        {TABS.map((t, i) => (
          <section key={t.label} role="tabpanel" id={`sp-${i}`} aria-labelledby={`st-${i}`} hidden={active !== i} className="adm-card p-5 sm:p-6">
            <FieldGrid fields={t.fields} doc={doc} onChange={setDoc} errors={errors} refOptions={{}} />
          </section>
        ))}
        <div className="sticky bottom-0 -mx-4 mt-4 flex justify-end border-t border-line bg-paper/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}><Save className="size-4" />{pending ? "Saving…" : "Save settings"}</button>
        </div>
      </div>
    </form>
  );
}
