"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/brand";
import { HeroFeatureCards } from "@/components/sections/HeroFeatureCards";
import { HeroShowcase } from "@/components/sections/HeroShowcase";
import { textLine, textStagger, transition } from "@/lib/motion";

const titleLines = ["브랜드의 시작,", "웹에서 완성합니다."];

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
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {BRAND.name}
              </span>
            </motion.div>

            <motion.h1
              variants={textStagger}
              initial="hidden"
              animate="visible"
              className="text-hero mt-7"
            >
              {titleLines.map((line) => (
                <motion.span key={line} variants={textLine} className="block">
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.normal, delay: 0.25 }}
              className="mt-6 max-w-md text-body-lg text-muted-foreground"
            >
              브랜드를 소개하는 홈페이지부터 예약 시스템, 관리자 페이지, 맞춤형 웹서비스까지.
              <br />
              기획부터 디자인, 개발, 배포까지 한 번에 제공합니다.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.normal, delay: 0.35 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="group">
                <Link href="/portfolio">
                  실제 제작 사례 보기
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">무료 상담하기</Link>
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
