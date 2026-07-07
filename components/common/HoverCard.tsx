"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { hoverLift } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}

export function HoverCard({ children, className, as = "div" }: HoverCardProps) {
  const Component = motion[as];

  return (
    <Component
      whileHover={hoverLift}
      transition={hoverLift.transition}
      className={cn("premium-card", className)}
    >
      {children}
    </Component>
  );
}
