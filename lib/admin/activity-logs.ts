import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActivityLog } from "@/types/admin-project";

function mapRowToActivityLog(row: Record<string, unknown>): ActivityLog {
  return {
    id: row.id as string,
    project_id: (row.project_id as string | null) ?? null,
    contract_id: (row.contract_id as string | null) ?? null,
    inquiry_id: (row.inquiry_id as string | null) ?? null,
    estimate_id: (row.estimate_id as string | null) ?? null,
    payment_id: (row.payment_id as string | null) ?? null,
    type: row.type as string,
    content: row.content as string,
    created_at: row.created_at as string,
  };
}

export async function fetchActivityLogsByProjectId(
  projectId: string
): Promise<ActivityLog[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchActivityLogsByProjectId error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRowToActivityLog(row as Record<string, unknown>));
}

export async function fetchActivityLogsByPaymentId(
  paymentId: string
): Promise<ActivityLog[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("payment_id", paymentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchActivityLogsByPaymentId error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRowToActivityLog(row as Record<string, unknown>));
}
