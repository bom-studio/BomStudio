import { cn } from "@/lib/utils";
import type { EstimateStatus } from "@/constants/estimate-admin";

const STATUS_STYLES: Record<EstimateStatus, string> = {
  작성중: "bg-amber-100 text-amber-800",
  발송완료: "bg-sky-100 text-sky-700",
  수정요청: "bg-amber-100 text-amber-800",
  승인완료: "bg-emerald-100 text-emerald-700",
  계약완료: "bg-emerald-100 text-emerald-700",
  보류: "bg-slate-100 text-slate-700",
  취소: "bg-rose-100 text-rose-700",
};

interface EstimateStatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function EstimateStatusBadge({ status, className }: EstimateStatusBadgeProps) {
  const label = status || "작성중";
  const style =
    label in STATUS_STYLES
      ? STATUS_STYLES[label as EstimateStatus]
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
