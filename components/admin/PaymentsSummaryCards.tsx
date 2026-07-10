import { AlertCircle, Banknote, TrendingUp, Wallet, Wrench } from "lucide-react";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { MonthlyPaymentSummary } from "@/types/admin-payment";
import { cn } from "@/lib/utils";

interface PaymentsSummaryCardsProps {
  summary: MonthlyPaymentSummary;
  periodLabel?: string;
}

const CARDS = [
  {
    key: "downPayment" as const,
    label: "계약금",
    icon: Wallet,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "balancePayment" as const,
    label: "잔금",
    icon: Banknote,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    key: "maintenance" as const,
    label: "유지보수",
    icon: Wrench,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    key: "totalRevenue" as const,
    label: "총 매출",
    icon: TrendingUp,
    color: "text-[#0F766E]",
    bg: "bg-[#F0FDFA]",
  },
  {
    key: "unpaidAmount" as const,
    label: "미수금",
    icon: AlertCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export function PaymentsSummaryCards({
  summary,
  periodLabel = "이번 달",
}: PaymentsSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key];

        return (
          <section
            key={card.key}
            className="rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
                  {formatEstimateMoney(value)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {card.key === "unpaidAmount" ? "전체 미수금" : `${periodLabel} 기준`}
                </p>
              </div>
              <div className={cn("rounded-lg p-2.5", card.bg)}>
                <Icon className={cn("h-5 w-5", card.color)} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
