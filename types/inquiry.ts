import type { InquiryStatus } from "@/constants/inquiry";

export interface EstimateInquiry {
  id: string;
  created_at: string;
  updated_at: string;
  inquiry_number: string | null;
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
  admin_note: string | null;
  status: InquiryStatus;
  estimate_id: string | null;
  contract_id: string | null;
  project_id: string | null;
  last_contacted_at: string | null;
  estimate_created_at: string | null;
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

export interface AdjacentInquiryIds {
  prevId: string | null;
  nextId: string | null;
}
