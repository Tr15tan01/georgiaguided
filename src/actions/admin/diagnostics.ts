"use server";

import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { Media } from "@/models";

export interface Diagnostics {
  ok: boolean;
  checkedAt: string;
  session: string;
  database: string;
  mediaCount: number | null;
  cloudinary: string;
  email: string;
  siteUrl: string;
  node: string;
  error?: string;
}

/**
 * Runs the same steps a normal admin action does (session → database → config) and
 * reports where it fails, so production problems can be diagnosed without server logs.
 */
export async function runDiagnostics(): Promise<Diagnostics> {
  const base: Diagnostics = {
    ok: false,
    checkedAt: new Date().toISOString(),
    session: "not checked",
    database: "not checked",
    mediaCount: null,
    cloudinary: cloudinaryConfigured() ? "configured" : "not configured (uploads disabled)",
    email: process.env.RESEND_API_KEY ? "Resend key present" : "no Resend key (emails skipped)",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "not set",
    node: process.version,
  };
  try {
    const session = await auth();
    const user = session?.user as { email?: string; role?: string } | undefined;
    base.session = user?.role === "admin" ? `signed in as ${user.email}` : "no valid admin session";
    if (user?.role !== "admin") {
      base.error = "The server action ran, but your session wasn't recognised. Sign out and in again; if it persists, check AUTH_SECRET and AUTH_URL.";
      return base;
    }
    await connectDB();
    base.database = `connected (${mongoose.connection.name})`;
    base.mediaCount = await Media.countDocuments();
    base.ok = true;
    return base;
  } catch (err) {
    base.error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[diagnostics]", err);
    return base;
  }
}
