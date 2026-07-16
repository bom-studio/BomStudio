"use client";

import { MapPin, Wifi } from "lucide-react";
import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { HoverCard } from "@/components/common/HoverCard";
import { TRUST_ITEMS } from "@/constants/trust";

const COVERAGE_NOTES = [
  {
    icon: MapPin,
    text: "김포 · 일산은 방문상담이 가능합니다.",
  },
  {
    icon: Wifi,
    text: "전국 어디서나 온라인으로 제작 가능합니다.",
  },
] as const;

export function TrustSection() {
  return (
    <AnimatedSection className="section-padding section-alt">
      <div className="container-max">
        <SectionHeader
          label="About"
          title="처음 시작하는 브랜드를 위한 웹 제작"
          description="작지만 꼼꼼하게, 필요한 것만 담아 만듭니다"
        />

        <div className="mx-auto mb-12 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-8">
          {COVERAGE_NOTES.map(({ icon: Icon, text }) => (
            <p
              key={text}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              {text}
            </p>
          ))}
        </div>

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
