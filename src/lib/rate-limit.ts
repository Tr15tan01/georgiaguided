import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { connectDB } from "./db";
import { env } from "./env";
import { RateLimit } from "@/models";

export async function clientFingerprint(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${env.rateLimitSalt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Fixed-window rate limiter persisted in MongoDB so it works across serverless
 * instances. Returns true when the request is allowed.
 */
export async function rateLimit(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  await connectDB();
  const id = await clientFingerprint();
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `${bucket}:${id}:${windowStart}`;
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowSeconds * 1000) } },
    { upsert: true, returnDocument: "after" },
  ).lean();
  return (doc?.count ?? 1) <= limit;
}

function windowKey(bucket: string, id: string, windowSeconds: number) {
  return `${bucket}:${id}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
}

/** Read-only check: true while fewer than `limit` hits were recorded in the current window. */
export async function underLimit(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  await connectDB();
  const doc = await RateLimit.findOne({ key: windowKey(bucket, await clientFingerprint(), windowSeconds) }).select("count").lean();
  return (doc?.count ?? 0) < limit;
}

/** Record one hit (e.g. a failed sign-in) without checking the limit. */
export async function recordHit(bucket: string, windowSeconds: number): Promise<void> {
  await connectDB();
  await RateLimit.updateOne(
    { key: windowKey(bucket, await clientFingerprint(), windowSeconds) },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowSeconds * 1000) } },
    { upsert: true },
  );
}
