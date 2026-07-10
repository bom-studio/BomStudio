import type { SavedContract } from "@/types/admin-contract";

export function generatePaymentNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 0xfff)
    .toString(16)
    .toUpperCase()
    .padStart(3, "0")
    .slice(-3);
  return `PAY-${y}${m}${d}-${random}`;
}

export function buildPaymentRowsFromContract(
  contract: SavedContract & { id: string },
  options?: { projectId?: string | null }
) {
  const base = {
    inquiry_id: contract.inquiry_id,
    estimate_id: contract.estimate_id,
    contract_id: contract.id,
    project_id: options?.projectId ?? null,
    customer_id: contract.customer_id ?? null,
    customer_name: contract.customer_name,
    company: contract.company,
    phone: contract.phone,
    email: contract.email,
    contract_number: contract.contract_number,
    project_title: contract.project_title,
  };

  return [
    {
      ...base,
      payment_number: `${generatePaymentNumber()}-D`,
      payment_type: "계약금" as const,
      amount: contract.down_payment_amount,
      due_date: contract.start_date,
      status: "입금대기",
    },
    {
      ...base,
      payment_number: `${generatePaymentNumber()}-B`,
      payment_type: "잔금" as const,
      amount: contract.balance_payment_amount,
      due_date: contract.end_date,
      status: "입금대기",
    },
  ];
}
