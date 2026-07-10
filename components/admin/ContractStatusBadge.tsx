import { cn } from "@/lib/utils";
import type { ContractStatus } from "@/constants/contract-admin";

const STATUS_STYLES: Record<ContractStatus, string> = {
  작성중: "bg-amber-100 text-amber-800",
  발송완료: "bg-sky-100 text-sky-700",
  서명완료: "bg-emerald-100 text-emerald-700",
  계약완료: "bg-emerald-100 text-emerald-700",
  진행중: "bg-sky-100 text-sky-700",
  종료: "bg-slate-100 text-slate-700",
  취소: "bg-rose-100 text-rose-700",
};

interface ContractStatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function ContractStatusBadge({ status, className }: ContractStatusBadgeProps) {
  const label = status || "작성중";
  const style =
    label in STATUS_STYLES
      ? STATUS_STYLES[label as ContractStatus]
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
