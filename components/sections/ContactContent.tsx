"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { HoverCard } from "@/components/common/HoverCard";
import { BUSINESS_HOURS, CONTACT_ITEMS } from "@/constants/contact";
import { transition } from "@/lib/motion";

const ICON_MAP: Record<string, LucideIcon> = {
  MessageCircle,
  Phone,
  Mail,
};

interface ContactContentProps {
  showHeader?: boolean;
}

export function ContactContent({ showHeader = true }: ContactContentProps) {
  return (
    <AnimatedSection className="section-padding">
      <div className="container-max">
        {showHeader && (
          <SectionHeader
            label="Contact"
            title="홈페이지가 필요하다면 편하게 문의해주세요"
            description="아직 구체적인 기획이 없어도 괜찮습니다. 원하는 분위기, 참고 사이트, 필요한 기능을 함께 정리해드립니다."
          />
        )}

        <StaggerContainer className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {CONTACT_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const content = (
              <HoverCard className="h-full">
                <div className="flex flex-col items-center p-8 text-center">
                  {Icon && (
                    <Icon className="mb-4 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  )}
                  <h3 className="mb-1 font-semibold">{item.type}</h3>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </HoverCard>
            );

            return (
              <StaggerItem key={item.type}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors hover:text-primary"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition.normal}
          className="mx-auto mt-12 flex max-w-md items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          {BUSINESS_HOURS}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
