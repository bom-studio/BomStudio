"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandSymbol } from "@/components/logo/BrandSymbol";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <BrandSymbol size={80} className="mx-auto mb-8" />
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
