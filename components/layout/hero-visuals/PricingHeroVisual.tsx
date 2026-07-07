import { Calculator, Check, CircleDollarSign } from "lucide-react";
import { PRICING_PLANS } from "@/constants/pricing";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";
import { cn } from "@/lib/utils";

export function PricingHeroVisual() {
  const plans = PRICING_PLANS.slice(0, 3);

  return (
    <VisualShell>
      <VisualDot className="top-6 right-6 h-28 w-28" />

      {/* Pricing Table */}
      <VisualCard className="absolute top-8 left-0 w-[58%] p-4 sm:left-4">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Pricing
        </p>
        <div className="mt-3 space-y-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex items-center justify-between rounded-lg border px-3 py-2",
                plan.recommended ? "border-primary/30 bg-primary/5" : "border-border bg-section/50"
              )}
            >
              <div>
                <p className="text-xs font-semibold">{plan.name}</p>
                <p className="text-[10px] text-muted-foreground">{plan.description}</p>
              </div>
              <p className="text-sm font-bold text-primary">{plan.price}</p>
            </div>
          ))}
        </div>
      </VisualCard>

      {/* Calculator */}
      <VisualCard className="absolute top-2 right-0 w-[38%] p-3 sm:right-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-semibold">견적 계산</p>
        </div>
        <div className="mt-2 rounded-lg bg-section px-2 py-2 text-right">
          <p className="font-mono text-sm font-bold text-primary">590,000</p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((n) => (
            <div
              key={n}
              className="flex h-5 items-center justify-center rounded bg-section text-[9px] text-muted-foreground"
            >
              {n}
            </div>
          ))}
        </div>
      </VisualCard>

      {/* Coins */}
      <div className="absolute bottom-20 left-6 flex items-end gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5",
              i === 1 && "-mb-2",
              i === 2 && "-mb-4"
            )}
          >
            <CircleDollarSign className="h-4 w-4 text-primary" />
          </div>
        ))}
      </div>

      {/* Checklist */}
      <VisualCard className="absolute right-4 bottom-4 w-[48%] p-3 sm:right-8">
        <p className="text-[10px] font-semibold">포함 항목</p>
        <ul className="mt-2 space-y-1.5">
          {["반응형", "SEO", "관리자", "유지보수"].map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Check className="h-3 w-3 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </VisualCard>
    </VisualShell>
  );
}
