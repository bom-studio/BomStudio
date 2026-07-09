import { calculateEstimate, type EstimateDraftData } from "@/lib/admin/estimate-draft";

interface EstimatePreviewSummaryProps {
  draft: EstimateDraftData;
}

function formatWon(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

export function EstimatePreviewSummary({ draft }: EstimatePreviewSummaryProps) {
  const summary = calculateEstimate(draft);

  return (
    <div className="ml-auto w-full max-w-sm space-y-2 text-[13px]">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">총 견적금액</span>
        <span className="text-right">{formatWon(summary.discountedSubtotal)}</span>
      </div>
      {summary.discountAmount > 0 ? (
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">할인</span>
          <span className="text-right">-{formatWon(summary.discountAmount)}</span>
        </div>
      ) : null}
      {draft.conditions.vatSeparate ? (
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">부가세</span>
          <span className="text-right">{formatWon(summary.vat)}</span>
        </div>
      ) : null}
      <div className="flex justify-between gap-4 border-t border-[#E5E7EB] pt-2 font-semibold">
        <span>최종 견적금액</span>
        <span className="text-right text-[#0F766E]">{formatWon(summary.total)}</span>
      </div>
    </div>
  );
}
