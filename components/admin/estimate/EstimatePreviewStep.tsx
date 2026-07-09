"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveEstimate } from "@/app/actions/estimates";
import {
  buildPreviewRows,
  calculateEstimate,
  type EstimateDraftData,
} from "@/lib/admin/estimate-draft";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimateDocument } from "./EstimateDocument";
import {
  EstimatePreviewActions,
  sendEstimateToCustomer,
} from "./EstimatePreviewActions";

interface EstimatePreviewStepProps {
  draft: EstimateDraftData;
  inquiry: EstimateInquiry;
  onBack: () => void;
}

/** TODO: 필요 시 서버 액션 분리 */
async function persistEstimate(draft: EstimateDraftData, inquiry: EstimateInquiry) {
  const summary = calculateEstimate(draft);
  const rows = buildPreviewRows(draft);

  return saveEstimate({
    inquiryId: inquiry.id,
    estimateNumber: draft.estimateNumber,
    customerName: draft.customer.name,
    company: draft.customer.company,
    phone: draft.customer.phone,
    email: draft.customer.email,
    businessType: draft.customer.businessType,
    items: rows.map((row) => ({
      title: row.title,
      description: row.description,
      duration: row.duration,
      amount: row.price ?? 0,
      note: "",
    })),
    subtotal: summary.discountedSubtotal,
    vat: summary.vat,
    total: summary.total,
    paymentTerms: draft.paymentTerms,
    memo: draft.note,
  });
}

export async function downloadEstimatePdf(
  element: HTMLElement,
  estimateNumber: string,
  customerName: string
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const image = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const width = 210;
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(image, "PNG", 0, 0, width, height);
  const safeName = customerName.replace(/[\\/:*?"<>|]/g, "");
  pdf.save(`견적서_${estimateNumber}_${safeName}.pdf`);
}

export function EstimatePreviewStep({ draft, inquiry, onBack }: EstimatePreviewStepProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isPdfPending, setIsPdfPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsPdfPending(true);
    try {
      await downloadEstimatePdf(
        previewRef.current,
        draft.estimateNumber,
        draft.customer.name
      );
    } finally {
      setIsPdfPending(false);
    }
  };

  const handleSave = () => {
    setToast(null);
    startTransition(async () => {
      const result = await persistEstimate(draft, inquiry);
      if (!result.success) {
        setToast(result.error);
        return;
      }
      setToast("견적서가 저장되었습니다.");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">견적서 미리보기</h1>
        <p className="text-sm text-muted-foreground">
          작성한 견적서를 확인하고 PDF 저장 또는 DB 저장을 진행하세요.
        </p>
      </header>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 shadow-sm sm:p-6">
        <div className="max-h-[calc(100vh-16rem)] overflow-auto">
          <div
            ref={previewRef}
            className="mx-auto w-full max-w-[820px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-md"
          >
            <EstimateDocument draft={draft} inquiry={inquiry} />
          </div>
        </div>
      </div>

      <EstimatePreviewActions
        onBack={onBack}
        onDownloadPdf={handleDownloadPdf}
        onSave={handleSave}
        onSend={sendEstimateToCustomer}
        isPdfPending={isPdfPending}
        isSavePending={isPending}
      />

      {toast ? (
        <p
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </p>
      ) : null}
    </div>
  );
}
