import { cn } from "@/lib/utils";
import type { InquiryStatus } from "@/constants/inquiry";

const STATUS_STYLES: Record<InquiryStatus, string> = {
  접수완료: "bg-slate-100 text-slate-700",
  상담중: "bg-sky-100 text-sky-700",
  견적서작성: "bg-amber-100 text-amber-800",
  계약완료: "bg-primary/10 text-primary",
  보류: "bg-rose-100 text-rose-700",
};

interface StatusBadgeProps {
  status: InquiryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  );
}
