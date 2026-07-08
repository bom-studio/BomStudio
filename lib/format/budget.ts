const MAX_BUDGET_DIGITS = 9;

export function extractBudgetDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, MAX_BUDGET_DIGITS);
}

export function formatBudget(value: string): string {
  const digits = extractBudgetDigits(value);

  if (!digits) {
    return "";
  }

  return `${Number(digits).toLocaleString("ko-KR")}원`;
}

export function getBudgetDigits(value: string): string {
  return extractBudgetDigits(value);
}

export function formatBudgetCurrency(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "-";
  }

  const digits = extractBudgetDigits(value);
  if (!digits) {
    return value.trim();
  }

  return `₩${Number(digits).toLocaleString("ko-KR")}`;
}
