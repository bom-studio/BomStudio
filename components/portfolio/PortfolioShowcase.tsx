"use client";

import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import type { PortfolioProject } from "@/types/portfolio";

interface PortfolioShowcaseProps {
  projects: PortfolioProject[];
}

export function PortfolioShowcase({ projects }: PortfolioShowcaseProps) {
  return (
    <div className="divide-y divide-border/40">
      {projects.map((project, index) => (
        <PortfolioSection key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
