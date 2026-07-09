"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EstimateNewLanding() {
  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold">견적서 작성</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        견적서는 견적문의를 기반으로 작성됩니다.
        <br />
        먼저 견적문의 목록에서 문의를 선택해 주세요.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/admin/estimates">
            <ArrowLeft className="h-4 w-4" />
            견적서 관리
          </Link>
        </Button>
        <Button asChild>
          <Link href="/admin/inquiries">견적문의 목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
