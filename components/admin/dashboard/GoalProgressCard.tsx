"use client";

import Link from "next/link";
import { CountUp } from "@/components/admin/dashboard/CountUp";
import { DashboardCard, DashboardProgressBar } from "@/components/admin/dashboard/DashboardCard";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { DashboardGoal } from "@/types/admin-dashboard";

interface GoalProgressCardProps {
  goal: DashboardGoal;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  return (
    <DashboardCard title="목표 달성률" subtitle="이번달 매출 목표" hover={false} className="min-h-[280px]">
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">이번달 목표</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatEstimateMoney(goal.targetAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">현재</p>
            <p className="mt-1 text-2xl font-bold text-[#0F766E]">
              <CountUp value={goal.currentAmount} formatter={formatEstimateMoney} />
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-[#0F766E]">
              <CountUp value={goal.percent} formatter={(v) => `${v}%`} />
            </span>
          </div>
          <DashboardProgressBar percent={goal.percent} className="h-2.5" />
        </div>

        <Link
          href="/admin/payments"
          className="text-xs font-medium text-[#0F766E] hover:underline"
        >
          매출 상세 보기 →
        </Link>
      </div>
    </DashboardCard>
  );
}
