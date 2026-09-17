"use server";

import { revalidatePath } from "next/cache";
import type { Model } from "mongoose";
import type { z } from "zod";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { guard } from "@/lib/action-error";
import { Activity, BlogPost, Destination, FAQ, Page, Service, SiteSettings, Testimonial, Tour } from "@/models";
import {
  blogPostSchema, destinationSchema, faqSchema, fieldErrors, pageSchema, serviceSchema, settingsSchema,
  testimonialSchema, tourSchema,
} from "@/lib/validation";
import { isResourceKey, RESOURCES, type ResourceKey } from "@/admin/resources";

export interface SaveResult {
  ok: boolean;
  id?: string;
  message: string;
  errors?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODELS: Record<ResourceKey | "pages", Model<any>> = {
  tours: Tour, destinations: Destination, services: Service, blog: BlogPost, testimonials: Testimonial, faqs: FAQ, pages: Page,
};
const SCHEMAS: Record<ResourceKey | "pages", z.ZodType> = {
  tours: tourSchema, destinations: destinationSchema, services: serviceSchema, blog: blogPostSchema,
  testimonials: testimonialSchema, faqs: faqSchema, pages: pageSchema,
};

const RESERVED_SLUGS = new Set([
  "home", "admin", "api", "tours", "destinations", "services", "blog", "journal", "about", "contact", "faq",
  "why-georgia", "plan-your-trip", "custom-trip", "sitemap", "robots", "opengraph-image", "icon",
]);

function purgePublicCache() {
  // Content is cross-linked everywhere (home, listings, sitemap), so refresh the whole public tree.
  revalidatePath("/", "layout");
}

function describeError(err: unknown): SaveResult {
  const e = err as { code?: number; keyValue?: Record<string, unknown>; message?: string };
  if (e?.code === 11000) {
    const field = Object.keys(e.keyValue ?? {})[0] ?? "slug";
    return { ok: false, message: `That ${field} is already in use.`, errors: { [field]: `This ${field} is already used by another item.` } };
  }
  console.error("[admin] save failed", err);
  return { ok: false, message: "The item could not be saved. Please try again." };
}

async function log(action: string, entity: string, entityId: string, label: string, actor: string) {
  await Activity.create({ action, entity, entityId, label, actor });
}

export async function saveResource(resource: string, id: string | null, json: string): Promise<SaveResult> {
  return guard("saveResource", () => saveResourceInner(resource, id, json), (message) => ({ ok: false, message }));
}

async function saveResourceInner(resource: string, id: string | null, json: string): Promise<SaveResult> {
  const admin = await requireAdmin();
  if (resource !== "pages" && !isResourceKey(resource)) return { ok: false, message: "Unknown content type." };
  const key = resource as ResourceKey | "pages";
  let payload: unknown;
  try {
    payload = JSON.parse(json);
  } catch {
    return { ok: false, message: "Malformed data." };
  }
  const parsed = SCHEMAS[key].safeParse(payload);
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  const data = parsed.data as Record<string, unknown>;

  if (key === "pages") {
    await connectDB();
    const existing = id && /^[a-f0-9]{24}$/i.test(id) ? await Page.findById(id).select("slug kind").lean() : null;
    if (existing?.kind === "system") {
      // Built-in pages keep their address and type.
      data.slug = existing.slug;
      data.kind = "system";
    } else {
      if (data.kind === "system") data.kind = "custom";
      if (RESERVED_SLUGS.has(String(data.slug))) {
        return { ok: false, message: "That address is reserved.", errors: { slug: "This address is used by a built-in part of the site." } };
      }
    }
  }

  // Scheduled publishing: default publish date to now when first published.
  if (key === "blog" && data.status === "published" && !data.publishedAt) data.publishedAt = new Date();

  try {
    await connectDB();
    const Model = MODELS[key];
    const labelField = key === "pages" ? "title" : RESOURCES[key].titleField;
    const label = String(data[labelField] ?? "");
    if (id) {
      if (!/^[a-f0-9]{24}$/i.test(id)) return { ok: false, message: "Invalid id." };
      const updated = await Model.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true });
      if (!updated) return { ok: false, message: "This item no longer exists." };
      await log("updated", key, id, label, admin.email);
      purgePublicCache();
      return { ok: true, id, message: "Changes saved." };
    }
    const created = await Model.create(data);
    await log("created", key, String(created._id), label, admin.email);
    purgePublicCache();
    return { ok: true, id: String(created._id), message: "Created." };
  } catch (err) {
    return describeError(err);
  }
}

export async function deleteResource(resource: string, id: string): Promise<SaveResult> {
  return guard("deleteResource", () => deleteResourceInner(resource, id), (message) => ({ ok: false, message }));
}

async function deleteResourceInner(resource: string, id: string): Promise<SaveResult> {
  const admin = await requireAdmin();
  if ((resource !== "pages" && !isResourceKey(resource)) || !/^[a-f0-9]{24}$/i.test(id)) return { ok: false, message: "Invalid request." };
  await connectDB();
  const Model = MODELS[resource as ResourceKey | "pages"];
  const doc = await Model.findById(id).lean<{ kind?: string; title?: string; name?: string; question?: string }>();
  if (!doc) return { ok: false, message: "Already deleted." };
  if (resource === "pages" && doc.kind === "system") return { ok: false, message: "System pages can be edited or unpublished, but not deleted." };
  await Model.deleteOne({ _id: id });
  // Remove dangling references.
  const pull = (field: string) => ({ $pull: { [field]: id } });
  await Promise.all([
    Tour.updateMany({}, { ...pull("relatedTours") }),
    Tour.updateMany({}, { ...pull("destinations") }),
    Destination.updateMany({}, { ...pull("relatedTours") }),
    BlogPost.updateMany({}, { $pull: { relatedTours: id, relatedDestinations: id, relatedPosts: id } }),
  ]);
  await log("deleted", resource, id, doc.title ?? doc.name ?? doc.question ?? "", admin.email);
  purgePublicCache();
  return { ok: true, message: "Deleted." };
}

export async function setStatus(resource: string, id: string, status: "draft" | "published"): Promise<SaveResult> {
  return guard("setStatus", () => setStatusInner(resource, id, status), (message) => ({ ok: false, message }));
}

async function setStatusInner(resource: string, id: string, status: "draft" | "published"): Promise<SaveResult> {
  const admin = await requireAdmin();
  if ((resource !== "pages" && !isResourceKey(resource)) || !/^[a-f0-9]{24}$/i.test(id)) return { ok: false, message: "Invalid request." };
  if (status !== "draft" && status !== "published") return { ok: false, message: "Invalid status." };
  await connectDB();
  const Model = MODELS[resource as ResourceKey | "pages"];
  const update: Record<string, unknown> = { status };
  if (resource === "blog" && status === "published") {
    const current = await BlogPost.findById(id).select("publishedAt").lean();
    if (!current?.publishedAt) update.publishedAt = new Date();
  }
  const doc = await Model.findByIdAndUpdate(id, { $set: update }, { returnDocument: "after" }).lean<{ title?: string; name?: string }>();
  if (!doc) return { ok: false, message: "Not found." };
  await log(status === "published" ? "published" : "unpublished", resource, id, doc.title ?? doc.name ?? "", admin.email);
  purgePublicCache();
  return { ok: true, message: status === "published" ? "Published." : "Moved to drafts." };
}

export async function saveSettings(json: string): Promise<SaveResult> {
  return guard("saveSettings", () => saveSettingsInner(json), (message) => ({ ok: false, message }));
}

async function saveSettingsInner(json: string): Promise<SaveResult> {
  const admin = await requireAdmin();
  let payload: unknown;
  try {
    payload = JSON.parse(json);
  } catch {
    return { ok: false, message: "Malformed data." };
  }
  const parsed = settingsSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  await connectDB();
  await SiteSettings.findOneAndUpdate({ key: "site" }, { $set: parsed.data }, { upsert: true });
  await log("updated", "settings", "site", "Site settings", admin.email);
  purgePublicCache();
  return { ok: true, message: "Settings saved." };
}
