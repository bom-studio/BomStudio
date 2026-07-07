"use client";

import {
  AnimatedSection,
  SectionHeader,
} from "@/components/common/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/constants/faq";

interface FAQContentProps {
  showHeader?: boolean;
}

export function FAQContent({ showHeader = true }: FAQContentProps) {
  return (
    <AnimatedSection className="section-padding section-alt">
      <div className="container-max">
        {showHeader && (
          <SectionHeader
            label="FAQ"
            title="자주 묻는 질문"
            description="궁금하신 점을 빠르게 확인해 보세요"
          />
        )}

        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 shadow-sm"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
}
