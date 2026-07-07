"use client";

import { motion } from "framer-motion";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHero({ label, title, description, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "gradient-hero border-b border-border pt-24 pb-16 sm:pt-28 sm:pb-20",
        className
      )}
    >
      <div className="container-max px-8">
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.normal, delay: 0.05 }}
            className="text-label mb-4"
          >
            {label}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.normal, delay: 0.1 }}
          className="text-section-title max-w-3xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.normal, delay: 0.15 }}
            className="mt-4 max-w-2xl text-body-lg text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
