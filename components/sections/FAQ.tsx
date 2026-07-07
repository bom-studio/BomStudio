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

export function FAQ() {
  return (
    <AnimatedSection id="faq" className="section-padding bg-muted/20">
      <div className="container-max">
        <SectionHeader
          label="FAQ"
          title="자주 묻는 질문"
          description="궁금하신 점을 빠르게 확인해 보세요"
        />

        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card px-6"
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
