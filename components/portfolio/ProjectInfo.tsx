"use client";

import { Check, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioProject } from "@/types/portfolio";
import {
  getPortfolioCategoryLabel,
  PORTFOLIO_CATEGORY_BADGE,
} from "@/types/portfolio";
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
        {getPortfolioCategoryLabel(project.category)}
      </Badge>

      {project.status ? (
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {project.status}
        </p>
      ) : null}

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

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="group/btn w-fit">
          <a
            href={project.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} 사이트 보기`}
          >
            사이트 보기
            <ExternalLink className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </a>
        </Button>
        {project.githubUrl ? (
          <Button asChild variant="secondary" size="lg" className="w-fit">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub 저장소`}
            >
              GitHub
              <GithubIcon />
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
