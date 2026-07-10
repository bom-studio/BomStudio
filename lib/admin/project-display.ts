import { formatEstimateDate } from "@/lib/admin/estimate-display";

export function formatProjectPeriod(
  startDate: string | null | undefined,
  dueDate: string | null | undefined
): string {
  const start = formatEstimateDate(startDate || undefined);
  const end = formatEstimateDate(dueDate || undefined);

  if (start === "-" && end === "-") return "-";
  if (start === "-") return end;
  if (end === "-") return start;
  return `${start} ~ ${end}`;
}

export function formatRemainingDays(dueDate: string | null | undefined): string | null {
  if (!dueDate?.trim()) return null;

  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(due.getTime())) return null;

  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

export function formatRemainingDaysLabel(dueDate: string | null | undefined): string | null {
  if (!dueDate?.trim()) return null;

  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(due.getTime())) return null;

  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff > 0) return `${diff}일`;
  if (diff === 0) return "오늘";
  return `${Math.abs(diff)}일 지남`;
}
