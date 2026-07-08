export const INQUIRY_STATUSES = [
  "접수완료",
  "상담중",
  "견적서작성",
  "계약완료",
  "보류",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const DEFAULT_INQUIRY_STATUS: InquiryStatus = "접수완료";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  접수완료: "접수완료",
  상담중: "상담중",
  견적서작성: "견적서작성",
  계약완료: "계약완료",
  보류: "보류",
};
