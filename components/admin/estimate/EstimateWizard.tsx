"use client";

import { useEffect, useState } from "react";
import {
  createDefaultDraft,
  loadDraftFromStorage,
  saveDraftToStorage,
  type EstimateDraftData,
} from "@/lib/admin/estimate-draft";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimateForm } from "./EstimateForm";
import { EstimatePreviewStep } from "./EstimatePreviewStep";

export type EstimateStep = "form" | "preview";

interface EstimateWizardProps {
  inquiry: EstimateInquiry;
  initialStep?: EstimateStep;
  initialDraft?: EstimateDraftData | null;
}

export function EstimateWizard({
  inquiry,
  initialStep = "form",
  initialDraft = null,
}: EstimateWizardProps) {
  const [step, setStep] = useState<EstimateStep>(initialStep);
  const [draft, setDraft] = useState<EstimateDraftData>(() => {
    if (initialDraft) return initialDraft;
    return createDefaultDraft(inquiry);
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (initialDraft) {
      setHydrated(true);
      return;
    }
    const saved = loadDraftFromStorage(inquiry.id);
    if (saved) {
      setDraft(saved);
    }
    setHydrated(true);
  }, [inquiry.id, initialDraft]);

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
        onBack={() => setStep("form")}
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
      />
    </div>
  );
}
