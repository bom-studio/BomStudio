import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn("flex min-w-[120px] items-center gap-2", className)}>
      {showLabel ? (
        <span className="w-10 shrink-0 text-right text-xs font-medium text-gray-700">
          {clamped}%
        </span>
      ) : null}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
