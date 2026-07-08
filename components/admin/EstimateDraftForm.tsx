"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EstimateInquiry } from "@/types/inquiry";

interface EstimateDraftFormProps {
  inquiry: EstimateInquiry;
}

function buildRequestSummary(inquiry: EstimateInquiry): string {
  const parts = [
    inquiry.message,
    inquiry.pages.length ? `필요 페이지: ${inquiry.pages.join(", ")}` : null,
    inquiry.features.length ? `필요 기능: ${inquiry.features.join(", ")}` : null,
    inquiry.reference ? `참고 사이트: ${inquiry.reference}` : null,
    inquiry.schedule ? `희망 일정: ${inquiry.schedule}` : null,
  ].filter(Boolean);

  return parts.join("\n");
}

export function EstimateDraftForm({ inquiry }: EstimateDraftFormProps) {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/inquiries/${inquiry.id}`}>
          <ArrowLeft className="h-4 w-4" />
          문의 상세로
        </Link>
      </Button>

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">견적서 작성</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          견적문의 내용이 자동으로 채워졌습니다. 견적 항목을 추가해 주세요.
        </p>

        <form className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">고객명</Label>
            <Input id="customerName" defaultValue={inquiry.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">회사명</Label>
            <Input id="company" defaultValue={inquiry.company ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">연락처</Label>
            <Input id="phone" defaultValue={inquiry.phone} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" defaultValue={inquiry.email ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">업종</Label>
            <Input
              id="businessType"
              defaultValue={inquiry.business_type ?? inquiry.company ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">예상 예산</Label>
            <Input id="budget" defaultValue={inquiry.budget ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="request">요청 내용</Label>
            <Textarea
              id="request"
              className="min-h-32"
              defaultValue={buildRequestSummary(inquiry)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="quoteItems">견적 항목</Label>
            <Textarea
              id="quoteItems"
              className="min-h-40"
              placeholder="예) 메인 페이지 제작, 반응형 적용, 관리자 페이지, SEO 설정..."
            />
          </div>
        </form>

        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="outline" disabled>
            PDF 저장 (준비 중)
          </Button>
          <Button type="button" disabled>
            견적서 저장 (준비 중)
          </Button>
        </div>
      </div>
    </div>
  );
}
