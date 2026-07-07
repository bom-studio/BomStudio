import { PROCESS_STEPS } from "@/constants/process";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";
import { cn } from "@/lib/utils";

export function ProcessHeroVisual() {
  const steps = PROCESS_STEPS.slice(0, 5);

  return (
    <VisualShell>
      <VisualDot className="top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2">
        {/* 타임라인 연결선 */}
        <div className="absolute top-5 right-8 left-8 h-px bg-primary/20" />

        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.step} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold",
                  index === 2
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border-primary/30 bg-white text-primary"
                )}
              >
                {step.step}
              </div>
              <p className="mt-2 max-w-[52px] text-center text-[9px] font-semibold leading-tight">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 플로우 카드 */}
      <VisualCard className="absolute right-4 bottom-4 left-4 hidden p-3 sm:block sm:left-8 sm:w-auto">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center gap-1">
              <span className="font-medium text-primary">{step.title}</span>
              {index < steps.length - 1 ? (
                <span className="text-border">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </VisualCard>

      {/* 원형 플로우 장식 */}
      <svg
        className="absolute top-6 right-6 h-16 w-16 text-primary/10"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M32 8 L32 32 L48 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </VisualShell>
  );
}
