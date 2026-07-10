import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/constants/project-admin";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  대기중: "bg-slate-100 text-slate-700",
  기획: "bg-sky-100 text-sky-700",
  디자인: "bg-indigo-100 text-indigo-700",
  개발: "bg-violet-100 text-violet-700",
  검수: "bg-amber-100 text-amber-800",
  배포: "bg-orange-100 text-orange-700",
  완료: "bg-emerald-100 text-emerald-700",
  보류: "bg-slate-100 text-slate-600",
  취소: "bg-rose-100 text-rose-700",
};

interface ProjectStatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const label = status || "대기중";
  const style =
    label in STATUS_STYLES
      ? STATUS_STYLES[label as ProjectStatus]
      : "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
