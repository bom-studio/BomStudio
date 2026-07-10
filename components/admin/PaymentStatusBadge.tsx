import type { PaymentStatus } from "@/constants/payment-admin";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<PaymentStatus, string> = {
  입금완료: "bg-emerald-100 text-emerald-700",
  입금대기: "bg-amber-100 text-amber-800",
  입금예정: "bg-sky-100 text-sky-700",
  부분입금: "bg-orange-100 text-orange-700",
  연체: "bg-rose-100 text-rose-700",
  취소: "bg-rose-100 text-rose-700",
  환불: "bg-slate-100 text-slate-600",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status as PaymentStatus] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style
      )}
    >
      {status || "-"}
    </span>
  );
}
