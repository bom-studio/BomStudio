"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/brand";
import { HeroFeatureCards } from "@/components/sections/HeroFeatureCards";
import { HeroShowcase } from "@/components/sections/HeroShowcase";
import { textLine, textStagger, transition } from "@/lib/motion";

const TRUST_BADGES = [
  "반응형 제작",
  "SEO 기본 적용",
  "관리자 페이지 지원",
  "유지보수 가능",
  "평균 제작기간 2~4주",
];

export function Hero() {
  return (
    <section id="home" className="hero-surface relative overflow-hidden pt-16">
      {/* 배경 데코레이션 */}
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 right-[8%] h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[40%] right-[-6%] h-[360px] w-[360px] rounded-full bg-accent/[0.07] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="hero-dots pointer-events-none absolute bottom-[22%] left-[4%] hidden h-24 w-40 opacity-40 lg:block"
        aria-hidden="true"
      />

      <div className="container-max relative flex min-h-[calc(100vh-4rem)] flex-col justify-center px-8 pt-20 pb-12 lg:min-h-[940px]">
        <div className="grid items-center gap-16 lg:grid-cols-[45fr_55fr] lg:gap-12">
          {/* 좌측 — 텍스트 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.normal, delay: 0.05 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-white px-4 py-1.5"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" strokeWidth={1.75} />
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                {BRAND.heroBadge}
              </span>
            </motion.div>

            <motion.h1
              variants={textStagger}
              initial="hidden"
              animate="visible"
              className="text-hero mt-7"
            >
              <motion.span variants={textLine} className="block">
                {BRAND.heroTitle}
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.normal, delay: 0.25 }}
              className="mt-6 max-w-lg space-y-1 text-body-lg text-muted-foreground"
            >
              {BRAND.heroDescription.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.normal, delay: 0.35 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="group">
                <Link href="/portfolio">
                  포트폴리오 보기
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">무료 상담 신청</Link>
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.normal, delay: 0.45 }}
              className="mt-9 flex flex-wrap gap-x-5 gap-y-2.5"
            >
              {TRUST_BADGES.map((badge) => (
                <li key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {badge}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* 우측 — 실제 제작 홈페이지 쇼케이스 */}
          <div className="py-6 sm:py-12">
            <HeroShowcase />
          </div>
        </div>

        <HeroFeatureCards />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 flex justify-center"
          aria-hidden="true"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-muted-foreground/70"
          >
            <span className="text-[11px] font-medium tracking-widest uppercase">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
