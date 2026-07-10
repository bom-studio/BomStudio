import {
  BILLING_CYCLES,
  CONTRACT_TYPES,
  DEFAULT_CONTRACT_TERMS,
  type BillingCycle,
  type ContractType,
} from "@/constants/contract-admin";
import { buildProjectTitle } from "@/lib/admin/project-title";
import type { ContractFormState } from "@/types/admin-contract";
import type { SavedContract } from "@/types/admin-contract";
import type { SavedEstimate } from "@/types/admin-estimate";

export function generateContractNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 0xfff)
    .toString(16)
    .toUpperCase()
    .padStart(3, "0")
    .slice(-3);
  return `CON-${y}${m}${d}-${random}`;
}

export function resolveProjectTitle(
  company: string | null | undefined,
  contractType: ContractType | string = "신규제작"
): string {
  return buildProjectTitle(company, contractType);
}

export function splitPayment(amount: number) {
  const rounded = Math.max(0, Math.round(amount));
  const down = Math.round(rounded * 0.5);
  return { down, balance: rounded - down };
}

export function buildContractFormFromEstimate(estimate: SavedEstimate): ContractFormState {
  const amount = Math.round(estimate.total || 0);
  const { down, balance } = splitPayment(amount);
  const contractTerms = estimate.payment_terms?.trim() || DEFAULT_CONTRACT_TERMS;

  return {
    contractNumber: generateContractNumber(),
    customerName: estimate.customer_name || "",
    company: estimate.company || "",
    phone: estimate.phone || "",
    email: estimate.email || "",
    projectTitle: resolveProjectTitle(estimate.company, "신규제작"),
    contractAmount: String(amount),
    downPaymentAmount: String(down),
    balancePaymentAmount: String(balance),
    contractType: "신규제작",
    billingCycle: "없음",
    startDate: "",
    endDate: "",
    contractTerms,
    specialTerms: "",
    memo: "",
    inquiryId: estimate.inquiry_id || "",
    estimateId: estimate.id,
  };
}

export function buildContractFormFromSaved(contract: SavedContract): ContractFormState {
  const contractType = (CONTRACT_TYPES.includes(contract.contract_type as ContractType)
    ? contract.contract_type
    : "신규제작") as ContractType;

  return {
    contractNumber: contract.contract_number,
    customerName: contract.customer_name,
    company: contract.company || "",
    phone: contract.phone || "",
    email: contract.email || "",
    projectTitle: buildProjectTitle(contract.company, contractType),
    contractAmount: String(contract.contract_amount),
    downPaymentAmount: String(contract.down_payment_amount),
    balancePaymentAmount: String(contract.balance_payment_amount),
    contractType,
    billingCycle: (BILLING_CYCLES.includes(contract.billing_cycle as BillingCycle)
      ? contract.billing_cycle
      : "없음") as BillingCycle,
    startDate: contract.start_date || "",
    endDate: contract.end_date || "",
    contractTerms: contract.contract_terms || DEFAULT_CONTRACT_TERMS,
    specialTerms: contract.special_terms || "",
    memo: contract.memo || "",
    inquiryId: contract.inquiry_id || "",
    estimateId: contract.estimate_id || "",
  };
}

export function createEmptyContractForm(): ContractFormState {
  return {
    contractNumber: generateContractNumber(),
    customerName: "",
    company: "",
    phone: "",
    email: "",
    projectTitle: "",
    contractAmount: "0",
    downPaymentAmount: "0",
    balancePaymentAmount: "0",
    contractType: "신규제작",
    billingCycle: "없음",
    startDate: "",
    endDate: "",
    contractTerms: DEFAULT_CONTRACT_TERMS,
    specialTerms: "",
    memo: "",
    inquiryId: "",
    estimateId: "",
  };
}
