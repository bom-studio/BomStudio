"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/brand";
import { textLine, textStagger, transition } from "@/lib/motion";

const titleLines = ["브랜드의 시작,", "웹에서 완성합니다."];

export function Hero() {
  return (
    <section id="home" className="gradient-hero relative pt-16">
      <div className="container-max flex min-h-[calc(100vh-4rem)] flex-col justify-center px-8 py-24 lg:py-32">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.normal, delay: 0.05 }}
          className="text-label mb-6"
        >
          {BRAND.name}
        </motion.p>

        <motion.h1
          variants={textStagger}
          initial="hidden"
          animate="visible"
          className="text-hero max-w-4xl"
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
          className="mt-6 max-w-xl text-body-lg text-muted-foreground"
        >
          {BRAND.slogan}
          <br />
          작은 브랜드와 1인 사업자를 위한 홈페이지, 랜딩페이지, 웹서비스를 기획하고 제작합니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.normal, delay: 0.35 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group">
            <Link href="/portfolio">
              실제 제작 사례 보기
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">문의하기</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
