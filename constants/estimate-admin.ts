export const ESTIMATE_STATUSES = [
  "작성중",
  "발송완료",
  "수정요청",
  "승인완료",
  "계약완료",
  "보류",
  "취소",
] as const;

export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];

export const ESTIMATE_STATUS_OPTIONS = [
  "작성중",
  "발송완료",
  "수정요청",
  "승인완료",
  "보류",
] as const satisfies readonly EstimateStatus[];

export function isEstimateStatus(value: string): value is EstimateStatus {
  return ESTIMATE_STATUSES.includes(value as EstimateStatus);
}
