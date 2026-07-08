"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, FileDown, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { saveEstimate } from "@/app/actions/estimates";
import { Button } from "@/components/ui/button";
import { calculateEstimate, decodeDraft, type EstimateDraftData } from "@/lib/admin/estimate-draft";
import { parseReferenceUrls } from "@/lib/admin/inquiry-utils";
import type { EstimateInquiry } from "@/types/inquiry";

interface EstimatePreviewProps {
  inquiry: EstimateInquiry;
  draftParam?: string;
}

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function EstimatePreview({ inquiry, draftParam }: EstimatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isPdfPending, setIsPdfPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const draft = decodeDraft(draftParam);

  if (!draft) {
    return (
      <div className="rounded-xl border border-border bg-white p-8">
        <p className="text-sm text-muted-foreground">
          견적 데이터가 없습니다. 견적서 작성 화면에서 다시 진행해 주세요.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/admin/estimates/new?inquiryId=${inquiry.id}`}>견적 수정</Link>
        </Button>
      </div>
    );
  }

  const summary = calculateEstimate(draft);
  const referenceUrls = parseReferenceUrls(inquiry.reference);

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveEstimate({
        inquiryId: inquiry.id,
        estimateNumber: draft.estimateNumber,
        customerName: draft.customer.name,
        company: draft.customer.company,
        phone: draft.customer.phone,
        email: draft.customer.email,
        businessType: draft.customer.businessType,
        items: summary.lines.map((line) => ({
          title: line.label,
          description: "",
          duration: "",
          amount: line.price ?? 0,
          note: "",
        })),
        subtotal: summary.subtotal,
        vat: summary.vat,
        total: summary.total,
        paymentTerms: draft.paymentTerms,
        memo: draft.note,
      });

      setMessage(result.success ? "견적서가 저장되었습니다." : result.error);
    });
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    setIsPdfPending(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = 210;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(image, "PNG", 0, 0, width, height);
      const safeName = draft.customer.name.replace(/[\\/:*?"<>|]/g, "");
      pdf.save(`견적서_${draft.estimateNumber}_${safeName}.pdf`);
    } finally {
      setIsPdfPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href={`/admin/estimates/new?inquiryId=${inquiry.id}`}>
            <ArrowLeft className="h-4 w-4" />
            견적 수정
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={downloadPdf} disabled={isPdfPending}>
            <FileDown className="h-4 w-4" />
            {isPdfPending ? "PDF 생성 중..." : "PDF 다운로드"}
          </Button>
          <Button type="button" onClick={save} disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending ? "저장 중..." : "견적 저장"}
          </Button>
          <Button type="button" variant="outline" disabled>
            <Send className="h-4 w-4" />
            고객에게 보내기(준비중)
          </Button>
        </div>
      </div>

      {message ? <p className="rounded-lg border border-border bg-white px-4 py-2 text-sm">{message}</p> : null}

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div
          ref={previewRef}
          className="mx-auto aspect-[210/297] w-full max-w-[820px] rounded-md border border-border bg-white p-10"
        >
          <h1 className="text-center text-3xl font-bold tracking-[0.25em]">견 적 서</h1>
          <p className="text-center text-xs text-muted-foreground">Quotation</p>

          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            <p>견적번호: {draft.estimateNumber}</p>
            <p>작성일: {draft.issuedDate}</p>
            <p>수신: {draft.customer.name}</p>
            <p>회사명: {draft.customer.company || "-"}</p>
            <p>공급자: BOM STUDIO</p>
            <p>담당자: {draft.manager || "허보미"}</p>
          </div>

          <p className="mt-6 text-sm">아래와 같이 홈페이지 제작 견적을 안내드립니다.</p>

          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-border px-2 py-1">NO</th>
                <th className="border border-border px-2 py-1">항목명</th>
                <th className="border border-border px-2 py-1">금액</th>
              </tr>
            </thead>
            <tbody>
              {summary.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className="border border-border px-2 py-1 text-center">{index + 1}</td>
                  <td className="border border-border px-2 py-1">{line.label}</td>
                  <td className="border border-border px-2 py-1 text-right">
                    {line.price === null ? "별도 견적" : formatWon(line.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            <p>총 견적금액</p>
            <p className="text-right">{formatWon(summary.subtotal)}</p>
            <p>부가세</p>
            <p className="text-right">{formatWon(summary.vat)}</p>
            <p className="font-semibold">최종 견적금액</p>
            <p className="text-right font-semibold">{formatWon(summary.total)}</p>
          </div>

          <div className="mt-6 space-y-1 text-sm">
            <p className="font-semibold">고객 요청 내용</p>
            <p>필요 페이지: {inquiry.pages.join(", ") || "-"}</p>
            <p>필요 기능: {inquiry.features.join(", ") || "-"}</p>
            <p>희망 일정: {inquiry.schedule || "-"}</p>
            <p>참고 사이트: {referenceUrls.join(", ") || "-"}</p>
            <p>문의 내용: {inquiry.message || "-"}</p>
          </div>

          <div className="mt-6 space-y-1 text-sm">
            <p className="font-semibold">계약 조건</p>
            <p className="whitespace-pre-wrap">{draft.paymentTerms}</p>
            <p>비고: {draft.note || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
