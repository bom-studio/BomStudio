import type { EstimateDraftData } from "@/lib/admin/estimate-draft";

export interface EstimateItem {
  title: string;
  description: string;
  duration: string;
  amount: number;
  note?: string;
}

export type VatType = "포함" | "별도" | "면세";

export interface SaveEstimateInput {
  inquiryId: string;
  estimateId?: string;
  estimateNumber: string;
  customerName: string;
  company?: string;
  phone?: string;
  email?: string;
  businessType?: string;
  items: EstimateItem[];
  subtotal: number;
  vat: number;
  total: number;
  vatType: VatType;
  paymentTerms?: string;
  deliveryPeriod?: string;
  validUntil?: string;
  requestSummary?: string;
  referenceUrls?: string;
  memo?: string;
  formSnapshot?: EstimateDraftData;
}

export interface SavedEstimate {
  id: string;
  inquiry_id: string;
  estimate_number: string;
  customer_name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  business_type: string | null;
  items: EstimateItem[];
  subtotal: number;
  vat: number;
  total: number;
  vat_type: VatType | null;
  payment_terms: string | null;
  delivery_period: string | null;
  valid_until: string | null;
  request_summary: string | null;
  reference_urls: string | null;
  memo: string | null;
  status: string | null;
  form_snapshot: EstimateDraftData | null;
  created_at: string;
  updated_at: string;
}

export type EstimateActionResult =
  | { success: true; estimateId: string; isUpdate: boolean }
  | { success: false; error: string };
