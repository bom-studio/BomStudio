"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Timer, MonitorSmartphone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

interface HeroBrowserProps {
  image?: string;
  alt: string;
  url: string;
  /** 브라우저 본문 높이(px) — 자동 스크롤 거리 계산에 사용 */
  viewport: number;
  size: "lg" | "sm";
  className?: string;
  priority?: boolean;
}

/** 스크린샷이 없을 때 보여줄 웹사이트 와이어프레임 */
function WireframePlaceholder({ size }: { size: "lg" | "sm" }) {
  const pad = size === "lg" ? "p-5" : "p-3";
  return (
    <div className={cn("flex h-full flex-col gap-3 bg-white", pad)} aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-14 rounded-full bg-primary/70" />
        <div className="flex gap-2">
          <div className="h-2 w-8 rounded-full bg-gray-200" />
          <div className="h-2 w-8 rounded-full bg-gray-200" />
          <div className="h-2 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="rounded-lg bg-section px-4 py-5">
        <div className="h-3 w-3/5 rounded-full bg-gray-300" />
        <div className="mt-2 h-3 w-2/5 rounded-full bg-gray-200" />
        <div className="mt-3 h-5 w-20 rounded-md bg-primary/80" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="rounded-lg bg-section" />
        <div className="rounded-lg bg-section" />
        <div className="rounded-lg bg-section" />
      </div>
      <div className="h-8 rounded-lg bg-gray-100" />
    </div>
  );
}

function HeroBrowser({
  image,
  alt,
  url,
  viewport,
  size,
  className,
  priority = false,
}: HeroBrowserProps) {
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !image || hasError;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-border/80 bg-white",
        "shadow-[0_16px_48px_rgba(15,23,42,0.10)] transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-[0_24px_64px_rgba(15,23,42,0.16)]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border/70 bg-[#FAFAFA]",
          size === "lg" ? "h-10 px-3.5" : "h-8 px-2.5"
        )}
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className={cn("rounded-full bg-[#FF5F57]", size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
          <span className={cn("rounded-full bg-[#FFBD2E]", size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
          <span className={cn("rounded-full bg-[#28CA42]", size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
        </div>
        <div className="flex flex-1 justify-center">
          <span
            className={cn(
              "truncate rounded-md border border-border/60 bg-white text-muted-foreground",
              size === "lg" ? "max-w-[240px] px-4 py-1 text-[11px]" : "max-w-[140px] px-3 py-0.5 text-[10px]"
            )}
          >
            {url}
          </span>
        </div>
        <div className={size === "lg" ? "w-[46px]" : "w-[34px]"} aria-hidden="true" />
      </div>

      <div className="relative overflow-hidden" style={{ height: viewport }}>
        {showPlaceholder ? (
          <WireframePlaceholder size={size} />
        ) : (
          <div
            className="hero-autoscroll"
            style={{ "--hero-viewport": `${viewport}px` } as React.CSSProperties}
          >
            <Image
              src={image}
              alt={alt}
              width={1440}
              height={3200}
              className="h-auto w-full"
              sizes={size === "lg" ? "(max-width: 1024px) 90vw, 480px" : "260px"}
              priority={priority}
              loading={priority ? undefined : "lazy"}
              onError={() => setHasError(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface FloatingCardProps {
  className?: string;
  delay: number;
  children: React.ReactNode;
}

function FloatingCard({ className, delay, children }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
      className={cn(
        "absolute z-20 flex items-center gap-3 rounded-2xl border border-border/70 bg-white/95 px-4 py-3",
        "shadow-[0_8px_28px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
      {/* 좌측 상단 — 작은 브라우저 (뒤) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
        className="absolute -top-8 left-0 z-0 hidden w-[42%] sm:block lg:-left-4"
      >
        <HeroBrowser
          image="/images/portfolio/aone-long.webp"
          alt="A-One 수학학원 홈페이지 미리보기"
          url="a-one-academy.vercel.app"
          viewport={190}
          size="sm"
        />
      </motion.div>

      {/* 가운데 — 큰 브라우저 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
        className="relative z-10 mx-auto w-full sm:w-[78%]"
      >
        <HeroBrowser
          image="/images/portfolio/sajangman-long.webp"
          alt="사장만 웹서비스 미리보기"
          url="sajangman.vercel.app"
          viewport={420}
          size="lg"
          priority
        />
      </motion.div>

      {/* 우측 하단 — 작은 브라우저 (앞) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
        className="absolute -bottom-10 right-0 z-20 hidden w-[42%] sm:block lg:-right-4"
      >
        <HeroBrowser
          image="/images/portfolio/mukhyang-long.webp"
          alt="묵향인쇄 홈페이지 미리보기"
          url="mukhyang-print.vercel.app"
          viewport={190}
          size="sm"
        />
      </motion.div>

      {/* Floating Cards */}
      <FloatingCard delay={0.6} className="-left-3 bottom-16 hidden xl:flex">
        <div className="flex gap-0.5 text-accent" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">100%</p>
          <p className="text-xs text-muted-foreground">고객 만족</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.7} className="-right-2 top-16 hidden xl:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Timer className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">2~4주</p>
          <p className="text-xs text-muted-foreground">평균 제작기간</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.8} className="bottom-2 right-[24%] hidden xl:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MonitorSmartphone className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Responsive</p>
          <p className="text-xs text-muted-foreground">PC / Tablet / Mobile</p>
        </div>
      </FloatingCard>
    </div>
  );
}
