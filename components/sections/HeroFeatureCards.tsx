"use client";

import { motion } from "framer-motion";
import {
  MonitorSmartphone,
  Rocket,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { fadeUpSubtle, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HeroFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

const HERO_FEATURES: HeroFeature[] = [
  {
    icon: Rocket,
    title: "맞춤 제작",
    description:
      "템플릿을 그대로 사용하는 것이 아닌, 브랜드와 업종에 맞춰 기획부터 개발까지 직접 제작합니다.",
    href: "/services",
  },
  {
    icon: MonitorSmartphone,
    title: "반응형 웹",
    description: "PC, 태블릿, 모바일 등 모든 환경에서 최적화된 화면을 제공합니다.",
    href: "/services",
  },
  {
    icon: Search,
    title: "SEO 기본 적용",
    description: "검색엔진에 잘 노출될 수 있도록 기본적인 SEO 구조를 함께 제공합니다.",
    href: "/services",
  },
  {
    icon: ShieldCheck,
    title: "유지보수 지원",
    description: "홈페이지 오픈 이후에도 안정적인 유지보수와 기능 개선을 지원합니다.",
    href: "/contact",
  },
];

export function HeroFeatureCards() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px", amount: 0.2 }}
      variants={staggerContainer}
      className="mt-20 grid grid-cols-1 gap-5 border-t border-border/70 pt-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4"
    >
      {HERO_FEATURES.map((feature) => {
        const Icon = feature.icon;

        return (
          <motion.div key={feature.title} variants={fadeUpSubtle}>
            <Link
              href={feature.href}
              className={cn(
                "group flex h-full flex-col rounded-[20px] border border-[#E5E7EB] bg-white p-8",
                "shadow-sm transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              )}
            >
              <div
                className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-primary/10"
                aria-hidden="true"
              >
                <Icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
