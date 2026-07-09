import { formatEstimateDate } from "@/lib/admin/estimate-display";

export function displayContractValue(value: string | null | undefined): string {
  if (value === null || value === undefined) return "-";
  const trimmed = String(value).trim();
  return trimmed || "-";
}

export function formatContractPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  const start = formatEstimateDate(startDate);
  const end = formatEstimateDate(endDate);

  if (start === "-" && end === "-") return "-";
  if (start === "-") return end;
  if (end === "-") return start;
  return `${start} ~ ${end}`;
}

export function paymentLabel(paid: boolean): string {
  return paid ? "입금완료" : "미납";
}

export function signatureLabel(signed: boolean): string {
  return signed ? "서명완료" : "미서명";
}
