"use client";

import {
  AnimatedSection,
  SectionHeader,
} from "@/components/common/AnimatedSection";
import { PortfolioShowcase } from "@/components/portfolio/PortfolioShowcase";
import type { PortfolioProject } from "@/types/portfolio";

interface PortfolioContentProps {
  projects: PortfolioProject[];
  showHeader?: boolean;
}

export function PortfolioContent({
  projects,
  showHeader = true,
}: PortfolioContentProps) {
  return (
    <>
      {showHeader && (
        <AnimatedSection className="section-padding pb-0">
          <div className="container-max">
            <SectionHeader
              label="Portfolio"
              title="직접 제작한 프로젝트"
              description="실제 운영 중인 웹사이트를 하나씩 살펴보세요"
            />
          </div>
        </AnimatedSection>
      )}
      <PortfolioShowcase projects={projects} />
    </>
  );
}
