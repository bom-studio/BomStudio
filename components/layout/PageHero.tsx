"use client";

import { motion } from "framer-motion";
import { PageHeroVisual } from "@/components/layout/PageHeroVisual";
import type { PageHeroVariant } from "@/constants/page-meta";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const heroTransition = { duration: 0.7, ease: EASE_OUT };

interface PageHeroProps {
  variant: PageHeroVariant;
  label?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function PageHero({ variant, label, title, description, className }: PageHeroProps) {
  const titleLines = (title ?? "").split("\n").filter(Boolean);

  return (
    <section
      className={cn(
        "hero-surface relative overflow-hidden border-b border-border pt-20 pb-10 sm:pt-24 sm:pb-12",
        className
      )}
    >
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute top-0 right-[10%] h-64 w-64 rounded-full bg-primary/[0.05] blur-[100px]"
        aria-hidden="true"
      />

      <div className="container-max relative px-8">
        <div className="grid min-h-[300px] items-center gap-10 lg:min-h-[360px] lg:grid-cols-[45fr_55fr] lg:gap-12">
          <div>
            {label ? (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...heroTransition, delay: 0.05 }}
                className="text-label mb-4"
              >
                {label}
              </motion.p>
            ) : null}

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...heroTransition, delay: 0.1 }}
              className="text-section-title"
            >
              {titleLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </motion.h1>

            {description ? (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...heroTransition, delay: 0.15 }}
                className="mt-5 max-w-lg text-body-lg text-muted-foreground"
              >
                {description}
              </motion.p>
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...heroTransition, delay: 0.2 }}
            className="flex justify-center py-4 lg:justify-end lg:py-0"
            aria-hidden="true"
          >
            <PageHeroVisual variant={variant} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
