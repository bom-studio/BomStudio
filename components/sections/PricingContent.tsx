"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { HoverCard } from "@/components/common/HoverCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EXTRA_COSTS, PRICING_NOTICE } from "@/constants/pricing-extra";
import { PRICING_INTRO, PRICING_PLANS } from "@/constants/pricing";

interface PricingContentProps {
  showHeader?: boolean;
  showExtraCosts?: boolean;
}

export function PricingContent({
  showHeader = true,
  showExtraCosts = false,
}: PricingContentProps) {
  return (
    <AnimatedSection className="section-padding section-alt" variant="subtle">
      <div className="container-max">
        {showHeader && (
          <SectionHeader
            label="Pricing"
            title="예산에 맞는 제작 플랜"
            description="처음 시작하는 분들도 부담 없는 범위에서 상담해 드립니다"
          />
        )}

        <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          {PRICING_INTRO}
        </p>

        <StaggerContainer className="grid gap-8 lg:grid-cols-3" stagger={0.1}>
          {PRICING_PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <HoverCard
                className={`relative h-full ${
                  plan.recommended ? "border-foreground/20 shadow-md" : ""
                }`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    추천
                  </Badge>
                )}
                <div className="p-8 text-center">
                  <h3 className="text-card-title">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  {plan.eventLabel && (
                    <p className="mt-3 text-xs font-medium text-muted-foreground">
                      {plan.eventLabel}
                    </p>
                  )}
                  <p className="mt-2 text-3xl font-bold text-foreground">{plan.price}</p>
                </div>
                <div className="px-8 pb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.recommended ? "default" : "secondary"}
                    className="mt-8 w-full"
                  >
                    <Link href="/estimate">견적 문의</Link>
                  </Button>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground">
          {PRICING_NOTICE}
        </p>

        {showExtraCosts && (
          <div className="mt-16">
            <h3 className="mb-6 text-center text-xl font-semibold">별도 비용 안내</h3>
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              {EXTRA_COSTS.map((item) => (
                <div key={item.title} className="premium-card p-6">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
