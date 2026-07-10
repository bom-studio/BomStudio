"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CountUp } from "@/components/admin/dashboard/CountUp";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import { RevenueChangeBadge } from "@/components/admin/dashboard/DashboardHeader";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { DashboardRevenuePoint, DashboardRevenueSummary } from "@/types/admin-dashboard";

interface MonthlyRevenueChartProps {
  data: DashboardRevenuePoint[];
  summary: DashboardRevenueSummary;
}

export function MonthlyRevenueChart({ data, summary }: MonthlyRevenueChartProps) {
  const isEmpty = data.every((item) => item.amount === 0);

  const headerRight = (
    <div className="text-right">
      <p className="text-xs text-muted-foreground">이번달 매출</p>
      <p className="text-lg font-bold text-foreground">
        <CountUp value={summary.currentAmount} formatter={formatEstimateMoney} />
      </p>
      <div className="mt-1 flex items-center justify-end gap-2">
        <RevenueChangeBadge percent={summary.changePercent} />
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        지난달 {formatEstimateMoney(summary.lastMonthAmount)}
      </p>
    </div>
  );

  return (
    <DashboardCard
      title="이번달 매출 추이"
      subtitle="최근 6개월 계약금액"
      headerRight={headerRight}
      contentClassName="h-[300px]"
      hover={false}
    >
      {isEmpty ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          매출 데이터가 없습니다.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 10000 ? `${Math.round(value / 10000)}만` : String(value)
              }
            />
            <Tooltip
              formatter={(value) => [formatEstimateMoney(Number(value)), "매출"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            />
            <Bar
              dataKey="amount"
              fill="#0F766E"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  );
}
