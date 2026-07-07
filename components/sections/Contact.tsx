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

export function Contact() {
  return (
    <AnimatedSection id="contact" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="Contact"
          title="문의하기"
          description="편하신 방법으로 연락해 주세요"
        />

        <StaggerContainer className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {CONTACT_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const content = (
              <HoverCard className="h-full">
                <div className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mb-1 font-semibold">{item.type}</h3>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </HoverCard>
            );

            return (
              <StaggerItem key={item.type}>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
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
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition.normal}
          className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Clock className="h-4 w-4" />
          <span>상담 가능 시간: {BUSINESS_HOURS}</span>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
