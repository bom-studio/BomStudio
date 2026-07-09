"use client";

import type { EstimateDraftData } from "@/lib/admin/estimate-draft";
import type { SavedEstimate } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimateWizard, type EstimateStep } from "./estimate/EstimateWizard";

interface EstimateBuilderFormProps {
  inquiry: EstimateInquiry;
  savedEstimate?: SavedEstimate | null;
  isEditMode?: boolean;
  initialStep?: EstimateStep;
  initialDraft?: EstimateDraftData | null;
}

export function EstimateBuilderForm({
  inquiry,
  savedEstimate = null,
  isEditMode = false,
  initialStep,
  initialDraft,
}: EstimateBuilderFormProps) {
  return (
    <EstimateWizard
      inquiry={inquiry}
      savedEstimate={savedEstimate}
      isEditMode={isEditMode}
      initialStep={initialStep}
      initialDraft={initialDraft}
    />
  );
}
