"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin thumbnail. Uses a plain <img> on purpose: next/image throws (and crashes the
 * whole editor) for any URL whose host isn't whitelisted, and the library may contain
 * images from anywhere. Cloudinary images get a small resized version.
 */
export function Thumb({ src, alt, width = 400, className, contain }: { src?: string | null; alt?: string; width?: number; className?: string; contain?: boolean }) {
  const [failed, setFailed] = useState(false);
  const url = typeof src === "string" ? src.trim() : "";
  if (!url || failed) {
    return (
      <span className={cn("absolute inset-0 flex flex-col items-center justify-center gap-1 bg-line text-xs text-ink-soft", className)}>
        <ImageOff aria-hidden className="size-5" />
        {url ? "Can't load image" : "No image"}
      </span>
    );
  }
  const small = url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("/upload/c_")
    ? url.replace("/upload/", `/upload/c_limit,w_${width},q_auto,f_auto/`)
    : url;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={small}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("absolute inset-0 size-full", contain ? "object-contain" : "object-cover", className)}
    />
  );
}
