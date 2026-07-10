export const PAYMENT_STATUSES = [
  "입금대기",
  "입금예정",
  "입금완료",
  "부분입금",
  "연체",
  "취소",
  "환불",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_OPTIONS = [
  "입금대기",
  "입금완료",
  "연체",
  "취소",
] as const satisfies readonly PaymentStatus[];

export const PAYMENT_TYPES = ["계약금", "잔금", "유지보수", "기타"] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_PERIOD_FILTERS = ["이번달", "지난달", "올해", "전체"] as const;

export type PaymentPeriodFilter = (typeof PAYMENT_PERIOD_FILTERS)[number];

export function isPaymentStatus(value: string): value is PaymentStatus {
  return PAYMENT_STATUSES.includes(value as PaymentStatus);
}

export function isPaymentType(value: string): value is PaymentType {
  return PAYMENT_TYPES.includes(value as PaymentType);
}
