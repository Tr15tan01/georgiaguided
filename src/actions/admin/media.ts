"use server";

import { revalidatePath } from "next/cache";
import { connectDB, serialize } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { cloudinaryConfigured, destroyAsset, uploadBuffer } from "@/lib/cloudinary";
import { Activity, BlogPost, Destination, Media, Page, Service, SiteSettings, Tour } from "@/models";
import type { MediaItem } from "@/lib/types";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024;
const validId = (id: string) => /^[a-f0-9]{24}$/i.test(id);
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listMedia(query = "", page = 1): Promise<{ items: MediaItem[]; total: number; pages: number; configured: boolean }> {
  await requireAdmin();
  await connectDB();
  const perPage = 30;
  const q = query.trim().slice(0, 100);
  const filter = q ? { $or: [{ alt: { $regex: escapeRegex(q), $options: "i" } }, { publicId: { $regex: escapeRegex(q), $options: "i" } }] } : {};
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip((Math.max(1, page) - 1) * perPage).limit(perPage).lean(),
    Media.countDocuments(filter),
  ]);
  return { items: serialize(items), total, pages: Math.max(1, Math.ceil(total / perPage)), configured: cloudinaryConfigured() };
}

export async function uploadMedia(fd: FormData): Promise<{ ok: boolean; message: string; items?: MediaItem[] }> {
  const admin = await requireAdmin();
  if (!cloudinaryConfigured()) return { ok: false, message: "Cloudinary is not configured. Add the CLOUDINARY_* environment variables." };
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0).slice(0, 10);
  if (!files.length) return { ok: false, message: "Choose at least one image." };
  await connectDB();
  const out: MediaItem[] = [];
  for (const file of files) {
    if (!ALLOWED.has(file.type)) return { ok: false, message: `${file.name}: use JPG, PNG, WebP, AVIF or GIF.` };
    if (file.size > MAX_BYTES) return { ok: false, message: `${file.name} is larger than 10 MB.` };
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadBuffer(buffer, file.name.replace(/\.[^.]+$/, ""));
    const alt = String(fd.get("alt") ?? "").trim().slice(0, 300) || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    const doc = await Media.create({
      url: res.secure_url, publicId: res.public_id, width: res.width, height: res.height, format: res.format, bytes: res.bytes, alt,
    });
    out.push(serialize(doc.toObject()));
  }
  await Activity.create({ action: "media.uploaded", entity: "media", label: `${out.length} image(s)`, actor: admin.email });
  revalidatePath("/admin/media");
  return { ok: true, message: `Uploaded ${out.length} image${out.length > 1 ? "s" : ""}.`, items: out };
}

export async function updateMedia(id: string, alt: string, caption: string): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  if (!validId(id)) return { ok: false, message: "Invalid request." };
  await connectDB();
  await Media.updateOne({ _id: id }, { $set: { alt: String(alt).trim().slice(0, 300), caption: String(caption).trim().slice(0, 500) } });
  revalidatePath("/admin/media");
  return { ok: true, message: "Image details saved. Content that already uses this image keeps its own alt text — update it there if needed." };
}

/** Counts content documents that reference a Cloudinary public ID anywhere in known image fields. */
export async function mediaUsage(publicId: string): Promise<number> {
  await requireAdmin();
  await connectDB();
  const q = (paths: string[]) => ({ $or: paths.map((p) => ({ [p]: publicId })) });
  const counts = await Promise.all([
    Tour.countDocuments(q(["heroImage.publicId", "gallery.publicId", "seo.ogImage.publicId"])),
    Destination.countDocuments(q(["heroImage.publicId", "gallery.publicId", "seo.ogImage.publicId"])),
    Service.countDocuments(q(["image.publicId", "seo.ogImage.publicId"])),
    BlogPost.countDocuments(q(["coverImage.publicId", "seo.ogImage.publicId"])),
    Page.countDocuments(q(["sections.data.image.publicId", "seo.ogImage.publicId"])),
    SiteSettings.countDocuments(q(["logo.publicId", "favicon.publicId", "defaultOgImage.publicId"])),
  ]);
  return counts.reduce((a, b) => a + b, 0);
}

export async function deleteMedia(id: string): Promise<{ ok: boolean; message: string }> {
  const admin = await requireAdmin();
  if (!validId(id)) return { ok: false, message: "Invalid request." };
  await connectDB();
  const doc = await Media.findById(id).lean();
  if (!doc) return { ok: false, message: "Image not found." };
  const used = await mediaUsage(doc.publicId);
  if (used > 0) return { ok: false, message: `This image is used in ${used} item${used > 1 ? "s" : ""}. Replace it there first.` };
  if (cloudinaryConfigured() && !doc.publicId.startsWith("seed/")) await destroyAsset(doc.publicId);
  await Media.deleteOne({ _id: id });
  await Activity.create({ action: "media.deleted", entity: "media", entityId: id, label: doc.publicId, actor: admin.email });
  revalidatePath("/admin/media");
  return { ok: true, message: "Image deleted." };
}
