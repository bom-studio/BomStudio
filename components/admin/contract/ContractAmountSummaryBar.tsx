import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import { formatKoreanAmount, formatVatLabel } from "@/lib/format/money";
import { cn } from "@/lib/utils";

interface ContractAmountSummaryBarProps {
  amount: number;
  vatType?: string | null;
  variant?: "admin" | "document";
  className?: string;
}

export function ContractAmountSummaryBar({
  amount,
  vatType,
  variant = "admin",
  className,
}: ContractAmountSummaryBarProps) {
  const koreanAmount = formatKoreanAmount(amount);
  const formattedAmount = formatEstimateMoney(amount);
  const vatLabel = formatVatLabel(vatType);

  const isDocument = variant === "document";

  return (
    <div
      className={cn(
        "flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-primary/10 bg-[#F0FDFA] px-4 py-3 sm:min-h-[64px] sm:flex-nowrap sm:justify-between",
        isDocument && "mt-3 border-[#E5E7EB] bg-[#F8FAFC] text-[13px]",
        className
      )}
    >
      <span
        className={cn(
          "shrink-0 font-medium text-gray-600",
          isDocument ? "text-[13px]" : "text-sm"
        )}
      >
        합계금액
      </span>

      <span
        className={cn(
          "min-w-0 flex-1 text-gray-800",
          isDocument ? "text-[13px] font-medium" : "text-sm font-medium"
        )}
      >
        {koreanAmount}
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:shrink-0">
        <span
          className={cn(
            "font-bold text-[#0F766E]",
            isDocument ? "text-[15px]" : "text-base sm:text-lg"
          )}
        >
          ( {formattedAmount} )
        </span>
        <span
          className={cn(
            "text-gray-500",
            isDocument ? "text-[11px]" : "text-xs sm:text-sm"
          )}
        >
          {vatLabel}
        </span>
      </div>
    </div>
  );
}
