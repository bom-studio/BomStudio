"use client";

import { motion } from "framer-motion";
import { transition } from "@/lib/motion";

export function PortfolioHero() {
  return (
    <section className="gradient-hero border-b border-border pt-24 pb-20 sm:pt-28 sm:pb-24">
      <div className="container-max px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.normal, delay: 0.05 }}
          className="text-label mb-4"
        >
          Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.normal, delay: 0.1 }}
          className="text-section-title max-w-3xl"
        >
          직접 제작한 웹사이트를
          <br className="hidden sm:block" />
          하나씩 살펴보세요.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.normal, delay: 0.15 }}
          className="mt-5 max-w-2xl text-body-lg text-muted-foreground"
        >
          기획부터 디자인, 개발, 배포까지 완료한 프로젝트입니다.
          실제 운영 중인 사이트를 직접 확인해 보세요.
        </motion.p>
      </div>
    </section>
  );
}
