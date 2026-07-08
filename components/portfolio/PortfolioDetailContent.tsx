"use client";

import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { PortfolioBrowserPreview } from "@/components/portfolio/PortfolioBrowserPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioProject } from "@/types/portfolio";
import {
  getPortfolioCategoryLabel,
  PORTFOLIO_CATEGORY_BADGE,
} from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioDetailContentProps {
  project: PortfolioProject;
}

export function PortfolioDetailContent({ project }: PortfolioDetailContentProps) {
  return (
    <>
      <section className="hero-surface relative overflow-hidden border-b border-border pt-24 pb-12 sm:pt-28">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-max relative px-8">
          <Badge
            variant="outline"
            className={cn("mb-4 border-0", PORTFOLIO_CATEGORY_BADGE[project.category])}
          >
            {getPortfolioCategoryLabel(project.category)}
          </Badge>
          {project.status ? (
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {project.status}
            </p>
          ) : null}
          <h1 className="text-section-title">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
            {project.tagline}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max px-8">
          <div className="mb-12">
            <PortfolioBrowserPreview
              previewImage={project.previewImage}
              siteUrl={project.siteUrl}
              title={project.title}
              priority
            />
          </div>

          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">제작기간</span>
              <span className="mx-2 text-border">·</span>
              {project.duration}
            </p>

            <div>
              <h2 className="text-xl font-semibold">주요 기능</h2>
              <ul className="mt-4 space-y-2">
                {project.features.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold">사용 기술</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a
                  href={project.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} 사이트 방문`}
                >
                  사이트 방문
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              {project.githubUrl ? (
                <Button asChild variant="secondary" size="lg">
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
              <Button asChild variant="ghost" size="lg" className="sm:ml-auto">
                <Link href="/portfolio">
                  <ArrowLeft className="h-4 w-4" />
                  포트폴리오 목록
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
