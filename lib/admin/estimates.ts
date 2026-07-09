import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { EstimateItem, SavedEstimate, VatType } from "@/types/admin-estimate";

interface FetchEstimatesParams {
  status?: string;
  q?: string;
}

function mapRowToSavedEstimate(row: Record<string, unknown>): SavedEstimate {
  return {
    id: row.id as string,
    inquiry_id: row.inquiry_id as string,
    estimate_number: row.estimate_number as string,
    customer_name: row.customer_name as string,
    company: (row.company as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    business_type: (row.business_type as string | null) ?? null,
    items: (row.items as EstimateItem[]) ?? [],
    subtotal: Number(row.subtotal ?? 0),
    vat: Number(row.vat ?? 0),
    total: Number(row.total ?? 0),
    vat_type: (row.vat_type as VatType | null) ?? null,
    payment_terms: (row.payment_terms as string | null) ?? null,
    delivery_period: (row.delivery_period as string | null) ?? null,
    valid_until: (row.valid_until as string | null) ?? null,
    request_summary: (row.request_summary as string | null) ?? null,
    reference_urls: (row.reference_urls as string | null) ?? null,
    memo: (row.memo as string | null) ?? null,
    status: (row.status as string | null) ?? null,
    form_snapshot: (row.form_snapshot as SavedEstimate["form_snapshot"]) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchEstimates({
  status,
  q,
}: FetchEstimatesParams = {}): Promise<SavedEstimate[]> {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("estimates")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "전체") {
    query = query.eq("status", status);
  }

  if (q?.trim()) {
    const term = q.trim().replace(/[%_]/g, "");
    const pattern = `%${term}%`;
    query = query.or(
      `estimate_number.ilike.${pattern},customer_name.ilike.${pattern},phone.ilike.${pattern},company.ilike.${pattern},business_type.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchEstimates error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRowToSavedEstimate(row as Record<string, unknown>));
}

export async function fetchEstimateCount(): Promise<number> {
  await requireAdmin();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("estimates")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("fetchEstimateCount error:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchEstimateById(id: string): Promise<SavedEstimate | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchEstimateById error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRowToSavedEstimate(data as Record<string, unknown>);
}
