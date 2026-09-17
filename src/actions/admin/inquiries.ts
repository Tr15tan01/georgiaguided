"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { guard } from "@/lib/action-error";
import { Activity, Inquiry } from "@/models";
import { inquiryStatusSchema } from "@/lib/validation";

type Result = { ok: boolean; message: string };
const validId = (id: string) => /^[a-f0-9]{24}$/i.test(id);

export async function updateInquiryStatus(id: string, status: string): Promise<Result> {
  return guard("updateInquiryStatus", () => updateInquiryStatusInner(id, status), (message) => ({ ok: false, message }));
}

async function updateInquiryStatusInner(id: string, status: string): Promise<Result> {
  const admin = await requireAdmin();
  const parsed = inquiryStatusSchema.safeParse(status);
  if (!validId(id) || !parsed.success) return { ok: false, message: "Invalid request." };
  await connectDB();
  const update: Record<string, unknown> = { status: parsed.data };
  if (parsed.data === "CONTACTED") update.contactedAt = new Date();
  const res = await Inquiry.updateOne({ _id: id }, { $set: update });
  const doc = res.matchedCount ? await Inquiry.findById(id).select("name").lean() : null;
  if (!doc) return { ok: false, message: "Inquiry not found." };
  await Activity.create({ action: `inquiry.${parsed.data.toLowerCase()}`, entity: "inquiry", entityId: id, label: doc.name, actor: admin.email });
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
  return { ok: true, message: `Marked as ${parsed.data.toLowerCase()}.` };
}

export async function addInquiryNote(id: string, body: string): Promise<Result> {
  return guard("addInquiryNote", () => addInquiryNoteInner(id, body), (message) => ({ ok: false, message }));
}

async function addInquiryNoteInner(id: string, body: string): Promise<Result> {
  const admin = await requireAdmin();
  const text = String(body ?? "").trim().slice(0, 5000);
  if (!validId(id) || !text) return { ok: false, message: "Write a note first." };
  await connectDB();
  await Inquiry.updateOne({ _id: id }, { $push: { notes: { _id: new Types.ObjectId(), body: text, author: admin.name || admin.email, createdAt: new Date() } } });
  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true, message: "Note added." };
}

export async function deleteInquiryNote(id: string, noteId: string): Promise<Result> {
  return guard("deleteInquiryNote", () => deleteInquiryNoteInner(id, noteId), (message) => ({ ok: false, message }));
}

async function deleteInquiryNoteInner(id: string, noteId: string): Promise<Result> {
  await requireAdmin();
  if (!validId(id) || !validId(noteId)) return { ok: false, message: "Invalid request." };
  await connectDB();
  await Inquiry.updateOne({ _id: id }, { $pull: { notes: { _id: noteId } } });
  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true, message: "Note removed." };
}

export async function deleteInquiry(id: string): Promise<Result> {
  return guard("deleteInquiry", () => deleteInquiryInner(id), (message) => ({ ok: false, message }));
}

async function deleteInquiryInner(id: string): Promise<Result> {
  const admin = await requireAdmin();
  if (!validId(id)) return { ok: false, message: "Invalid request." };
  await connectDB();
  const doc = await Inquiry.findById(id).select("name").lean();
  await Inquiry.deleteOne({ _id: id });
  if (doc) await Activity.create({ action: "inquiry.deleted", entity: "inquiry", entityId: id, label: doc.name, actor: admin.email });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true, message: "Inquiry deleted." };
}
