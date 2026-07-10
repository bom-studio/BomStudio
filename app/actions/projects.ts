"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isProjectStatus, type ProjectStatus } from "@/constants/project-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { fetchActivityLogsByProjectId } from "@/lib/admin/activity-logs";
import {
  fetchProjectByContractId,
  fetchProjectById,
  fetchProjects,
} from "@/lib/admin/projects";
import { syncCustomerIdFromInquiry, propagateCustomerId } from "@/lib/admin/customer-link";
import { clampProgress } from "@/lib/admin/project-form";
import { buildProjectTitle } from "@/lib/admin/project-title";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivityLog,
  CreateProjectInput,
  ProjectMutationResult,
  SavedProject,
} from "@/types/admin-project";

interface CreateActivityLogInput {
  projectId?: string;
  contractId?: string;
  inquiryId?: string;
  estimateId?: string;
  type: string;
  content: string;
}

function validateProjectInput(input: CreateProjectInput): string | null {
  if (!input.projectNumber?.trim()) return "프로젝트 번호를 확인해 주세요.";
  if (!input.customerName?.trim()) return "고객명을 입력해 주세요.";
  if (!isProjectStatus(input.status)) return "진행 상태를 확인해 주세요.";
  if (clampProgress(input.progress) < 0 || clampProgress(input.progress) > 100) {
    return "진행률은 0~100 사이여야 합니다.";
  }
  return null;
}

function buildProjectPayload(input: CreateProjectInput) {
  return {
    inquiry_id: input.inquiryId || null,
    estimate_id: input.estimateId || null,
    contract_id: input.contractId || null,
    project_number: input.projectNumber.trim(),
    project_title: buildProjectTitle(input.company, input.contractType) || null,
    customer_name: input.customerName.trim(),
    company: input.company?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    start_date: input.startDate || null,
    due_date: input.dueDate || null,
    status: input.status,
    progress: clampProgress(input.progress),
    domain: input.domain?.trim() || "",
    hosting: input.hosting?.trim() || "",
    github_repo: input.githubRepo?.trim() || "",
    figma_url: input.figmaUrl?.trim() || "",
    deployment_url: input.deploymentUrl?.trim() || "",
    memo: input.memo?.trim() || null,
  };
}

function revalidateProjectPaths(
  projectId?: string,
  contractId?: string,
  inquiryId?: string,
  estimateId?: string
) {
  revalidatePath("/admin/projects");
  if (projectId) revalidatePath(`/admin/projects/${projectId}`);
  if (contractId) {
    revalidatePath("/admin/contracts");
    revalidatePath(`/admin/contracts/${contractId}`);
  }
  if (inquiryId) {
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiryId}`);
  }
  if (estimateId) {
    revalidatePath("/admin/estimates");
    revalidatePath(`/admin/estimates/${estimateId}`);
  }
}

export async function createActivityLog(
  input: CreateActivityLogInput
): Promise<ProjectMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("activity_logs").insert({
    project_id: input.projectId || null,
    contract_id: input.contractId || null,
    inquiry_id: input.inquiryId || null,
    estimate_id: input.estimateId || null,
    type: input.type,
    content: input.content,
  });

  if (error) {
    console.error("createActivityLog error:", error.message, error);
    return { success: false, error: "활동 로그 저장 중 오류가 발생했습니다." };
  }

  if (input.projectId) {
    revalidatePath(`/admin/projects/${input.projectId}`);
  }

  return { success: true };
}

export async function getActivityLogsByProjectId(
  projectId: string
): Promise<ActivityLog[]> {
  return fetchActivityLogsByProjectId(projectId);
}

export async function getProjects(params?: {
  status?: string;
  q?: string;
}): Promise<SavedProject[]> {
  return fetchProjects(params);
}

export async function getProjectById(id: string): Promise<SavedProject | null> {
  return fetchProjectById(id);
}

export async function getProjectByContractId(
  contractId: string
): Promise<SavedProject | null> {
  return fetchProjectByContractId(contractId);
}

export async function createProject(
  input: CreateProjectInput
): Promise<ProjectMutationResult> {
  await requireAdmin();

  const validationError = validateProjectInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  if (input.contractId) {
    const existing = await fetchProjectByContractId(input.contractId);
    if (existing) {
      redirect(`/admin/projects/${existing.id}`);
    }
  }

  const supabase = await createClient();
  const payload = buildProjectPayload(input);

  let customerId: string | null = null;
  if (input.inquiryId) {
    customerId = await syncCustomerIdFromInquiry(supabase, input.inquiryId);
  } else if (input.contractId) {
    const { data: contract } = await supabase
      .from("contracts")
      .select("customer_id, inquiry_id")
      .eq("id", input.contractId)
      .maybeSingle();
    customerId = (contract?.customer_id as string | null) ?? null;
    if (!customerId && contract?.inquiry_id) {
      customerId = await syncCustomerIdFromInquiry(supabase, contract.inquiry_id as string);
    }
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...payload, customer_id: customerId })
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("createProject error:", error?.message, error);
    return { success: false, error: "프로젝트 생성 중 오류가 발생했습니다." };
  }

  const projectId = data.id as string;

  if (customerId) {
    await propagateCustomerId(supabase, customerId, {
      projectId,
      contractId: input.contractId,
      inquiryId: input.inquiryId,
      estimateId: input.estimateId,
    });
  }

  if (input.contractId) {
    const { error: paymentLinkError } = await supabase
      .from("payments")
      .update({ project_id: projectId })
      .eq("contract_id", input.contractId);

    if (paymentLinkError) {
      console.error("createProject payment link error:", paymentLinkError.message, paymentLinkError);
    }

    const { error: contractError } = await supabase
      .from("contracts")
      .update({ status: "진행중" })
      .eq("id", input.contractId);

    if (contractError) {
      console.error("createProject contract update error:", contractError.message, contractError);
    }
  }

  if (input.inquiryId) {
    const { error: inquiryError } = await supabase
      .from("estimate_inquiries")
      .update({
        project_id: projectId,
        status: "작업중",
      })
      .eq("id", input.inquiryId);

    if (inquiryError) {
      console.error("createProject inquiry update error:", inquiryError.message, inquiryError);
    }
  }

  await createActivityLog({
    projectId,
    contractId: input.contractId,
    inquiryId: input.inquiryId,
    estimateId: input.estimateId,
    type: "작업",
    content: "계약서를 기반으로 프로젝트가 생성되었습니다.",
  });

  revalidateProjectPaths(
    projectId,
    input.contractId,
    input.inquiryId,
    input.estimateId
  );
  return { success: true, projectId };
}

export async function updateProject(
  id: string,
  input: CreateProjectInput
): Promise<ProjectMutationResult & { projectId?: string }> {
  await requireAdmin();

  const validationError = validateProjectInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();
  const payload = buildProjectPayload(input);

  const { error } = await supabase.from("projects").update(payload).eq("id", id);

  if (error) {
    console.error("updateProject error:", error.message, error);
    return { success: false, error: "프로젝트 수정 중 오류가 발생했습니다." };
  }

  revalidateProjectPaths(
    id,
    input.contractId,
    input.inquiryId,
    input.estimateId
  );
  return { success: true, projectId: id };
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus,
  progress?: number
): Promise<ProjectMutationResult> {
  await requireAdmin();

  if (!isProjectStatus(status)) {
    return { success: false, error: "유효하지 않은 상태입니다." };
  }

  const supabase = await createClient();
  const project = await fetchProjectById(id);
  if (!project) {
    return { success: false, error: "프로젝트를 찾을 수 없습니다." };
  }

  const nextProgress =
    progress !== undefined ? clampProgress(progress) : project.progress;

  const { error } = await supabase
    .from("projects")
    .update({ status, progress: nextProgress })
    .eq("id", id);

  if (error) {
    console.error("updateProjectStatus error:", error.message, error);
    return { success: false, error: "상태 변경 중 오류가 발생했습니다." };
  }

  await createActivityLog({
    projectId: id,
    contractId: project.contract_id ?? undefined,
    inquiryId: project.inquiry_id ?? undefined,
    estimateId: project.estimate_id ?? undefined,
    type: "상태변경",
    content: `프로젝트 상태가 "${status}"(으)로 변경되었습니다.`,
  });

  revalidateProjectPaths(
    id,
    project.contract_id ?? undefined,
    project.inquiry_id ?? undefined,
    project.estimate_id ?? undefined
  );
  return { success: true };
}

export async function completeProject(id: string): Promise<ProjectMutationResult> {
  await requireAdmin();
  const supabase = await createClient();
  const project = await fetchProjectById(id);

  if (!project) {
    return { success: false, error: "프로젝트를 찾을 수 없습니다." };
  }

  const completedAt = new Date().toISOString();

  const { error } = await supabase
    .from("projects")
    .update({
      status: "완료",
      progress: 100,
      completed_at: completedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("completeProject error:", error.message, error);
    return { success: false, error: "프로젝트 완료 처리 중 오류가 발생했습니다." };
  }

  if (project.contract_id) {
    const { error: contractError } = await supabase
      .from("contracts")
      .update({ status: "종료" })
      .eq("id", project.contract_id);

    if (contractError) {
      console.error("completeProject contract update error:", contractError.message, contractError);
    }
  }

  if (project.inquiry_id) {
    const { error: inquiryError } = await supabase
      .from("estimate_inquiries")
      .update({ status: "완료" })
      .eq("id", project.inquiry_id);

    if (inquiryError) {
      console.error("completeProject inquiry update error:", inquiryError.message, inquiryError);
    }
  }

  await createActivityLog({
    projectId: id,
    contractId: project.contract_id ?? undefined,
    inquiryId: project.inquiry_id ?? undefined,
    estimateId: project.estimate_id ?? undefined,
    type: "완료",
    content: "프로젝트가 완료 처리되었습니다.",
  });

  revalidateProjectPaths(
    id,
    project.contract_id ?? undefined,
    project.inquiry_id ?? undefined,
    project.estimate_id ?? undefined
  );
  return { success: true };
}

export async function deleteProject(id: string): Promise<ProjectMutationResult> {
  await requireAdmin();
  const supabase = await createClient();
  const project = await fetchProjectById(id);

  if (!project) {
    return { success: false, error: "프로젝트를 찾을 수 없습니다." };
  }

  const { error: unlinkError } = await supabase
    .from("estimate_inquiries")
    .update({ project_id: null })
    .eq("project_id", id);

  if (unlinkError) {
    console.error("deleteProject unlink error:", unlinkError.message, unlinkError);
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("deleteProject error:", error.message, error);
    return { success: false, error: "프로젝트 삭제 중 오류가 발생했습니다." };
  }

  revalidateProjectPaths(
    id,
    project.contract_id ?? undefined,
    project.inquiry_id ?? undefined,
    project.estimate_id ?? undefined
  );
  redirect("/admin/projects");
}
