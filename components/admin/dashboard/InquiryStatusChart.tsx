"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import type { DashboardStatusPoint } from "@/types/admin-dashboard";

const COLORS: Record<string, string> = {
  접수완료: "#94A3B8",
  상담중: "#38BDF8",
  견적서작성: "#F59E0B",
  계약완료: "#0F766E",
  보류: "#F43F5E",
};

interface InquiryStatusChartProps {
  data: DashboardStatusPoint[];
}

export function InquiryStatusChart({ data }: InquiryStatusChartProps) {
  const chartData = data.filter((item) => item.count > 0);
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const isEmpty = total === 0;

  return (
    <DashboardCard
      title="문의 상태 비율"
      subtitle="전체 문의 기준"
      contentClassName="min-h-[300px]"
      className="min-h-[380px]"
    >
      {isEmpty ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          상태 데이터가 없습니다.
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="relative h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={COLORS[entry.status] ?? "#CBD5E1"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => {
                    const count = Number(value);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return [`${count}건 (${pct}%)`, item?.payload?.status ?? ""];
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-semibold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">전체</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {data.map((item) => (
              <div key={item.status} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[item.status] ?? "#CBD5E1" }}
                />
                <span className="text-muted-foreground">{item.status}</span>
                <span className="ml-auto font-medium text-foreground">{item.count}건</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
