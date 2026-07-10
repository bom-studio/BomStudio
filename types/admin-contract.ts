import type { BillingCycle, ContractStatus, ContractType } from "@/constants/contract-admin";

export interface CreateContractInput {
  inquiryId?: string;
  estimateId?: string;
  contractNumber: string;
  customerName: string;
  company?: string;
  phone?: string;
  email?: string;
  projectTitle?: string;
  contractAmount: number;
  downPaymentAmount: number;
  balancePaymentAmount: number;
  contractType: ContractType;
  billingCycle: BillingCycle;
  startDate?: string;
  endDate?: string;
  contractTerms?: string;
  specialTerms?: string;
  memo?: string;
}

export interface SavedContract {
  id: string;
  inquiry_id: string | null;
  estimate_id: string | null;
  contract_number: string;
  customer_name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  project_title: string | null;
  contract_amount: number;
  down_payment_amount: number;
  balance_payment_amount: number;
  contract_type: ContractType | string;
  billing_cycle: BillingCycle | string;
  start_date: string | null;
  end_date: string | null;
  contract_terms: string | null;
  special_terms: string | null;
  status: ContractStatus | string | null;
  memo: string | null;
  down_payment_status: string | null;
  balance_payment_status: string | null;
  signature_status: string | null;
  down_payment_paid: boolean;
  balance_payment_paid: boolean;
  down_payment_paid_at: string | null;
  balance_payment_paid_at: string | null;
  customer_signed: boolean;
  studio_signed: boolean;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ContractActionResult =
  | { success: true; contractId: string }
  | { success: false; error: string };

export type ContractMutationResult =
  | { success: true }
  | { success: false; error: string };

export interface ContractFormState {
  contractNumber: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  projectTitle: string;
  contractAmount: string;
  downPaymentAmount: string;
  balancePaymentAmount: string;
  contractType: ContractType;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  contractTerms: string;
  specialTerms: string;
  memo: string;
  inquiryId: string;
  estimateId: string;
}
