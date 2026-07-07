"use client";

import { useCountUp } from "@/hooks/useCountUp";
import type { StatItem } from "@/types";

interface CountUpProps {
  stat: StatItem;
}

export function CountUp({ stat }: CountUpProps) {
  const { count, ref } = useCountUp({ end: stat.value });

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {count}
        {stat.suffix && (
          <span className="text-primary">{stat.suffix}</span>
        )}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}
