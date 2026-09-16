import { Schema } from "mongoose";

export const mediaRefSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    width: Number,
    height: Number,
    alt: { type: String, default: "" },
    caption: String,
  },
  { _id: false },
);

export const seoSchema = new Schema(
  {
    title: String,
    description: String,
    canonical: String,
    ogImage: { type: mediaRefSchema, default: null },
    noindex: { type: Boolean, default: false },
  },
  { _id: false },
);

export const linkSchema = new Schema({ label: String, href: String }, { _id: false });

export const statusField = { type: String, enum: ["draft", "published"], default: "draft", index: true };
export const slugField = { type: String, required: true, unique: true, trim: true, lowercase: true };
