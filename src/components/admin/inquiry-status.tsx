import type { InquiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const STATUS_STYLE: Record<InquiryStatus, string> = {
  NEW: "bg-accent text-accent-ink",
  CONTACTED: "bg-[#2f5d8a]/15 text-[#2f5d8a] dark:text-[#9cc3ea]",
  QUOTED: "bg-brass/15 text-brass",
  CONFIRMED: "bg-moss/20 text-moss",
  COMPLETED: "bg-moss/10 text-moss",
  CANCELLED: "bg-[#b3261e]/10 text-[#b3261e] dark:text-[#f2b8b5]",
  ARCHIVED: "bg-ink/10 text-ink-soft",
};

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return <span className={cn("adm-badge", STATUS_STYLE[status])}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
}
