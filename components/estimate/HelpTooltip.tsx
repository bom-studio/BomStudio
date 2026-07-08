"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: string;
}

export function HelpTooltip({ content }: HelpTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 text-primary",
          "transition-colors hover:bg-primary/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        )}
        aria-label="기능 설명 보기"
        aria-expanded={open}
      >
        <HelpCircle className="h-3 w-3" />
      </button>

      {open ? (
        <span
          role="tooltip"
          className={cn(
            "absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2",
            "rounded-xl border border-border bg-white px-3 py-2.5 text-xs leading-relaxed text-muted-foreground shadow-lg"
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
