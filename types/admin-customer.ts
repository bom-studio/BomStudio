import type { ConsultationType, CustomerStatus } from "@/constants/customer-admin";

export interface SavedCustomer {
  id: string;
  customer_number: string | null;
  company: string | null;
  contact_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  website: string | null;
  business_number: string | null;
  memo: string | null;
  status: CustomerStatus;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerListItem extends SavedCustomer {
  latest_project_title: string | null;
  project_count: number;
  total_revenue: number;
  unpaid_amount: number;
}

export interface CustomerKpiSummary {
  total: number;
  newCount: number;
  inProgressCount: number;
  completedCount: number;
  dormantCount: number;
}

export interface CustomerConsultation {
  id: string;
  customer_id: string;
  consulted_at: string;
  type: ConsultationType;
  content: string;
  created_at: string;
}

export interface CustomerAttachment {
  id: string;
  customer_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface CustomerProjectHistory {
  id: string;
  project_number: string;
  project_title: string | null;
  status: string;
  contract_amount: number;
  balance_amount: number;
  start_date: string | null;
  completed_at: string | null;
}

export interface CustomerEstimateHistory {
  id: string;
  estimate_number: string;
  created_at: string;
  total: number;
  status: string | null;
}

export interface CustomerContractHistory {
  id: string;
  contract_number: string;
  down_payment_amount: number;
  balance_payment_amount: number;
  status: string | null;
  created_at: string;
}

export interface CustomerPaymentHistory {
  id: string;
  paid_at: string | null;
  amount: number;
  payment_type: string;
  status: string;
}

export interface CustomerTimelineEvent {
  id: string;
  occurred_at: string;
  label: string;
  href?: string;
}

export interface CustomerDetailData {
  customer: SavedCustomer;
  summary: {
    project_count: number;
    total_revenue: number;
    unpaid_amount: number;
    last_contacted_at: string | null;
    total_contract_amount: number;
    total_paid_amount: number;
  };
  projects: CustomerProjectHistory[];
  estimates: CustomerEstimateHistory[];
  contracts: CustomerContractHistory[];
  payments: CustomerPaymentHistory[];
  consultations: CustomerConsultation[];
  attachments: CustomerAttachment[];
  timeline: CustomerTimelineEvent[];
}

export interface CreateCustomerInput {
  company?: string;
  contact_name: string;
  phone: string;
  email?: string;
  address?: string;
  website?: string;
  business_number?: string;
  memo?: string;
  status?: CustomerStatus;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  id: string;
}

export interface CreateConsultationInput {
  customer_id: string;
  consulted_at: string;
  type: ConsultationType;
  content: string;
}

export type CustomerMutationResult =
  | { success: true; customerId?: string }
  | { success: false; error: string };
