import { BRAND } from "@/constants/brand";
import { CONTACT_ITEMS } from "@/constants/contact";
import {
  formatEstimateDate,
  parseEstimateItems,
  resolveBusinessType,
} from "@/lib/admin/estimate-display";
import type { ParsedEstimateItem } from "@/lib/admin/estimate-display";
import type { SavedEstimate } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";

export interface EstimateDocumentView {
  estimateNumber: string;
  issuedDate: string;
  validUntil: string;
  title: string;
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    businessType: string;
  };
  supplier: {
    name: string;
    representative: string;
    phone: string;
    email: string;
  };
  items: ParsedEstimateItem[];
  amounts: {
    subtotal: number;
    vat: number;
    total: number;
    vatType: string | null;
  };
  paymentTerms: string;
  deliveryPeriod: string;
  note: string | null;
  requestSummary: string | null;
}

function supplierContact() {
  const phone = CONTACT_ITEMS.find((item) => item.type === "전화")?.value ?? "-";
  const email = CONTACT_ITEMS.find((item) => item.type === "이메일")?.value ?? "-";
  return { phone, email };
}

function resolveEstimateTitle(estimate: SavedEstimate): string {
  const summary = estimate.request_summary?.trim();
  if (summary) {
    const firstLine = summary.split("\n")[0]?.trim();
    if (firstLine) return firstLine;
  }
  return "홈페이지 제작 견적";
}

function displayValue(value: string | null | undefined): string {
  if (!value?.trim()) return "-";
  return value.trim();
}

export function buildEstimateDocumentView({
  estimate,
  inquiry,
}: {
  estimate: SavedEstimate;
  inquiry?: Pick<EstimateInquiry, "business_type"> | null;
}): EstimateDocumentView {
  const contact = supplierContact();

  return {
    estimateNumber: estimate.estimate_number,
    issuedDate: formatEstimateDate(estimate.created_at),
    validUntil: formatEstimateDate(estimate.valid_until),
    title: resolveEstimateTitle(estimate),
    customer: {
      name: estimate.customer_name,
      company: displayValue(estimate.company),
      phone: displayValue(estimate.phone),
      email: displayValue(estimate.email),
      businessType: resolveBusinessType(estimate, inquiry),
    },
    supplier: {
      name: BRAND.name,
      representative: "허보미",
      phone: contact.phone,
      email: contact.email,
    },
    items: parseEstimateItems(estimate.items, estimate.delivery_period),
    amounts: {
      subtotal: estimate.subtotal,
      vat: estimate.vat,
      total: estimate.total,
      vatType: estimate.vat_type,
    },
    paymentTerms: displayValue(estimate.payment_terms),
    deliveryPeriod: displayValue(estimate.delivery_period),
    note: estimate.memo?.trim() || null,
    requestSummary: estimate.request_summary?.trim() || null,
  };
}
