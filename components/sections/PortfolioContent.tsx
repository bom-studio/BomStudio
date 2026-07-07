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
              title="결과로 증명하는 웹사이트."
              description="기획부터 디자인, 개발, 배포까지. 브랜드의 가치를 담은 웹사이트를 직접 설계하고 제작합니다."
            />
          </div>
        </AnimatedSection>
      )}
      <PortfolioShowcase projects={projects} />
    </>
  );
}
