"use server";

import { connectDB, serialize } from "@/lib/db";
import { Activity, Inquiry } from "@/models";
import { contactSchema, fieldErrors, tripInquirySchema } from "@/lib/validation";
import { clientFingerprint, rateLimit } from "@/lib/rate-limit";
import { sendInquiryEmails } from "@/lib/email";
import { getSettings } from "@/data/public";
import type { Inquiry as TInquiry } from "@/lib/types";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string | string[] | boolean>;
}

const MIN_FILL_MS = 2500;

function isBot(fd: FormData): boolean {
  if (String(fd.get("website") ?? "").trim() !== "") return true; // honeypot
  const ts = Number(fd.get("_ts"));
  return !Number.isFinite(ts) || Date.now() - ts < MIN_FILL_MS;
}

const list = (fd: FormData, key: string) =>
  [...new Set(fd.getAll(key).map((v) => String(v).trim()).filter(Boolean))].slice(0, 30);

async function persistAndNotify(data: Record<string, unknown>, label: string) {
  const ipHash = await clientFingerprint();
  const doc = await Inquiry.create({ ...data, ipHash });
  await Activity.create({ action: "inquiry.created", entity: "inquiry", entityId: String(doc._id), label });
  const plain = serialize<TInquiry>(doc.toObject());
  const settings = await getSettings();
  await sendInquiryEmails(plain, settings.companyName, settings.email);
}

export async function submitTripInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const raw = {
    name: String(fd.get("name") ?? ""),
    email: String(fd.get("email") ?? ""),
    phone: String(fd.get("phone") ?? ""),
    country: String(fd.get("country") ?? ""),
    arrivalDate: String(fd.get("arrivalDate") ?? "") || undefined,
    departureDate: String(fd.get("departureDate") ?? "") || undefined,
    travelers: String(fd.get("travelers") ?? ""),
    destinations: list(fd, "destinations"),
    experiences: list(fd, "experiences"),
    interests: list(fd, "interests"),
    accommodationNeeded: fd.get("accommodationNeeded") === "on",
    airportTransferNeeded: fd.get("airportTransferNeeded") === "on",
    message: String(fd.get("message") ?? ""),
    sourcePath: String(fd.get("sourcePath") ?? ""),
  };
  const values = { ...raw, arrivalDate: raw.arrivalDate ?? "", departureDate: raw.departureDate ?? "" };


  const parsed = tripInquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }
  // Spam guards run after validation so real visitors always see field errors.
  if (isBot(fd)) return { status: "success", message: "Thank you — your request is on its way." };

  try {
    await connectDB();
    if (!(await rateLimit("inquiry", 5, 60 * 60))) {
      return { status: "error", message: "We have received several requests from you recently. Please try again later or email us directly.", values };
    }
    await persistAndNotify({ type: "trip", ...parsed.data }, `${parsed.data.name} (${parsed.data.country})`);
  } catch (err) {
    console.error("[inquiry] failed", err);
    return { status: "error", message: "Your request could not be sent. Please try again in a moment, or email us directly.", values };
  }
  return { status: "success", message: "Thank you. We have your request and will reply personally, usually within one business day. A confirmation is on its way to your inbox." };
}

export async function submitContact(_prev: FormState, fd: FormData): Promise<FormState> {
  const raw = {
    name: String(fd.get("name") ?? ""),
    email: String(fd.get("email") ?? ""),
    subject: String(fd.get("subject") ?? ""),
    message: String(fd.get("message") ?? ""),
    sourcePath: String(fd.get("sourcePath") ?? ""),
  };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error), values: raw };
  }
  // Spam guards run after validation so real visitors always see field errors.
  if (isBot(fd)) return { status: "success", message: "Thank you — your message has been sent." };
  try {
    await connectDB();
    if (!(await rateLimit("contact", 5, 60 * 60))) {
      return { status: "error", message: "Too many messages from this connection. Please try again later.", values: raw };
    }
    await persistAndNotify(
      { type: "contact", ...parsed.data, destinations: [], experiences: [], interests: [] },
      parsed.data.name,
    );
  } catch (err) {
    console.error("[contact] failed", err);
    return { status: "error", message: "Your message could not be sent. Please try again in a moment.", values: raw };
  }
  return { status: "success", message: "Thank you — your message has been sent. We will get back to you shortly." };
}
