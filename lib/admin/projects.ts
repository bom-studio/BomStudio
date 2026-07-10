import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { SavedProject } from "@/types/admin-project";

interface FetchProjectsParams {
  status?: string;
  q?: string;
}

function mapRowToSavedProject(row: Record<string, unknown>): SavedProject {
  return {
    id: row.id as string,
    inquiry_id: (row.inquiry_id as string | null) ?? null,
    estimate_id: (row.estimate_id as string | null) ?? null,
    contract_id: (row.contract_id as string | null) ?? null,
    project_number: row.project_number as string,
    project_title: (row.project_title as string | null) ?? null,
    customer_name: row.customer_name as string,
    company: (row.company as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    start_date: (row.start_date as string | null) ?? null,
    due_date: (row.due_date as string | null) ?? null,
    completed_at: (row.completed_at as string | null) ?? null,
    status: (row.status as string | null) ?? null,
    progress: Number(row.progress ?? 0),
    memo: (row.memo as string | null) ?? null,
    domain: (row.domain as string | null) ?? null,
    hosting: (row.hosting as string | null) ?? null,
    github_repo: (row.github_repo as string | null) ?? null,
    figma_url: (row.figma_url as string | null) ?? null,
    deployment_url: (row.deployment_url as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchProjects({
  status,
  q,
}: FetchProjectsParams = {}): Promise<SavedProject[]> {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "전체") {
    query = query.eq("status", status);
  }

  if (q?.trim()) {
    const term = q.trim().replace(/[%_]/g, "");
    const pattern = `%${term}%`;
    query = query.or(
      `project_number.ilike.${pattern},project_title.ilike.${pattern},customer_name.ilike.${pattern},phone.ilike.${pattern},company.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchProjects error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRowToSavedProject(row as Record<string, unknown>));
}

export async function fetchProjectCount(): Promise<number> {
  await requireAdmin();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("fetchProjectCount error:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchProjectById(id: string): Promise<SavedProject | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchProjectById error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRowToSavedProject(data as Record<string, unknown>);
}

export async function fetchProjectByContractId(
  contractId: string
): Promise<SavedProject | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("contract_id", contractId)
    .maybeSingle();

  if (error) {
    console.error("fetchProjectByContractId error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRowToSavedProject(data as Record<string, unknown>);
}
