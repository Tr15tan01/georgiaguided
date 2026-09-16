/** Declarative field definitions that drive the admin editors. Client-safe. */

export type RefResource = "tours" | "destinations" | "services" | "blog" | "testimonials";

interface FieldBase {
  name: string; // dot-path into the document
  label: string;
  help?: string;
  required?: boolean;
  placeholder?: string;
  wide?: boolean;
}

export type Field =
  | (FieldBase & { type: "text" | "textarea" | "markdown" | "number" | "checkbox" | "datetime" | "url" | "email" })
  | (FieldBase & { type: "select"; options: { value: string; label: string }[] })
  | (FieldBase & { type: "slug"; from: string })
  | (FieldBase & { type: "image" | "gallery" | "seo" | "link" | "links" })
  | (FieldBase & { type: "stringList" | "tags"; itemLabel?: string; suggestions?: string[] })
  | (FieldBase & { type: "repeater"; itemLabel: string; titleKey: string; fields: Field[] })
  | (FieldBase & { type: "refs"; resource: RefResource });

export interface Tab {
  label: string;
  fields: Field[];
}

export type RefOptions = Partial<Record<RefResource, { value: string; label: string }[]>>;

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone: Record<string, unknown> = Array.isArray(obj) ? ([...obj] as unknown as Record<string, unknown>) : { ...obj };
  let cur = clone;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value;
    } else {
      const next = cur[k];
      cur[k] = next && typeof next === "object" ? (Array.isArray(next) ? [...next] : { ...(next as object) }) : {};
      cur = cur[k] as Record<string, unknown>;
    }
  });
  return clone as T;
}

export function refFieldsIn(tabs: Tab[]): RefResource[] {
  const out = new Set<RefResource>();
  const walk = (fields: Field[]) =>
    fields.forEach((f) => {
      if (f.type === "refs") out.add(f.resource);
      if (f.type === "repeater") walk(f.fields);
    });
  tabs.forEach((t) => walk(t.fields));
  return [...out];
}
