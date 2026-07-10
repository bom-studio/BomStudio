import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hover?: boolean;
  headerRight?: React.ReactNode;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className,
  contentClassName,
  hover = true,
  headerRight,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border/40 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6",
        hover && "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {title ? (
        <div className={cn("mb-4", headerRight && "flex items-start justify-between gap-4")}>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {headerRight}
        </div>
      ) : null}
      <div className={cn("min-h-0 flex-1", contentClassName)}>{children}</div>
    </section>
  );
}

interface ProgressBarProps {
  percent: number;
  className?: string;
  barClassName?: string;
}

export function DashboardProgressBar({
  percent,
  className,
  barClassName,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted/70", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-[#0F766E] transition-all duration-700 ease-out",
          barClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
