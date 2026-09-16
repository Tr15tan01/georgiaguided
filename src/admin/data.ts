import "server-only";
import type { Model } from "mongoose";
import { connectDB, serialize } from "@/lib/db";
import { BlogPost, Destination, FAQ, Service, Testimonial, Tour } from "@/models";
import type { RefOptions, RefResource } from "./fields";
import type { ResourceKey } from "./resources";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RESOURCE_MODELS: Record<ResourceKey, Model<any>> = {
  tours: Tour, destinations: Destination, services: Service, blog: BlogPost, testimonials: Testimonial, faqs: FAQ,
};

const REF_LABEL: Record<RefResource, string> = { tours: "title", destinations: "name", services: "title", blog: "title", testimonials: "name" };

/** Options for reference pickers; drafts are labelled so editors know they won't show publicly. */
export async function getRefOptions(resources: RefResource[], excludeId?: string): Promise<RefOptions> {
  await connectDB();
  const out: RefOptions = {};
  await Promise.all(
    [...new Set(resources)].map(async (r) => {
      const field = REF_LABEL[r];
      const docs = await RESOURCE_MODELS[r].find(excludeId ? { _id: { $ne: excludeId } } : {}).select(`${field} status`).sort({ [field]: 1 }).lean<{ _id: unknown; status?: string; [k: string]: unknown }[]>();
      out[r] = docs.map((d) => ({ value: String(d._id), label: `${String(d[field] ?? "Untitled")}${d.status === "draft" ? " (draft)" : ""}` }));
    }),
  );
  return out;
}

/** Load a document for the editor as plain JSON with ObjectId refs as strings. */
export async function loadForEdit(resource: ResourceKey, id: string): Promise<Record<string, unknown> | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  await connectDB();
  const doc = await RESOURCE_MODELS[resource].findById(id).lean();
  if (!doc) return null;
  const plain = serialize<Record<string, unknown>>(doc);
  return stripMeta(plain);
}

export function stripMeta(doc: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...doc };
  delete rest._id;
  delete rest.__v;
  delete rest.createdAt;
  delete rest.updatedAt;
  return rest;
}
