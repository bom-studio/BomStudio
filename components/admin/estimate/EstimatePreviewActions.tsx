"use client";

import { ArrowLeft, FileDown, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EstimatePreviewActionsProps {
  onBack: () => void;
  onDownloadPdf: () => void;
  onSave: () => void;
  onSend?: () => void;
  isPdfPending?: boolean;
  isSavePending?: boolean;
  isSaved?: boolean;
  isEditMode?: boolean;
}

export function EstimatePreviewActions({
  onBack,
  onDownloadPdf,
  onSave,
  onSend,
  isPdfPending = false,
  isSavePending = false,
  isSaved = false,
  isEditMode = false,
}: EstimatePreviewActionsProps) {
  const saveLabel = isSavePending
    ? "저장 중..."
    : isEditMode
      ? "견적서 수정"
      : isSaved
        ? "수정 저장"
        : "견적 저장";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button type="button" variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        이전
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onDownloadPdf} disabled={isPdfPending}>
          <FileDown className="h-4 w-4" />
          {isPdfPending ? "PDF 생성 중..." : "PDF 다운로드"}
        </Button>
        <Button type="button" onClick={onSave} disabled={isSavePending}>
          <Save className="h-4 w-4" />
          {saveLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => onSend?.()}>
          <Send className="h-4 w-4" />
          고객에게 발송
        </Button>
      </div>
    </div>
  );
}

/** TODO: 이메일 발송 모달/화면 연동 */
export function sendEstimateToCustomer() {
  console.warn("[TODO] 고객에게 견적서 발송 기능은 추후 구현 예정입니다.");
}
