import type { PaymentType } from "@/constants/payment-admin";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<PaymentType, string> = {
  계약금: "bg-violet-100 text-violet-700",
  잔금: "bg-indigo-100 text-indigo-700",
  유지보수: "bg-teal-100 text-teal-700",
  기타: "bg-slate-100 text-slate-700",
};

export function PaymentTypeBadge({ type }: { type: string }) {
  const style = TYPE_STYLES[type as PaymentType] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style
      )}
    >
      {type || "-"}
    </span>
  );
}
