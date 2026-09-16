import { cn } from "@/lib/utils";

/** The Greater Caucasus skyline — the site's single recurring motif. */
export function Ridge({ className, variant = "line" }: { className?: string; variant?: "line" | "fill" }) {
  const d = "M0 64 L58 40 L92 50 L140 22 L170 36 L214 8 L252 34 L286 26 L330 48 L372 18 L410 30 L452 4 L498 38 L540 28 L590 52 L640 20 L684 34 L730 14 L770 42 L820 30 L868 50 L920 24 L960 38 L1000 30";
  return (
    <svg viewBox="0 0 1000 64" preserveAspectRatio="none" aria-hidden="true" className={cn("block w-full", className)}>
      {variant === "fill" ? (
        <path d={`${d} L1000 64 Z`} fill="currentColor" />
      ) : (
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}
