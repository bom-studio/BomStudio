"use client";

import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { HoverCard } from "@/components/common/HoverCard";
import { TRUST_ITEMS } from "@/constants/trust";

export function TrustSection() {
  return (
    <AnimatedSection className="section-padding section-alt">
      <div className="container-max">
        <SectionHeader
          label="About"
          title="처음 시작하는 브랜드를 위한 웹 제작"
          description="작지만 꼼꼼하게, 필요한 것만 담아 만듭니다"
        />

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <StaggerItem key={item.title}>
              <HoverCard className="h-full cursor-default">
                <div className="p-8">
                  <h3 className="text-card-title mb-3 text-xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
