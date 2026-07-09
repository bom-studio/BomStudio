import { BRAND } from "@/constants/brand";
import { CONTACT_ITEMS } from "@/constants/contact";
import {
  displayContractValue,
  formatContractPeriod,
} from "@/lib/admin/contract-display";
import { formatEstimateDate } from "@/lib/admin/estimate-display";
import type { SavedContract } from "@/types/admin-contract";
import type { SavedEstimate } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";

export interface ContractDocumentView {
  contractNumber: string;
  issuedDate: string;
  supplier: {
    name: string;
    nameKo: string;
    representative: string;
    phone: string;
    email: string;
  };
  customer: {
    company: string;
    name: string;
    phone: string;
    email: string;
  };
  project: {
    title: string;
    period: string;
    contractType: string;
  };
  amounts: {
    total: number;
    downPayment: number;
    balance: number;
    vatType: string | null;
  };
  terms: string[];
  specialTerms: string | null;
}

function supplierContact() {
  const phone = CONTACT_ITEMS.find((item) => item.type === "전화")?.value ?? "-";
  const email = CONTACT_ITEMS.find((item) => item.type === "이메일")?.value ?? "-";
  return { phone, email };
}

export function parseContractTerms(text: string | null | undefined): string[] {
  if (!text?.trim()) return [];

  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s\-•*]+/, "").replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);
}

function resolveProductionPeriod(
  contract: SavedContract,
  estimate?: SavedEstimate | null
): string {
  const period = formatContractPeriod(contract.start_date, contract.end_date);
  if (period !== "-") return period;
  return displayContractValue(estimate?.delivery_period);
}

export function buildContractDocumentView({
  contract,
  estimate,
  inquiry,
}: {
  contract: SavedContract;
  estimate?: SavedEstimate | null;
  inquiry?: EstimateInquiry | null;
}): ContractDocumentView {
  const contact = supplierContact();

  return {
    contractNumber: contract.contract_number,
    issuedDate: formatEstimateDate(contract.created_at),
    supplier: {
      name: BRAND.name,
      nameKo: BRAND.nameKo,
      representative: "허보미",
      phone: contact.phone,
      email: contact.email,
    },
    customer: {
      company: displayContractValue(contract.company ?? inquiry?.company),
      name: displayContractValue(contract.customer_name ?? inquiry?.name),
      phone: displayContractValue(contract.phone ?? inquiry?.phone),
      email: displayContractValue(contract.email ?? inquiry?.email),
    },
    project: {
      title: displayContractValue(contract.project_title ?? estimate?.request_summary?.split("\n")[0]),
      period: resolveProductionPeriod(contract, estimate),
      contractType: displayContractValue(contract.contract_type),
    },
    amounts: {
      total: contract.contract_amount,
      downPayment: contract.down_payment_amount,
      balance: contract.balance_payment_amount,
      vatType: estimate?.vat_type ?? null,
    },
    terms: parseContractTerms(contract.contract_terms),
    specialTerms: contract.special_terms?.trim() || null,
  };
}
