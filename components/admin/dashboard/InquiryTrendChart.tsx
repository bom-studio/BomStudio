"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import type { DashboardTrendPoint } from "@/types/admin-dashboard";

interface InquiryTrendChartProps {
  data: DashboardTrendPoint[];
}

export function InquiryTrendChart({ data }: InquiryTrendChartProps) {
  const isEmpty = data.every((item) => item.count === 0);

  return (
    <DashboardCard
      title="문의 추이"
      subtitle="최근 30일"
      contentClassName="h-[300px]"
      className="min-h-[380px]"
    >
      {isEmpty ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          최근 문의 데이터가 없습니다.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ stroke: "#0F766E", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
              formatter={(value) => [`${value}건`, "문의"]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0F766E"
              strokeWidth={2.5}
              dot={{ r: 2, fill: "#0F766E", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#0F766E", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  );
}
