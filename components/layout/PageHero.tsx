"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PageHeroVariant } from "@/constants/page-meta";
import { PAGE_META } from "@/constants/page-meta";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const heroTransition = { duration: 0.5, ease: EASE_OUT };

const BREADCRUMB_LABEL: Record<PageHeroVariant, string> = {
  services: "Service",
  portfolio: "Portfolio",
  pricing: "Price",
  process: "Process",
  estimate: "Estimate",
  faq: "FAQ",
  contact: "Contact",
};

interface PageHeroProps {
  variant: PageHeroVariant;
  label?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function PageHero({ variant, label, title, description, className }: PageHeroProps) {
  const meta = PAGE_META[variant];
  const resolvedLabel = label ?? meta.label;
  const resolvedTitle = title ?? meta.title;
  const resolvedDescription = description ?? meta.description;
  const titleLines = resolvedTitle.split("\n").filter(Boolean);

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border pt-16",
        className
      )}
      style={{ background: "#FCFCF8" }}
    >
      <div
        className="pointer-events-none absolute -top-24 right-[12%] h-56 w-56 rounded-full bg-primary/[0.04] blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[960px] px-8 pt-14 pb-20 sm:pt-16 sm:pb-24 lg:min-h-[320px] lg:pt-20 lg:pb-[100px]">
        <div className="max-w-[600px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroTransition, delay: 0.05 }}
            className="text-[12px] font-medium tracking-[0.22em] text-muted-foreground uppercase sm:text-[13px]"
          >
            {resolvedLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroTransition, delay: 0.1 }}
            className="mt-4 text-[36px] font-bold leading-[1.2] tracking-tight text-foreground sm:text-[48px] lg:text-[52px]"
          >
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </motion.h1>

          {resolvedDescription ? (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...heroTransition, delay: 0.15 }}
              className="mt-5 max-w-[560px] text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {resolvedDescription}
            </motion.p>
          ) : null}

          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroTransition, delay: 0.2 }}
            aria-label="breadcrumb"
            className="mt-8"
          >
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors duration-300 hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </li>
              <li className="font-medium text-foreground" aria-current="page">
                {BREADCRUMB_LABEL[variant]}
              </li>
            </ol>
          </motion.nav>
        </div>
      </div>
    </section>
  );
}
