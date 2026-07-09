import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { EstimateInquiry, AdjacentInquiryIds } from "@/types/inquiry";
import type { InquiryStatus } from "@/constants/inquiry";

interface FetchInquiriesParams {
  status?: string;
  q?: string;
}

export async function fetchInquiries({
  status,
  q,
}: FetchInquiriesParams = {}): Promise<EstimateInquiry[]> {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("estimate_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "전체") {
    query = query.eq("status", status as InquiryStatus);
  }

  if (q?.trim()) {
    const term = q.trim().replace(/[%_]/g, "");
    const pattern = `%${term}%`;
    query = query.or(
      `name.ilike.${pattern},phone.ilike.${pattern},company.ilike.${pattern},business_type.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchInquiries error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => normalizeInquiry(row as Record<string, unknown>));
}

export async function fetchInquiryById(id: string): Promise<EstimateInquiry | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimate_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchInquiryById error:", error.message, { id });
    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeInquiry(data as Record<string, unknown>);
}

function normalizeInquiry(row: Record<string, unknown>): EstimateInquiry {
  return {
    id: row.id as string,
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) ?? (row.created_at as string),
    inquiry_number: (row.inquiry_number as string | null) ?? null,
    name: row.name as string,
    phone: row.phone as string,
    email: (row.email as string | null) ?? null,
    company: (row.company as string | null) ?? null,
    business_type: (row.business_type as string | null) ?? null,
    budget: (row.budget as string | null) ?? null,
    schedule: (row.schedule as string | null) ?? null,
    pages: (row.pages as string[]) ?? [],
    features: (row.features as string[]) ?? [],
    reference: (row.reference as string | null) ?? null,
    message: (row.message as string | null) ?? null,
    admin_note: (row.admin_note as string | null) ?? null,
    status: row.status as EstimateInquiry["status"],
    estimate_id: (row.estimate_id as string | null) ?? null,
    contract_id: (row.contract_id as string | null) ?? null,
    project_id: (row.project_id as string | null) ?? null,
    last_contacted_at: (row.last_contacted_at as string | null) ?? null,
    estimate_created_at: (row.estimate_created_at as string | null) ?? null,
  };
}

export async function fetchInquiryCount(): Promise<number> {
  await requireAdmin();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("estimate_inquiries")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}

export async function fetchAdjacentInquiryIds(id: string): Promise<AdjacentInquiryIds> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimate_inquiries")
    .select("id")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return { prevId: null, nextId: null };
  }

  const index = data.findIndex((row) => row.id === id);
  if (index === -1) {
    return { prevId: null, nextId: null };
  }

  return {
    prevId: index > 0 ? data[index - 1].id : null,
    nextId: index < data.length - 1 ? data[index + 1].id : null,
  };
}
