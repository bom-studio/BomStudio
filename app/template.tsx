"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { transition } from "@/lib/motion";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={transition.normal}
    >
      {children}
    </motion.div>
  );
}
