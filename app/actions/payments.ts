"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isPaymentStatus, type PaymentStatus } from "@/constants/payment-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { fetchActivityLogsByPaymentId } from "@/lib/admin/activity-logs";
import { fetchProjectByContractId } from "@/lib/admin/projects";
import {
  fetchPaymentById,
  fetchPaymentCount,
  fetchPayments,
  getMonthlyPaymentSummary,
  hasPaymentsForContract,
  paymentsToCsvRows,
} from "@/lib/admin/payments";
import { buildPaymentRowsFromContract } from "@/lib/admin/payment-form";
import { createClient } from "@/lib/supabase/server";
import type { ActivityLog } from "@/types/admin-project";
import type {
  FetchPaymentsParams,
  MonthlyPaymentSummary,
  PaymentMutationResult,
  SavedPayment,
} from "@/types/admin-payment";
import type { SavedContract } from "@/types/admin-contract";

function revalidatePaymentPaths(
  paymentId?: string,
  contractId?: string,
  projectId?: string,
  inquiryId?: string,
  estimateId?: string
) {
  revalidatePath("/admin/payments");
  if (paymentId) revalidatePath(`/admin/payments/${paymentId}`);
  if (contractId) {
    revalidatePath("/admin/contracts");
    revalidatePath(`/admin/contracts/${contractId}`);
  }
  if (projectId) {
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${projectId}`);
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

async function createPaymentActivityLog(input: {
  paymentId: string;
  contractId?: string | null;
  projectId?: string | null;
  inquiryId?: string | null;
  estimateId?: string | null;
  type: string;
  content: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("activity_logs").insert({
    payment_id: input.paymentId,
    contract_id: input.contractId || null,
    project_id: input.projectId || null,
    inquiry_id: input.inquiryId || null,
    estimate_id: input.estimateId || null,
    type: input.type,
    content: input.content,
  });

  if (error) {
    console.error("createPaymentActivityLog error:", error.message, error);
  }
}

async function syncContractOnPaymentComplete(
  payment: SavedPayment,
  completed: boolean
) {
  if (!payment.contract_id) return null;

  const supabase = await createClient();
  const now = new Date().toISOString();
  let projectId: string | null = payment.project_id;

  if (payment.payment_type === "계약금") {
    const { error } = await supabase
      .from("contracts")
      .update({
        down_payment_paid: completed,
        down_payment_status: completed ? "입금완료" : "미납",
        down_payment_paid_at: completed ? now : null,
      })
      .eq("id", payment.contract_id);

    if (error) {
      console.error("syncContract down payment error:", error.message, error);
    }
  }

  if (payment.payment_type === "잔금") {
    const { error } = await supabase
      .from("contracts")
      .update({
        balance_payment_paid: completed,
        balance_payment_status: completed ? "입금완료" : "미납",
        balance_payment_paid_at: completed ? now : null,
      })
      .eq("id", payment.contract_id);

    if (error) {
      console.error("syncContract balance payment error:", error.message, error);
    }

    if (completed) {
      const project = await fetchProjectByContractId(payment.contract_id);
      if (project) {
        projectId = project.id;
        const { error: projectError } = await supabase
          .from("projects")
          .update({
            status: "완료",
            progress: 100,
            completed_at: now,
          })
          .eq("id", project.id);

        if (projectError) {
          console.error("syncContract project complete error:", projectError.message, projectError);
        } else {
          await createPaymentActivityLog({
            paymentId: payment.id,
            contractId: payment.contract_id,
            projectId: project.id,
            inquiryId: project.inquiry_id,
            estimateId: project.estimate_id,
            type: "완료",
            content: "잔금 입금 완료로 프로젝트 완료 처리되었습니다.",
          });

          if (project.inquiry_id) {
            await supabase
              .from("estimate_inquiries")
              .update({ status: "완료" })
              .eq("id", project.inquiry_id);
          }
        }
      }
    }
  }

  return projectId;
}

export async function getPayments(params?: FetchPaymentsParams): Promise<SavedPayment[]> {
  return fetchPayments(params);
}

export async function getPaymentById(id: string): Promise<SavedPayment | null> {
  return fetchPaymentById(id);
}

export async function getPaymentsCount(): Promise<number> {
  return fetchPaymentCount();
}

export async function getPaymentSummary(
  period?: string
): Promise<MonthlyPaymentSummary> {
  return getMonthlyPaymentSummary(period || "이번달");
}

export async function getPaymentActivityLogs(paymentId: string): Promise<ActivityLog[]> {
  return fetchActivityLogsByPaymentId(paymentId);
}

export async function getPaymentsCsv(params?: FetchPaymentsParams): Promise<string> {
  const payments = await fetchPayments(params);
  return paymentsToCsvRows(payments);
}

export async function createPaymentsForContract(
  contract: SavedContract
): Promise<PaymentMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  const alreadyExists = await hasPaymentsForContract(contract.id);
  if (alreadyExists) {
    return { success: true };
  }

  const project = contract.id ? await fetchProjectByContractId(contract.id) : null;
  const rows = buildPaymentRowsFromContract(contract, { projectId: project?.id ?? null });

  const { data, error } = await supabase
    .from("payments")
    .insert(rows)
    .select("id, payment_type");

  if (error) {
    console.error("createPaymentsForContract error:", error.message, error);
    return { success: false, error: "결제 정보 생성 중 오류가 발생했습니다." };
  }

  const logContentByType: Record<string, string> = {
    계약금: "계약금 결제 정보가 생성되었습니다.",
    잔금: "잔금 결제 정보가 생성되었습니다.",
  };

  for (const payment of data ?? []) {
    const paymentType = payment.payment_type as string;
    await createPaymentActivityLog({
      paymentId: payment.id as string,
      contractId: contract.id,
      projectId: project?.id ?? null,
      inquiryId: contract.inquiry_id,
      estimateId: contract.estimate_id,
      type: "결제",
      content: logContentByType[paymentType] ?? `${paymentType} 결제 정보가 생성되었습니다.`,
    });
  }

  revalidatePaymentPaths(
    undefined,
    contract.id,
    project?.id ?? undefined,
    contract.inquiry_id ?? undefined,
    contract.estimate_id ?? undefined
  );

  return { success: true };
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<PaymentMutationResult> {
  await requireAdmin();

  if (!isPaymentStatus(status)) {
    return { success: false, error: "유효하지 않은 상태입니다." };
  }

  const payment = await fetchPaymentById(id);
  if (!payment) {
    return { success: false, error: "결제 내역을 찾을 수 없습니다." };
  }

  const supabase = await createClient();
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = { status };

  if (status === "입금완료") {
    payload.paid_at = payment.paid_at || now;
  }

  const { error } = await supabase.from("payments").update(payload).eq("id", id);

  if (error) {
    console.error("updatePaymentStatus error:", error.message, error);
    return { success: false, error: "결제 상태 변경 중 오류가 발생했습니다." };
  }

  let projectId = payment.project_id;

  if (status === "입금완료") {
    const syncedProjectId = await syncContractOnPaymentComplete(payment, true);
    if (syncedProjectId) projectId = syncedProjectId;

    await createPaymentActivityLog({
      paymentId: id,
      contractId: payment.contract_id,
      projectId,
      inquiryId: payment.inquiry_id,
      estimateId: payment.estimate_id,
      type: "결제",
      content: "결제 상태를 입금완료로 변경했습니다.",
    });
  } else {
    await createPaymentActivityLog({
      paymentId: id,
      contractId: payment.contract_id,
      projectId,
      inquiryId: payment.inquiry_id,
      estimateId: payment.estimate_id,
      type: "결제",
      content: `결제 상태를 "${status}"(으)로 변경했습니다.`,
    });
  }

  revalidatePaymentPaths(
    id,
    payment.contract_id ?? undefined,
    projectId ?? undefined,
    payment.inquiry_id ?? undefined,
    payment.estimate_id ?? undefined
  );

  return { success: true };
}

export async function deletePayment(id: string): Promise<PaymentMutationResult> {
  await requireAdmin();
  const payment = await fetchPaymentById(id);

  if (!payment) {
    return { success: false, error: "결제 내역을 찾을 수 없습니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) {
    console.error("deletePayment error:", error.message, error);
    return { success: false, error: "결제 내역 삭제 중 오류가 발생했습니다." };
  }

  revalidatePaymentPaths(
    id,
    payment.contract_id ?? undefined,
    payment.project_id ?? undefined,
    payment.inquiry_id ?? undefined,
    payment.estimate_id ?? undefined
  );

  redirect("/admin/payments");
}
