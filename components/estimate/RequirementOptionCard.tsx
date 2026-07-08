"use client";

import { Check } from "lucide-react";
import { HelpTooltip } from "@/components/estimate/HelpTooltip";
import { cn } from "@/lib/utils";

interface RequirementOptionCardProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  tooltip?: string;
}

export function RequirementOptionCard({
  label,
  selected,
  onToggle,
  tooltip,
}: RequirementOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border p-3.5 text-left text-sm transition-all duration-200",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/60 bg-white hover:border-primary/30 hover:bg-muted/30"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-white"
          )}
          aria-hidden="true"
        >
          {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
        </span>
        <span className="font-medium leading-snug">{label}</span>
      </span>

      {tooltip ? <HelpTooltip content={tooltip} /> : null}
    </button>
  );
}
