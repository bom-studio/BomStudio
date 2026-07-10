const KST_TIMEZONE = "Asia/Seoul";

export function getKSTDateString(offsetDays = 0): string {
  const date = new Date();
  if (offsetDays !== 0) {
    date.setUTCDate(date.getUTCDate() + offsetDays);
  }
  return date.toLocaleDateString("en-CA", { timeZone: KST_TIMEZONE });
}

export function getKSTMonthKey(offsetMonths = 0): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === "year")?.value ?? 0);
  const month = Number(parts.find((p) => p.type === "month")?.value ?? 1);
  const total = year * 12 + (month - 1) + offsetMonths;
  return { year: Math.floor(total / 12), month: (total % 12) + 1 };
}

export function kstDayStartIso(dateStr: string): string {
  return `${dateStr}T00:00:00+09:00`;
}

export function kstDayEndIso(dateStr: string): string {
  return `${dateStr}T23:59:59.999+09:00`;
}

export function kstMonthStartIso(year: number, month: number): string {
  const m = String(month).padStart(2, "0");
  return `${year}-${m}-01T00:00:00+09:00`;
}

export function kstMonthEndIso(year: number, month: number): string {
  const lastDay = new Date(year, month, 0).getDate();
  const m = String(month).padStart(2, "0");
  const d = String(lastDay).padStart(2, "0");
  return `${year}-${m}-${d}T23:59:59.999+09:00`;
}

export function formatKSTDisplayDate(date = new Date()): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatMonthLabel(year: number, month: number): string {
  return `${year}.${String(month).padStart(2, "0")}`;
}

export function calcChangePercent(current: number, previous: number): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : current === 0 ? 0 : null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export function isInKSTMonth(iso: string, year: number, month: number): boolean {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  return y === year && m === month;
}

export function toKSTDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: KST_TIMEZONE });
}

export function formatActivityTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function isTodayKST(iso: string): boolean {
  return toKSTDateKey(iso) === getKSTDateString();
}
