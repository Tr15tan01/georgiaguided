/** Serialises structured data safely (escapes `<` so content cannot close the script tag). */
export function JsonLd({ data }: { data: Record<string, unknown> | null | (Record<string, unknown> | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!items.length) return null;
  const json = JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
