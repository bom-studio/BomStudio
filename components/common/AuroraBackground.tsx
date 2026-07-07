"use client";

import { motion } from "framer-motion";

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="noise-texture absolute inset-0 opacity-[0.35]" />

      <motion.div
        className="aurora-blob absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora-blob absolute top-1/3 -right-1/4 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[90px]"
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="aurora-blob absolute -bottom-1/4 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[80px]"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <FloatingShape className="left-[8%] top-[20%]" size={6} delay={0} />
      <FloatingShape className="right-[12%] top-[30%]" size={4} delay={1.5} />
      <FloatingShape className="left-[15%] bottom-[25%]" size={5} delay={0.8} />
      <FloatingShape className="right-[20%] bottom-[20%]" size={3} delay={2.2} />
    </div>
  );
}

function FloatingShape({
  className,
  size,
  delay,
}: {
  className: string;
  size: number;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full bg-primary/20 ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
