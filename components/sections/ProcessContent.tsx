"use client";

import { motion } from "framer-motion";
import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { SectionLink } from "@/components/common/SectionLink";
import { PROCESS_STEPS } from "@/constants/process";
import { transition } from "@/lib/motion";

interface ProcessContentProps {
  compact?: boolean;
  showHeader?: boolean;
  showViewAll?: boolean;
}

export function ProcessContent({
  compact = false,
  showHeader = true,
  showViewAll = false,
}: ProcessContentProps) {
  const steps = compact ? PROCESS_STEPS : PROCESS_STEPS;

  return (
    <AnimatedSection className="section-padding section-alt">
      <div className="container-max">
        {showHeader && (
          <SectionHeader
            label="Process"
            title="제작 과정"
            description={
              compact
                ? "상담부터 배포까지 체계적으로 진행합니다"
                : "6단계 프로세스로 완성도 높은 결과물을 제공합니다"
            }
          />
        )}

        <StaggerContainer className="mx-auto max-w-xl">
          {steps.map((step, index) => (
            <StaggerItem key={step.step}>
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...transition.normal, delay: index * 0.05 }}
                  className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm"
                >
                  <span className="text-sm font-semibold text-muted-foreground">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>

                {index < steps.length - 1 && (
                  <div className="flex flex-col items-center py-4" aria-hidden="true">
                    <div className="h-8 w-px bg-border" />
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {showViewAll && <SectionLink href="/process" label="전체 제작 과정 보기" />}
      </div>
    </AnimatedSection>
  );
}
