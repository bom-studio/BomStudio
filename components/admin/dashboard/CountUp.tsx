"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function CountUp({
  value,
  duration = 900,
  formatter = (v) => String(v),
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return <span className={className}>{formatter(display)}</span>;
}
