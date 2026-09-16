"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { renderMarkdown } from "@/lib/markdown";

/** Renders markdown exactly as the public site will (sanitized). */
export async function previewMarkdown(md: string): Promise<string> {
  await requireAdmin();
  return renderMarkdown(String(md ?? "").slice(0, 120_000));
}
