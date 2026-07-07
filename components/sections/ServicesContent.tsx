"use client";

import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { HoverCard } from "@/components/common/HoverCard";
import { SectionLink } from "@/components/common/SectionLink";
import { SERVICES } from "@/constants/services";

interface ServicesContentProps {
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
}

export function ServicesContent({
  limit,
  showHeader = true,
  showViewAll = false,
}: ServicesContentProps) {
  const items = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <AnimatedSection className="section-padding">
      <div className="container-max">
        {showHeader && (
          <SectionHeader
            label="Services"
            title="제공 서비스"
            description="소규모 사업자와 1인 브랜드를 위한 실용적인 웹 제작"
          />
        )}

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <StaggerItem key={service.title}>
              <HoverCard className="h-full cursor-default">
                <div className="p-8">
                  <h3 className="text-card-title mb-3 text-xl">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {showViewAll && <SectionLink href="/services" label="전체 서비스 보기" />}
      </div>
    </AnimatedSection>
  );
}
