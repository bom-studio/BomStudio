import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import { cn } from "@/lib/utils";

interface PaymentAmountSummaryBarProps {
  amount: number;
  className?: string;
}

export function PaymentAmountSummaryBar({ amount, className }: PaymentAmountSummaryBarProps) {
  return (
    <div
      className={cn(
        "flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/10 bg-[#F0FDFA] px-4 py-3 sm:min-h-[64px]",
        className
      )}
    >
      <span className="text-sm font-medium text-gray-600">결제금액</span>
      <span className="text-base font-bold text-[#0F766E] sm:text-lg">
        {formatEstimateMoney(amount)}
      </span>
    </div>
  );
}
