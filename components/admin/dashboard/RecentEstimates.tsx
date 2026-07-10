import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EstimateStatusBadge } from "@/components/admin/EstimateStatusBadge";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import { formatShortDate } from "@/lib/admin/dashboard-dates";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { DashboardRecentEstimate } from "@/types/admin-dashboard";

interface RecentEstimatesProps {
  items: DashboardRecentEstimate[];
}

export function RecentEstimates({ items }: RecentEstimatesProps) {
  return (
    <DashboardCard title="최근 견적서" subtitle="최근 5개" hover={false} className="min-h-[360px]">
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          최근 견적서가 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/estimates/${item.id}`}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3.5 transition-all duration-300 hover:border-border/60 hover:bg-muted/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.customerName}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{item.estimateNumber}</p>
                <p className="mt-1 text-sm font-bold text-[#0F766E]">
                  {formatEstimateMoney(item.total)}
                </p>
              </div>
              <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatShortDate(item.createdAt)}
              </p>
              <EstimateStatusBadge status={item.status} className="shrink-0" />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
