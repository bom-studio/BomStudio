import type { EstimateDraftData } from "@/lib/admin/estimate-draft";
import type { EstimateItem, SavedEstimate } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";

export function formatEstimateMoney(value: number) {
  return `₩${new Intl.NumberFormat("ko-KR").format(value)}`;
}

export function formatEstimateDateTime(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatEstimateDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function isEstimateDraftData(value: unknown): value is EstimateDraftData {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<EstimateDraftData>;
  return typeof draft.estimateNumber === "string" && typeof draft.customer === "object";
}

export function getFormSnapshot(estimate: SavedEstimate): EstimateDraftData | null {
  const snapshot = estimate.form_snapshot;
  return isEstimateDraftData(snapshot) ? snapshot : null;
}

export function resolveBusinessType(
  estimate: SavedEstimate,
  inquiry?: Pick<EstimateInquiry, "business_type"> | null
): string {
  const direct = readString(estimate.business_type);
  if (direct) return direct;

  const snapshot = getFormSnapshot(estimate);
  const fromCustomer = readString(snapshot?.customer?.businessType);
  if (fromCustomer) return fromCustomer;

  const fromSnapshotRoot = readString(
    (snapshot as { business_type?: string; businessType?: string } | null)?.business_type ??
      (snapshot as { business_type?: string; businessType?: string } | null)?.businessType
  );
  if (fromSnapshotRoot) return fromSnapshotRoot;

  const fromInquiry = readString(inquiry?.business_type ?? null);
  if (fromInquiry) return fromInquiry;

  return "-";
}

export interface ParsedEstimateItem {
  name: string;
  description: string;
  period: string;
  amount: number;
}

function pickField(item: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = readString(item[key]);
    if (value) return value;
  }
  return null;
}

function pickAmount(item: Record<string, unknown>): number {
  for (const key of ["amount", "price", "total"]) {
    const raw = item[key];
    const num = Number(raw ?? NaN);
    if (Number.isFinite(num)) return num;
  }
  return 0;
}

export function parseEstimateItem(
  item: EstimateItem | Record<string, unknown>,
  fallbackPeriod?: string | null
): ParsedEstimateItem {
  const row = item as Record<string, unknown>;

  return {
    name: pickField(row, ["name", "title", "itemName"]) ?? "-",
    description: pickField(row, ["description", "desc"]) ?? "-",
    period:
      pickField(row, ["period", "duration"]) ??
      readString(fallbackPeriod) ??
      "-",
    amount: pickAmount(row),
  };
}

export function parseEstimateItems(
  items: EstimateItem[],
  fallbackPeriod?: string | null
): ParsedEstimateItem[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((item) => parseEstimateItem(item, fallbackPeriod));
}
