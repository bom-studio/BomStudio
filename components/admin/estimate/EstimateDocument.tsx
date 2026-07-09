"use client";

import {
  buildPreviewRows,
  formatContractConditions,
  formatDisplayDate,
  formatPreviewPrice,
  type EstimateDraftData,
} from "@/lib/admin/estimate-draft";
import { parseReferenceUrls } from "@/lib/admin/inquiry-utils";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimatePreviewSummary } from "./EstimatePreviewSummary";
import { EstimatePreviewTable } from "./EstimatePreviewTable";

interface EstimateDocumentProps {
  draft: EstimateDraftData;
  inquiry: EstimateInquiry;
}

export function EstimateDocument({ draft, inquiry }: EstimateDocumentProps) {
  const rows = buildPreviewRows(draft);
  const referenceUrls = parseReferenceUrls(inquiry.reference);
  const contractText = formatContractConditions(draft);

  return (
    <div className="bg-white px-8 py-10 text-[13px] leading-relaxed text-foreground sm:px-12 sm:py-12">
      <div className="border-b border-[#E5E7EB] pb-6 text-center">
        <h1 className="text-[28px] font-bold tracking-[0.3em] text-foreground">견 적 서</h1>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Quotation
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-3 text-[13px]">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">견적번호</p>
            <p className="font-medium">{draft.estimateNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">수신</p>
            <p className="font-medium">{draft.customer.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">회사명</p>
            <p className="font-medium">{draft.customer.company || "-"}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">작성일</p>
            <p className="font-medium">{formatDisplayDate(draft.issuedDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">공급자</p>
            <p className="font-medium">BOM STUDIO</p>
            <p className="text-muted-foreground">대표 허보미</p>
            <p className="text-muted-foreground">bomstudio22@gmail.com</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[13px]">아래와 같이 홈페이지 제작 견적을 안내드립니다.</p>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-[#0F766E]">제작 항목</p>
        <EstimatePreviewTable rows={rows} />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-[#0F766E]">합계</p>
        <EstimatePreviewSummary draft={draft} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-[#0F766E]">요청 내용</p>
        <div className="space-y-1.5 text-[13px] text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">필요 페이지:</span>{" "}
            {inquiry.pages.join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium text-foreground">필요 기능:</span>{" "}
            {inquiry.features.join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium text-foreground">희망 일정:</span>{" "}
            {inquiry.schedule || "-"}
          </p>
          <p>
            <span className="font-medium text-foreground">참고 사이트:</span>{" "}
            {referenceUrls.join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium text-foreground">요청사항:</span>{" "}
            {inquiry.message || "-"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-[#0F766E]">계약 조건</p>
        <p className="whitespace-pre-wrap text-[13px] text-muted-foreground">{contractText}</p>
      </div>

      {draft.note.trim() ? (
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-[#0F766E]">비고</p>
          <p className="whitespace-pre-wrap text-[13px] text-muted-foreground">{draft.note}</p>
        </div>
      ) : null}
    </div>
  );
}
