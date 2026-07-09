const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"] as const;

function convertFourDigits(value: number): string {
  if (value === 0) return "";

  const thousands = Math.floor(value / 1000);
  const hundreds = Math.floor((value % 1000) / 100);
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;

  let result = "";

  if (thousands > 0) {
    result += `${thousands === 1 ? "" : DIGITS[thousands]}천`;
  }
  if (hundreds > 0) {
    result += `${hundreds === 1 ? "" : DIGITS[hundreds]}백`;
  }
  if (tens > 0) {
    result += `${tens === 1 ? "" : DIGITS[tens]}십`;
  }
  if (ones > 0) {
    result += DIGITS[ones];
  }

  return result;
}

export function formatKoreanAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return "영원정";

  const value = Math.round(amount);
  if (value === 0) return "영원정";

  const units = ["", "만", "억", "조"];
  let remaining = value;
  let unitIndex = 0;
  let result = "";

  while (remaining > 0 && unitIndex < units.length) {
    const chunk = remaining % 10000;
    if (chunk > 0) {
      result = `${convertFourDigits(chunk)}${units[unitIndex]}${result}`;
    }
    remaining = Math.floor(remaining / 10000);
    unitIndex += 1;
  }

  return `${result}원정`;
}

export function formatVatLabel(vatType?: string | null): string {
  if (vatType === "포함") return "부가세 포함";
  if (vatType === "면세") return "면세";
  return "부가세 별도";
}
