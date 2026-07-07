"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioCategory, PortfolioProject } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const PLACEHOLDER_GRADIENTS: Record<PortfolioCategory, string> = {
  Education: "from-emerald-600/15 via-emerald-500/5 to-slate-900/10",
  Corporate: "from-slate-600/15 via-slate-500/5 to-slate-900/10",
  SaaS: "from-violet-600/15 via-violet-500/5 to-slate-900/10",
};

interface MacbookMockupProps {
  project: PortfolioProject;
  priority?: boolean;
}

export function MacbookMockup({ project, priority = false }: MacbookMockupProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group/mockup relative mx-auto w-full max-w-2xl">
      <div
        className="absolute right-4 top-0 z-20 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm"
        aria-label="실제 운영 중인 사이트"
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        LIVE
      </div>

      <div className="transition-all duration-300 group-hover/mockup:scale-[1.03] group-hover/mockup:shadow-2xl">
        <div className="rounded-t-[1.25rem] border border-neutral-700/80 bg-gradient-to-b from-neutral-700 to-neutral-800 p-2.5 pb-1.5 shadow-xl shadow-black/20 transition-shadow duration-300 group-hover/mockup:shadow-2xl group-hover/mockup:shadow-black/30">
          <div className="mb-2 flex justify-center">
            <div className="h-1 w-16 rounded-full bg-neutral-600/80" aria-hidden="true" />
          </div>

          <div className="relative overflow-hidden rounded-lg border border-neutral-900/50 bg-neutral-950">
            {hasError ? (
              <div
                className={cn(
                  "flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br",
                  PLACEHOLDER_GRADIENTS[project.category]
                )}
                role="img"
                aria-label={project.screenshotAlt}
              >
                <span className="text-lg font-semibold text-foreground/25">
                  {project.title}
                </span>
              </div>
            ) : (
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={project.screenshot}
                  alt={project.screenshotAlt}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover/mockup:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={priority}
                  loading={priority ? undefined : "lazy"}
                  onError={() => setHasError(true)}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className="relative mx-auto h-3 w-[98%] rounded-b-xl bg-gradient-to-b from-neutral-600 to-neutral-700 shadow-inner"
          aria-hidden="true"
        />
        <div
          className="mx-auto mt-1 h-1 w-[38%] rounded-full bg-neutral-500/30"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
