import type { PaymentPeriodFilter, PaymentStatus, PaymentType } from "@/constants/payment-admin";

export interface SavedPayment {
  id: string;
  payment_number: string;
  contract_id: string | null;
  inquiry_id: string | null;
  estimate_id: string | null;
  project_id: string | null;
  customer_name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  contract_number: string | null;
  project_title: string | null;
  payment_type: PaymentType | string;
  amount: number;
  status: PaymentStatus | string;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  depositor_name: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyPaymentSummary {
  downPayment: number;
  balancePayment: number;
  maintenance: number;
  totalRevenue: number;
  unpaidAmount: number;
}

export interface FetchPaymentsParams {
  status?: string;
  period?: PaymentPeriodFilter | string;
  q?: string;
}

export type PaymentMutationResult =
  | { success: true }
  | { success: false; error: string };
