"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { Button } from "@/components/ui/button";
import { CTA_ESTIMATE } from "@/constants/navigation";
import { transition } from "@/lib/motion";

export function EstimateCTA() {
  return (
    <AnimatedSection className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition.normal}
          className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm sm:p-16"
        >
          <p className="text-label mb-4">Contact</p>
          <h2 className="text-section-title">홈페이지가 필요하다면 편하게 문의해주세요</h2>
          <p className="mx-auto mt-4 max-w-lg text-body-lg text-muted-foreground">
            아직 구체적인 기획이 없어도 괜찮습니다.
            원하는 분위기와 필요한 기능을 함께 정리해드립니다.
          </p>
          <Button asChild size="lg" className="group mt-8">
            <Link href={CTA_ESTIMATE.href}>
              {CTA_ESTIMATE.label}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
