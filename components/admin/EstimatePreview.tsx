"use client";

import { decodeDraft } from "@/lib/admin/estimate-draft";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimateWizard } from "./estimate/EstimateWizard";

interface EstimatePreviewProps {
  inquiry: EstimateInquiry;
  draftParam?: string;
}

export function EstimatePreview({ inquiry, draftParam }: EstimatePreviewProps) {
  const draft = decodeDraft(draftParam);

  if (!draft) {
    return (
      <div className="mx-auto max-w-[1280px] rounded-xl border border-border bg-white p-8">
        <p className="text-sm text-muted-foreground">
          견적 데이터가 없습니다. 견적서 작성 화면에서 다시 진행해 주세요.
        </p>
      </div>
    );
  }

  return (
    <EstimateWizard inquiry={inquiry} initialStep="preview" initialDraft={draft} />
  );
}
