import Image from "next/image";
import type { MediaRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  image?: MediaRef | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
  quality?: number;
}

/**
 * Fills its (positioned) parent. Cloudinary and remote images go through the
 * Next.js optimizer (AVIF/WebP, responsive srcset); local SVG artwork is served as-is.
 */
export function SmartImage({ image, sizes, priority, className, imgClassName, fallbackLabel, quality = 75 }: Props) {
  if (!image?.url) {
    return (
      <div
        role={fallbackLabel ? "img" : undefined}
        aria-label={fallbackLabel}
        aria-hidden={fallbackLabel ? undefined : true}
        className={cn("absolute inset-0 bg-gradient-to-b from-moss/40 to-accent/40", className)}
      />
    );
  }
  const url = image.url.trim();
  const isSvg = /\.svg($|\?)/i.test(url);
  // Only local files and Cloudinary are whitelisted for the optimizer; anything else is served
  // as-is instead of throwing and breaking the page.
  const optimizable = url.startsWith("/") || /^https:\/\/res\.cloudinary\.com\//.test(url);
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={url}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        quality={quality}
        unoptimized={isSvg || !optimizable}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}
