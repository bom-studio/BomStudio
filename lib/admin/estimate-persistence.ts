import {
  buildPreviewRows,
  calculateEstimate,
  createDefaultDraft,
  type EstimateDraftData,
} from "@/lib/admin/estimate-draft";
import { parseReferenceUrls } from "@/lib/admin/inquiry-utils";
import type { EstimateItem, SaveEstimateInput, SavedEstimate, VatType } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";

export function getVatTypeFromDraft(draft: EstimateDraftData): VatType {
  if (draft.conditions.vatIncluded) return "포함";
  if (draft.conditions.vatSeparate) return "별도";
  return "면세";
}

export function buildRequestSummary(inquiry: EstimateInquiry): string {
  const lines = [
    `필요 페이지: ${inquiry.pages.join(", ") || "-"}`,
    `필요 기능: ${inquiry.features.join(", ") || "-"}`,
    `희망 일정: ${inquiry.schedule || "-"}`,
  ];
  if (inquiry.message?.trim()) {
    lines.push(`문의 내용: ${inquiry.message.trim()}`);
  }
  return lines.join("\n");
}

export function buildReferenceUrlsString(inquiry: EstimateInquiry): string {
  return parseReferenceUrls(inquiry.reference).join("\n");
}

export function buildDeliveryPeriod(draft: EstimateDraftData): string {
  const rows = buildPreviewRows(draft);
  const durations = rows.map((row) => row.duration).filter(Boolean);
  if (durations.length === 0) return "2~3주";
  return durations[durations.length - 1];
}

export function buildValidUntil(issuedDate: string, days = 30): string {
  const date = new Date(issuedDate);
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + days);
    return fallback.toISOString().slice(0, 10);
  }
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function buildSaveInputFromDraft(
  draft: EstimateDraftData,
  inquiry: EstimateInquiry,
  estimateId?: string
): SaveEstimateInput {
  const summary = calculateEstimate(draft);
  const rows = buildPreviewRows(draft);

  const items: EstimateItem[] = rows.map((row) => ({
    title: row.title,
    description: row.description,
    duration: row.duration,
    amount: row.price ?? 0,
    note: "",
  }));

  return {
    inquiryId: inquiry.id,
    estimateId,
    estimateNumber: draft.estimateNumber,
    customerName: draft.customer.name,
    company: draft.customer.company,
    phone: draft.customer.phone,
    email: draft.customer.email,
    businessType: draft.customer.businessType,
    items,
    subtotal: summary.discountedSubtotal,
    vat: summary.vat,
    total: summary.total,
    vatType: getVatTypeFromDraft(draft),
    paymentTerms: draft.paymentTerms,
    deliveryPeriod: buildDeliveryPeriod(draft),
    validUntil: buildValidUntil(draft.issuedDate),
    requestSummary: buildRequestSummary(inquiry),
    referenceUrls: buildReferenceUrlsString(inquiry),
    memo: draft.note,
    formSnapshot: draft,
  };
}

export function draftFromSavedEstimate(
  estimate: SavedEstimate,
  inquiry: EstimateInquiry
): EstimateDraftData {
  if (estimate.form_snapshot) {
    return {
      ...estimate.form_snapshot,
      estimateNumber: estimate.estimate_number,
      issuedDate: estimate.form_snapshot.issuedDate || estimate.created_at.slice(0, 10),
      paymentTerms: estimate.payment_terms ?? estimate.form_snapshot.paymentTerms,
      note: estimate.memo ?? estimate.form_snapshot.note,
      customer: {
        ...estimate.form_snapshot.customer,
        name: estimate.customer_name,
        company: estimate.company ?? "",
        phone: estimate.phone ?? "",
        email: estimate.email ?? "",
        businessType:
          estimate.business_type ??
          estimate.form_snapshot.customer?.businessType ??
          inquiry.business_type ??
          "",
      },
    };
  }

  const base = createDefaultDraft(inquiry);
  return {
    ...base,
    estimateNumber: estimate.estimate_number,
    issuedDate: estimate.valid_until
      ? estimate.created_at.slice(0, 10)
      : base.issuedDate,
    paymentTerms: estimate.payment_terms ?? base.paymentTerms,
    note: estimate.memo ?? "",
    customer: {
      name: estimate.customer_name,
      company: estimate.company ?? "",
      phone: estimate.phone ?? "",
      email: estimate.email ?? "",
      businessType: estimate.business_type ?? inquiry.business_type ?? "",
    },
  };
}
