import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { SavedContract } from "@/types/admin-contract";

interface FetchContractsParams {
  status?: string;
  q?: string;
}

function mapRowToSavedContract(row: Record<string, unknown>): SavedContract {
  const downPaymentPaid =
    row.down_payment_paid === true || row.down_payment_status === "입금완료";
  const balancePaymentPaid =
    row.balance_payment_paid === true || row.balance_payment_status === "입금완료";
  const customerSigned =
    row.customer_signed === true || row.signature_status === "서명완료";

  return {
    id: row.id as string,
    inquiry_id: (row.inquiry_id as string | null) ?? null,
    estimate_id: (row.estimate_id as string | null) ?? null,
    contract_number: row.contract_number as string,
    customer_name: row.customer_name as string,
    company: (row.company as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    project_title: (row.project_title as string | null) ?? null,
    contract_amount: Number(row.contract_amount ?? 0),
    down_payment_amount: Number(row.down_payment_amount ?? 0),
    balance_payment_amount: Number(row.balance_payment_amount ?? 0),
    contract_type: (row.contract_type as string) ?? "신규제작",
    billing_cycle: (row.billing_cycle as string) ?? "없음",
    start_date: (row.start_date as string | null) ?? null,
    end_date: (row.end_date as string | null) ?? null,
    contract_terms: (row.contract_terms as string | null) ?? null,
    special_terms: (row.special_terms as string | null) ?? null,
    status: (row.status as string | null) ?? null,
    memo: (row.memo as string | null) ?? null,
    down_payment_status: (row.down_payment_status as string | null) ?? null,
    balance_payment_status: (row.balance_payment_status as string | null) ?? null,
    signature_status: (row.signature_status as string | null) ?? null,
    down_payment_paid: downPaymentPaid,
    balance_payment_paid: balancePaymentPaid,
    down_payment_paid_at: (row.down_payment_paid_at as string | null) ?? null,
    balance_payment_paid_at: (row.balance_payment_paid_at as string | null) ?? null,
    customer_signed: customerSigned,
    studio_signed: row.studio_signed === true,
    signed_at: (row.signed_at as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchContracts({
  status,
  q,
}: FetchContractsParams = {}): Promise<SavedContract[]> {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "전체") {
    query = query.eq("status", status);
  }

  if (q?.trim()) {
    const term = q.trim().replace(/[%_]/g, "");
    const pattern = `%${term}%`;
    query = query.or(
      `contract_number.ilike.${pattern},customer_name.ilike.${pattern},phone.ilike.${pattern},company.ilike.${pattern},project_title.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchContracts error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRowToSavedContract(row as Record<string, unknown>));
}

export async function fetchContractCount(): Promise<number> {
  await requireAdmin();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contracts")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("fetchContractCount error:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchContractById(id: string): Promise<SavedContract | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchContractById error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRowToSavedContract(data as Record<string, unknown>);
}
