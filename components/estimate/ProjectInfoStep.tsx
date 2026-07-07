"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SCHEDULE_OPTIONS } from "@/constants/estimate";
import { formatBudget } from "@/lib/format/budget";
import { cn } from "@/lib/utils";

interface ProjectInfoStepProps {
  budget: string;
  schedule: string;
  onBudgetChange: (value: string) => void;
  onScheduleChange: (value: string) => void;
}

export function ProjectInfoStep({
  budget,
  schedule,
  onBudgetChange,
  onScheduleChange,
}: ProjectInfoStepProps) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="budget">예산</Label>
        <Input
          id="budget"
          inputMode="numeric"
          placeholder="예: 1,000,000원"
          value={budget}
          onChange={(event) => onBudgetChange(formatBudget(event.target.value))}
          aria-describedby="budget-hint"
        />
        <p id="budget-hint" className="text-xs text-muted-foreground">
          숫자만 입력하면 자동으로 금액 형식으로 표시됩니다.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">희망 일정</Label>
        <div className="relative">
          <select
            id="schedule"
            value={schedule}
            onChange={(event) => onScheduleChange(event.target.value)}
            className={cn(
              "flex h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 py-2 pr-10 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !schedule && "text-muted-foreground"
            )}
          >
            <option value="" disabled>
              일정을 선택해 주세요
            </option>
            {SCHEDULE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
