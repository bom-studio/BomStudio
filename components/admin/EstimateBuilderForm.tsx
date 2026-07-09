"use client";

import type { EstimateDraftData } from "@/lib/admin/estimate-draft";
import type { EstimateInquiry } from "@/types/inquiry";
import { EstimateWizard, type EstimateStep } from "./estimate/EstimateWizard";

interface EstimateBuilderFormProps {
  inquiry: EstimateInquiry;
  initialStep?: EstimateStep;
  initialDraft?: EstimateDraftData | null;
}

export function EstimateBuilderForm({
  inquiry,
  initialStep,
  initialDraft,
}: EstimateBuilderFormProps) {
  return (
    <EstimateWizard
      inquiry={inquiry}
      initialStep={initialStep}
      initialDraft={initialDraft}
    />
  );
}
