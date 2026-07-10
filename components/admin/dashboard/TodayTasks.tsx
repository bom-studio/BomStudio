import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import type { DashboardTask } from "@/types/admin-dashboard";
import { cn } from "@/lib/utils";

interface TodayTasksProps {
  tasks: DashboardTask[];
}

export function TodayTasks({ tasks }: TodayTasksProps) {
  return (
    <DashboardCard title="오늘 해야 할 일" hover={false} className="min-h-[360px]">
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={task.href}
            className={cn(
              "group flex items-center justify-between rounded-xl border px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm",
              task.accentClass
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{task.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{task.label}</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{task.count}건</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
