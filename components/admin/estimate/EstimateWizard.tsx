"use client";

import { useEffect, useState } from "react";
import { draftFromSavedEstimate } from "@/lib/admin/estimate-persistence";
import {
  createDefaultDraft,
  loadDraftFromStorage,
  saveDraftToStorage,
  type EstimateDraftData,
} from "@/lib/admin/estimate-draft";
import type { SavedEstimate } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimateForm } from "./EstimateForm";
import { EstimatePreviewStep } from "./EstimatePreviewStep";

export type EstimateStep = "form" | "preview";

interface EstimateWizardProps {
  inquiry: EstimateInquiry;
  savedEstimate?: SavedEstimate | null;
  isEditMode?: boolean;
  initialStep?: EstimateStep;
  initialDraft?: EstimateDraftData | null;
}

export function EstimateWizard({
  inquiry,
  savedEstimate = null,
  isEditMode = false,
  initialStep = "form",
  initialDraft = null,
}: EstimateWizardProps) {
  const [step, setStep] = useState<EstimateStep>(initialStep);
  const [savedEstimateId, setSavedEstimateId] = useState<string | null>(
    savedEstimate?.id ?? inquiry.estimate_id ?? null
  );
  const [draft, setDraft] = useState<EstimateDraftData>(() => {
    if (initialDraft) return initialDraft;
    if (savedEstimate) return draftFromSavedEstimate(savedEstimate, inquiry);
    return createDefaultDraft(inquiry);
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (initialDraft) {
      setHydrated(true);
      return;
    }

    if (savedEstimate) {
      setDraft(draftFromSavedEstimate(savedEstimate, inquiry));
      setSavedEstimateId(savedEstimate.id);
      setHydrated(true);
      return;
    }

    const localDraft = loadDraftFromStorage(inquiry.id);
    if (localDraft) {
      setDraft(localDraft);
    }
    setHydrated(true);
  }, [inquiry, initialDraft, savedEstimate]);

  useEffect(() => {
    if (!hydrated) return;
    saveDraftToStorage(inquiry.id, draft);
  }, [draft, hydrated, inquiry.id]);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[1280px] py-12 text-center text-sm text-muted-foreground">
        견적서 데이터를 불러오는 중...
      </div>
    );
  }

  if (step === "preview") {
    return (
      <EstimatePreviewStep
        draft={draft}
        inquiry={inquiry}
        savedEstimateId={savedEstimateId}
        isEditMode={isEditMode}
        onBack={() => setStep("form")}
        onSaved={(estimateId, isUpdate) => {
          setSavedEstimateId(estimateId);
          return isUpdate ? "견적서가 수정되었습니다." : "견적서가 저장되었습니다.";
        }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <EstimateForm
        inquiry={inquiry}
        draft={draft}
        setDraft={setDraft}
        onNext={() => setStep("preview")}
        isEditMode={isEditMode}
      />
    </div>
  );
}
