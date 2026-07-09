"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveEstimate } from "@/app/actions/estimates";
import { buildSaveInputFromDraft } from "@/lib/admin/estimate-persistence";
import type { EstimateDraftData } from "@/lib/admin/estimate-draft";
import type { EstimateInquiry } from "@/types/inquiry";
import { cn } from "@/lib/utils";
import { EstimateDocument } from "./EstimateDocument";
import {
  EstimatePreviewActions,
  sendEstimateToCustomer,
} from "./EstimatePreviewActions";

interface EstimatePreviewStepProps {
  draft: EstimateDraftData;
  inquiry: EstimateInquiry;
  savedEstimateId: string | null;
  isEditMode?: boolean;
  onBack: () => void;
  onSaved: (estimateId: string, isUpdate: boolean) => string;
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

export function EstimatePreviewStep({
  draft,
  inquiry,
  savedEstimateId,
  isEditMode = false,
  onBack,
  onSaved,
}: EstimatePreviewStepProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isPdfPending, setIsPdfPending] = useState(false);
  const [currentEstimateId, setCurrentEstimateId] = useState<string | null>(savedEstimateId);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setCurrentEstimateId(savedEstimateId);
  }, [savedEstimateId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

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
      const input = buildSaveInputFromDraft(draft, inquiry, currentEstimateId ?? undefined);
      const result = await saveEstimate(input);

      if (!result.success) {
        setToast({ type: "error", message: result.error });
        return;
      }

      setCurrentEstimateId(result.estimateId);
      const message = onSaved(result.estimateId, result.isUpdate);
      setToast({ type: "success", message });
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
        isSaved={Boolean(currentEstimateId)}
        isEditMode={isEditMode}
      />

      {toast ? (
        <p
          className={cn(
            "fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg",
            toast.type === "success" ? "bg-[#0F766E]" : "bg-destructive"
          )}
          role="status"
        >
          {toast.message}
        </p>
      ) : null}
    </div>
  );
}
