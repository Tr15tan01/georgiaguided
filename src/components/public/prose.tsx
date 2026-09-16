import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/** Server-rendered, sanitized markdown. */
export function Prose({ markdown, className }: { markdown?: string | null; className?: string }) {
  const html = renderMarkdown(markdown);
  if (!html) return null;
  return <div className={cn("prose prose-lg prose-gg max-w-none", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
