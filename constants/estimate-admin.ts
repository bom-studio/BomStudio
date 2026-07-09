export const ESTIMATE_STATUSES = [
  "작성중",
  "발송완료",
  "계약완료",
  "보류",
  "취소",
] as const;

export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];

export function isEstimateStatus(value: string): value is EstimateStatus {
  return ESTIMATE_STATUSES.includes(value as EstimateStatus);
}
