import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export interface AdminSession { id: string; email: string; name: string; role: string }

/** For admin server components: redirect to login when unauthenticated. */
export async function requireAdminPage(): Promise<AdminSession> {
  const session = await auth();
  const u = session?.user as Partial<AdminSession> | undefined;
  if (!u?.id || u.role !== "admin") redirect("/admin/login");
  return u as AdminSession;
}

/** For server actions and route handlers: throw when unauthenticated. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();
  const u = session?.user as Partial<AdminSession> | undefined;
  if (!u?.id || u.role !== "admin") throw new Error("Unauthorized");
  return u as AdminSession;
}
