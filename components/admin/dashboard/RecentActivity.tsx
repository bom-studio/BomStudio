import Link from "next/link";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import type { DashboardActivity } from "@/types/admin-dashboard";
import { cn } from "@/lib/utils";

const TYPE_DOT: Record<DashboardActivity["type"], string> = {
  inquiry: "bg-sky-500",
  estimate: "bg-amber-500",
  contract: "bg-[#0F766E]",
  payment: "bg-emerald-500",
};

interface RecentActivityProps {
  items: DashboardActivity[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <DashboardCard title="최근 활동" subtitle="시간순 최신순" hover={false} className="min-h-[280px]">
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          최근 활동이 없습니다.
        </p>
      ) : (
        <div className="space-y-0">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex gap-4 border-b border-border/40 py-4 transition-colors last:border-0 hover:bg-muted/20"
            >
              <div className="flex w-12 shrink-0 flex-col items-center">
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {item.timeLabel}
                </span>
                {index < items.length - 1 ? (
                  <span className="mt-2 h-full w-px flex-1 bg-border/60" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start gap-2">
                  <span
                    className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", TYPE_DOT[item.type])}
                  />
                  <p className="text-sm text-foreground transition-colors group-hover:text-[#0F766E]">
                    {item.label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
