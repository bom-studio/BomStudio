"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { transition } from "@/lib/motion";

export function PortfolioCTA() {
  return (
    <section className="section-padding section-alt">
      <div className="container-max px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition.normal}
          className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm sm:p-16"
        >
          <h2 className="text-section-title text-2xl sm:text-3xl">
            프로젝트가 마음에 드셨나요?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-body-lg text-muted-foreground">
            맞춤형 홈페이지 제작을 도와드립니다.
          </p>
          <Button asChild size="lg" className="group mt-8">
            <Link href="/contact" aria-label="문의하기 페이지로 이동">
              문의하기
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
