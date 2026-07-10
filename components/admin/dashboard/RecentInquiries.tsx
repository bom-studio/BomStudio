import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import { formatShortDate } from "@/lib/admin/dashboard-dates";
import type { DashboardRecentInquiry } from "@/types/admin-dashboard";
import type { InquiryStatus } from "@/constants/inquiry";

interface RecentInquiriesProps {
  items: DashboardRecentInquiry[];
}

export function RecentInquiries({ items }: RecentInquiriesProps) {
  return (
    <DashboardCard title="최근 문의" subtitle="최근 5개" hover={false} className="min-h-[360px]">
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          최근 문의가 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/inquiries/${item.id}`}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3.5 transition-all duration-300 hover:border-border/60 hover:bg-muted/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {item.company || "개인"}
                </p>
              </div>
              <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatShortDate(item.createdAt)}
              </p>
              <StatusBadge status={item.status as InquiryStatus} className="shrink-0" />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
