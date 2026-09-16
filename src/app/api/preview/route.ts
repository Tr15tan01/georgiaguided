import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const PREFIX: Record<string, string> = { tours: "/tours/", destinations: "/destinations/", services: "/services/", blog: "/blog/", pages: "/" };

/** Admin-only: enable draft mode and open the requested content. */
export async function GET(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  const type = req.nextUrl.searchParams.get("type") ?? "";
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!PREFIX[type] || !/^[a-z0-9-]+$/.test(slug)) return new Response("Invalid preview request", { status: 400 });
  (await draftMode()).enable();
  const system: Record<string, string> = { home: "/", tours: "/tours", destinations: "/destinations", services: "/services", blog: "/blog" };
  redirect(type === "pages" ? system[slug] ?? `/${slug}` : `${PREFIX[type]}${slug}`);
}
