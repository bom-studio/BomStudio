import { cn } from "@/lib/utils";

interface VisualShellProps {
  children: React.ReactNode;
  className?: string;
}

export function VisualShell({ children, className }: VisualShellProps) {
  return (
    <div
      className={cn(
        "relative mx-auto h-[240px] w-full max-w-[400px] sm:h-[280px]",
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

interface VisualCardProps {
  children: React.ReactNode;
  className?: string;
}

export function VisualCard({ children, className }: VisualCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function VisualDot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-full bg-primary/10 blur-2xl",
        className
      )}
    />
  );
}
