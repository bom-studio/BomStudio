import { requireAdmin } from "@/lib/admin/auth";
import { getPaymentPeriodRange } from "@/lib/admin/payment-display";
import { createClient } from "@/lib/supabase/server";
import type {
  FetchPaymentsParams,
  MonthlyPaymentSummary,
  SavedPayment,
} from "@/types/admin-payment";

function mapRowToSavedPayment(row: Record<string, unknown>): SavedPayment {
  return {
    id: row.id as string,
    payment_number: row.payment_number as string,
    contract_id: (row.contract_id as string | null) ?? null,
    inquiry_id: (row.inquiry_id as string | null) ?? null,
    estimate_id: (row.estimate_id as string | null) ?? null,
    project_id: (row.project_id as string | null) ?? null,
    customer_name: row.customer_name as string,
    company: (row.company as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    contract_number: (row.contract_number as string | null) ?? null,
    project_title: (row.project_title as string | null) ?? null,
    payment_type: row.payment_type as string,
    amount: Number(row.amount ?? 0),
    status: row.status as string,
    due_date: (row.due_date as string | null) ?? null,
    paid_at: (row.paid_at as string | null) ?? null,
    payment_method: (row.payment_method as string | null) ?? null,
    depositor_name: (row.depositor_name as string | null) ?? null,
    memo: (row.memo as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchPayments({
  status,
  period = "이번달",
  q,
}: FetchPaymentsParams = {}): Promise<SavedPayment[]> {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase.from("payments").select("*").order("created_at", { ascending: false });

  if (status && status !== "전체") {
    query = query.eq("status", status);
  }

  if (q?.trim()) {
    const term = q.trim().replace(/[%_]/g, "");
    const pattern = `%${term}%`;
    query = query.or(
      `customer_name.ilike.${pattern},company.ilike.${pattern},contract_number.ilike.${pattern},payment_number.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchPayments error:", error.message);
    return [];
  }

  let payments = (data ?? []).map((row) => mapRowToSavedPayment(row as Record<string, unknown>));

  if (period && period !== "전체") {
    const { start, end } = getPaymentPeriodRange(period);
    if (start && end) {
      const startMs = new Date(start).getTime();
      const endMs = new Date(end).getTime();
      payments = payments.filter((payment) => {
        const dateValue = payment.paid_at || payment.due_date || payment.created_at;
        const ms = new Date(dateValue).getTime();
        return ms >= startMs && ms < endMs;
      });
    }
  }

  return payments;
}

export async function fetchPaymentCount(): Promise<number> {
  await requireAdmin();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("fetchPaymentCount error:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchPaymentById(id: string): Promise<SavedPayment | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("payments").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("fetchPaymentById error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRowToSavedPayment(data as Record<string, unknown>);
}

export async function hasPaymentsForContract(contractId: string): Promise<boolean> {
  await requireAdmin();
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("contract_id", contractId);

  if (error) {
    console.error("hasPaymentsForContract error:", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}

export async function getMonthlyPaymentSummary(
  period: string = "이번달"
): Promise<MonthlyPaymentSummary> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: paidData, error: paidError } = await supabase
    .from("payments")
    .select("payment_type, amount, status, paid_at, created_at")
    .eq("status", "입금완료");

  if (paidError) {
    console.error("getMonthlyPaymentSummary paid error:", paidError.message);
  }

  const { start, end } = getPaymentPeriodRange(period);
  const startMs = start ? new Date(start).getTime() : null;
  const endMs = end ? new Date(end).getTime() : null;

  const summary: MonthlyPaymentSummary = {
    downPayment: 0,
    balancePayment: 0,
    maintenance: 0,
    totalRevenue: 0,
    unpaidAmount: 0,
  };

  for (const row of paidData ?? []) {
    const dateValue = (row.paid_at as string | null) || (row.created_at as string);
    if (startMs !== null && endMs !== null) {
      const ms = new Date(dateValue).getTime();
      if (ms < startMs || ms >= endMs) continue;
    }

    const amount = Number(row.amount ?? 0);
    summary.totalRevenue += amount;

    switch (row.payment_type) {
      case "계약금":
        summary.downPayment += amount;
        break;
      case "잔금":
        summary.balancePayment += amount;
        break;
      case "유지보수":
        summary.maintenance += amount;
        break;
      default:
        break;
    }
  }

  const { data: unpaidData, error: unpaidError } = await supabase
    .from("payments")
    .select("amount, status")
    .not("status", "in", '("입금완료","환불")');

  if (unpaidError) {
    console.error("getMonthlyPaymentSummary unpaid error:", unpaidError.message);
  } else {
    summary.unpaidAmount = (unpaidData ?? []).reduce(
      (sum, row) => sum + Number(row.amount ?? 0),
      0
    );
  }

  return summary;
}

export function paymentsToCsvRows(payments: SavedPayment[]): string {
  const header = [
    "결제번호",
    "결제일",
    "고객명",
    "회사명",
    "계약번호",
    "결제유형",
    "금액",
    "상태",
    "결제수단",
    "입금자명",
  ].join(",");

  const rows = payments.map((payment) => {
    const date = payment.paid_at || payment.due_date || payment.created_at;
    const values = [
      payment.payment_number,
      date ? new Date(date).toLocaleDateString("ko-KR") : "-",
      payment.customer_name,
      payment.company || "-",
      payment.contract_number || "-",
      payment.payment_type,
      String(payment.amount),
      payment.status,
      payment.payment_method || "-",
      payment.depositor_name || "-",
    ];
    return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
  });

  return [header, ...rows].join("\n");
}
