"use client";

import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioProject } from "@/types/portfolio";
import { PORTFOLIO_CATEGORY_BADGE } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ProjectInfoProps {
  project: PortfolioProject;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="flex flex-col justify-center">
      <Badge
        variant="outline"
        className={cn(
          "mb-5 w-fit border-0",
          PORTFOLIO_CATEGORY_BADGE[project.category]
        )}
      >
        {project.category}
      </Badge>

      <h2 className="text-section-title">{project.title}</h2>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">제작기간</span>
        <span className="mx-2 text-border">·</span>
        {project.duration}
      </p>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-foreground">기술 스택</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-xs font-normal text-muted-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-foreground">주요 기능</p>
        <ul className="space-y-2.5">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/80">
              <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button asChild size="lg" className="group/btn mt-10 w-fit">
        <a
          href={project.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} 사이트 방문`}
        >
          사이트 방문
          <ExternalLink className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </a>
      </Button>
    </div>
  );
}
