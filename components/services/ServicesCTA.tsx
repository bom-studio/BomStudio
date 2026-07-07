"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { transition } from "@/lib/motion";

export function ServicesCTA() {
  return (
    <section className="section-padding">
      <div className="container-max px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition.normal}
          className="rounded-[20px] border border-primary/20 bg-primary/5 p-10 text-center sm:p-16"
        >
          <h2 className="text-section-title text-2xl sm:text-3xl">
            우리 브랜드에 맞는 홈페이지를
            <br className="hidden sm:block" />
            함께 만들어보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-body-lg text-muted-foreground">
            무료 상담을 통해 필요한 기능과 제작 방향을 안내드립니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link href="/contact">
                무료 상담 신청하기
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section> 
  );
}
