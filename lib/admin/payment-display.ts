import type { PaymentPeriodFilter } from "@/constants/payment-admin";

export function getPaymentPeriodRange(period: PaymentPeriodFilter | string): {
  start: string | null;
  end: string | null;
} {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (period === "전체") {
    return { start: null, end: null };
  }

  if (period === "올해") {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    return { start: start.toISOString(), end: end.toISOString() };
  }

  if (period === "지난달") {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    return { start: start.toISOString(), end: end.toISOString() };
  }

  // 이번달 (default)
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function resolvePaymentDisplayDate(payment: {
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
}): string {
  return payment.paid_at || payment.due_date || payment.created_at;
}

export function formatPaymentMethod(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed || "-";
}

export function formatDepositorName(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed || "-";
}
