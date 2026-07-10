"use client";

import { ArrowDown } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import type { DashboardFunnelStep } from "@/types/admin-dashboard";
import { cn } from "@/lib/utils";

const STEP_COLORS = [
  "border-teal-100 bg-teal-50/70 text-teal-700",
  "border-teal-200 bg-teal-100/70 text-teal-800",
  "border-teal-300 bg-teal-200/50 text-teal-900",
  "border-[#99F6E4] bg-[#CCFBF1] text-[#115E59]",
  "border-[#0F766E]/30 bg-[#0F766E] text-white",
];

interface ProjectFunnelProps {
  steps: DashboardFunnelStep[];
}

function PipelineCard({
  step,
  colorClass,
}: {
  step: DashboardFunnelStep;
  colorClass: string;
}) {
  const isDark = colorClass.includes("text-white");

  return (
    <div
      className={cn(
        "flex min-w-[120px] flex-1 flex-col items-center justify-center rounded-2xl border px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm",
        colorClass
      )}
    >
      <p className={cn("text-xs font-medium", isDark ? "text-teal-50" : "opacity-80")}>
        {step.label}
      </p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{step.count}</p>
      <p className={cn("mt-1 text-xs", isDark ? "text-teal-100" : "opacity-70")}>
        {step.percent}%
      </p>
    </div>
  );
}

export function ProjectFunnel({ steps }: ProjectFunnelProps) {
  return (
    <DashboardCard title="프로젝트 진행 현황" subtitle="CRM Pipeline" hover={false}>
      <div className="hidden items-stretch gap-2 lg:flex">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-1 items-center gap-2">
            <PipelineCard step={step} colorClass={STEP_COLORS[index] ?? STEP_COLORS[0]} />
            {index < steps.length - 1 ? (
              <span className="shrink-0 text-muted-foreground/50">→</span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 lg:hidden">
        {steps.map((step, index) => (
          <div key={step.label} className="flex w-full flex-col items-center gap-2">
            <PipelineCard
              step={step}
              colorClass={cn("w-full", STEP_COLORS[index] ?? STEP_COLORS[0])}
            />
            {index < steps.length - 1 ? (
              <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
            ) : null}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
