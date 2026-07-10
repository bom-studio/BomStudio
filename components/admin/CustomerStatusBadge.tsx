import { cn } from "@/lib/utils";
import type { CustomerStatus } from "@/constants/customer-admin";

const STATUS_STYLES: Record<CustomerStatus, string> = {
  신규: "bg-slate-100 text-slate-700",
  상담중: "bg-sky-100 text-sky-700",
  진행중: "bg-amber-100 text-amber-800",
  완료: "bg-emerald-100 text-emerald-700",
  휴면: "bg-rose-100 text-rose-700",
};

interface CustomerStatusBadgeProps {
  status: string;
  className?: string;
}

export function CustomerStatusBadge({ status, className }: CustomerStatusBadgeProps) {
  const label = status || "신규";
  const style =
    label in STATUS_STYLES
      ? STATUS_STYLES[label as CustomerStatus]
      : "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
