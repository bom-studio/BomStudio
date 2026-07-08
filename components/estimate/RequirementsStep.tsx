"use client";

import { Label } from "@/components/ui/label";
import { RequirementOptionCard } from "@/components/estimate/RequirementOptionCard";
import {
  FEATURE_OPTIONS,
  FEATURE_TOOLTIPS,
  PAGE_OPTIONS,
} from "@/constants/estimate-requirements";
import type { EstimateStep3Errors } from "@/types/estimate";

interface RequirementsStepProps {
  pages: string[];
  features: string[];
  errors?: EstimateStep3Errors;
  onPagesChange: (pages: string[]) => void;
  onFeaturesChange: (features: string[]) => void;
}

function toggleItem(item: string, list: string[], setter: (value: string[]) => void) {
  setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
}

export function RequirementsStep({
  pages,
  features,
  errors,
  onPagesChange,
  onFeaturesChange,
}: RequirementsStepProps) {
  return (
    <div className="mt-8 space-y-10">
      <div className="space-y-3">
        <div>
          <Label>필요한 페이지</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            제작이 필요한 페이지를 모두 선택해 주세요. (최소 1개)
          </p>
        </div>
        {errors?.pages ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.pages}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAGE_OPTIONS.map((page) => (
            <RequirementOptionCard
              key={page}
              label={page}
              selected={pages.includes(page)}
              onToggle={() => toggleItem(page, pages, onPagesChange)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>필요한 기능</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            원하시는 기능을 선택하고, ? 아이콘으로 설명을 확인할 수 있습니다. (최소 1개)
          </p>
        </div>
        {errors?.features ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.features}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_OPTIONS.map((feature) => (
            <RequirementOptionCard
              key={feature}
              label={feature}
              selected={features.includes(feature)}
              onToggle={() => toggleItem(feature, features, onFeaturesChange)}
              tooltip={FEATURE_TOOLTIPS[feature]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
