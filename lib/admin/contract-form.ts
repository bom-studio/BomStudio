import {
  BILLING_CYCLES,
  CONTRACT_TYPES,
  DEFAULT_CONTRACT_TERMS,
  type BillingCycle,
  type ContractType,
} from "@/constants/contract-admin";
import { getFormSnapshot } from "@/lib/admin/estimate-display";
import { PACKAGE_OPTIONS } from "@/lib/admin/estimate-draft";
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

export function resolveProjectTitle(estimate: SavedEstimate): string {
  const summary = estimate.request_summary?.trim();
  if (summary) {
    const firstLine = summary.split("\n")[0]?.trim();
    if (firstLine) return firstLine;
  }

  const snapshot = getFormSnapshot(estimate);
  const packageType = snapshot?.selections?.packageType;
  if (packageType && packageType in PACKAGE_OPTIONS) {
    return PACKAGE_OPTIONS[packageType].label;
  }

  return "홈페이지 제작";
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
    projectTitle: resolveProjectTitle(estimate),
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
  return {
    contractNumber: contract.contract_number,
    customerName: contract.customer_name,
    company: contract.company || "",
    phone: contract.phone || "",
    email: contract.email || "",
    projectTitle: contract.project_title || "",
    contractAmount: String(contract.contract_amount),
    downPaymentAmount: String(contract.down_payment_amount),
    balancePaymentAmount: String(contract.balance_payment_amount),
    contractType: (CONTRACT_TYPES.includes(contract.contract_type as ContractType)
      ? contract.contract_type
      : "신규제작") as ContractType,
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
