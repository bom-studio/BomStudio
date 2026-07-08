import type { InquiryStatus } from "@/constants/inquiry";

export interface EstimateInquiry {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  business_type: string | null;
  budget: string | null;
  schedule: string | null;
  pages: string[];
  features: string[];
  reference: string | null;
  message: string | null;
  status: InquiryStatus;
}

export interface EstimateInquiryInsert {
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  business_type?: string | null;
  budget?: string | null;
  schedule?: string | null;
  pages?: string[];
  features?: string[];
  reference?: string | null;
  message?: string | null;
}
