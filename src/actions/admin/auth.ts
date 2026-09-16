"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function login(_prev: { error?: string; email?: string }, fd: FormData): Promise<{ error?: string; email?: string }> {
  const email = String(fd.get("email") ?? "").slice(0, 200);
  try {
    await signIn("credentials", {
      email,
      password: String(fd.get("password") ?? ""),
      redirectTo: "/admin",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      const code = (err as AuthError & { code?: string }).code;
      if (code === "rate_limited") return { email, error: "Too many sign-in attempts. Wait 15 minutes and try again." };
      return { email, error: "Email or password is incorrect." };
    }
    throw err; // lets the redirect through
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
