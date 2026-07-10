export const CUSTOMER_STATUSES = [
  "신규",
  "상담중",
  "진행중",
  "완료",
  "휴면",
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_STATUS_OPTIONS = [...CUSTOMER_STATUSES] as const;

export const CONSULTATION_TYPES = [
  "전화",
  "카카오톡",
  "방문",
  "이메일",
  "기타",
] as const;

export type ConsultationType = (typeof CONSULTATION_TYPES)[number];

export const CUSTOMER_SORT_OPTIONS = [
  { value: "created_desc", label: "등록순" },
  { value: "contacted_desc", label: "최근 연락순" },
  { value: "revenue_desc", label: "매출순" },
] as const;

export type CustomerSort = (typeof CUSTOMER_SORT_OPTIONS)[number]["value"];

export function isCustomerStatus(value: string): value is CustomerStatus {
  return CUSTOMER_STATUSES.includes(value as CustomerStatus);
}

export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_ATTACHMENT_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".docx"] as const;
