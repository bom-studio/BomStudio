import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { EstimateInquiry } from "@/types/inquiry";
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

  return (data ?? []) as EstimateInquiry[];
}

export async function fetchInquiryById(id: string): Promise<EstimateInquiry | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimate_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as EstimateInquiry;
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
