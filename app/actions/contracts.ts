"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BILLING_CYCLES,
  CONTRACT_TYPES,
  isContractStatus,
  type ContractStatus,
} from "@/constants/contract-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { buildProjectTitle } from "@/lib/admin/project-title";
import { fetchContractById, fetchContracts } from "@/lib/admin/contracts";
import { createClient } from "@/lib/supabase/server";
import { createPaymentsForContract } from "@/app/actions/payments";
import type {
  ContractMutationResult,
  CreateContractInput,
  SavedContract,
} from "@/types/admin-contract";

function validateContractInput(input: CreateContractInput): string | null {
  if (!input.contractNumber?.trim()) return "계약번호를 확인해 주세요.";
  if (!input.customerName?.trim()) return "고객명을 입력해 주세요.";
  if (!CONTRACT_TYPES.includes(input.contractType)) return "계약 유형을 확인해 주세요.";
  if (!BILLING_CYCLES.includes(input.billingCycle)) return "청구 주기를 확인해 주세요.";
  if (Math.round(input.contractAmount || 0) < 0) return "계약금액을 확인해 주세요.";
  return null;
}

function buildContractPayload(input: CreateContractInput) {
  return {
    inquiry_id: input.inquiryId || null,
    estimate_id: input.estimateId || null,
    contract_number: input.contractNumber.trim(),
    customer_name: input.customerName.trim(),
    company: input.company?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    project_title: buildProjectTitle(input.company, input.contractType) || null,
    contract_amount: Math.max(0, Math.round(input.contractAmount || 0)),
    down_payment_amount: Math.max(0, Math.round(input.downPaymentAmount || 0)),
    balance_payment_amount: Math.max(0, Math.round(input.balancePaymentAmount || 0)),
    contract_type: input.contractType,
    billing_cycle: input.billingCycle,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    contract_terms: input.contractTerms?.trim() || null,
    special_terms: input.specialTerms?.trim() || null,
    memo: input.memo?.trim() || null,
    status: "작성중",
  };
}

function revalidateContractPaths(contractId?: string, inquiryId?: string, estimateId?: string) {
  revalidatePath("/admin/contracts");
  if (contractId) revalidatePath(`/admin/contracts/${contractId}`);
  if (inquiryId) {
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiryId}`);
  }
  if (estimateId) {
    revalidatePath("/admin/estimates");
    revalidatePath(`/admin/estimates/${estimateId}`);
  }
}

export async function getContracts(params?: {
  status?: string;
  q?: string;
}): Promise<SavedContract[]> {
  return fetchContracts(params);
}

export async function getContractById(id: string): Promise<SavedContract | null> {
  return fetchContractById(id);
}

export async function createContract(
  input: CreateContractInput
): Promise<ContractMutationResult & { contractId?: string }> {
  await requireAdmin();

  const validationError = validateContractInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();
  const payload = buildContractPayload(input);

  const { data, error } = await supabase
    .from("contracts")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("createContract error:", error?.message, error);
    return { success: false, error: "계약서 저장 중 오류가 발생했습니다." };
  }

  const contractId = data.id as string;

  if (input.inquiryId) {
    const { error: inquiryError } = await supabase
      .from("estimate_inquiries")
      .update({
        contract_id: contractId,
        status: "계약완료",
      })
      .eq("id", input.inquiryId);

    if (inquiryError) {
      console.error("createContract inquiry update error:", inquiryError.message, inquiryError);
    }
  }

  if (input.estimateId) {
    const { error: estimateError } = await supabase
      .from("estimates")
      .update({ status: "계약완료" })
      .eq("id", input.estimateId);

    if (estimateError) {
      console.error("createContract estimate update error:", estimateError.message, estimateError);
    }
  }

  revalidateContractPaths(contractId, input.inquiryId, input.estimateId);
  redirect(`/admin/contracts/${contractId}`);
}

export async function updateContract(
  id: string,
  input: CreateContractInput
): Promise<ContractMutationResult & { contractId?: string }> {
  await requireAdmin();

  const validationError = validateContractInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();
  const payload = {
    ...buildContractPayload(input),
    status: undefined,
  };
  delete (payload as { status?: string }).status;

  const { error } = await supabase.from("contracts").update(payload).eq("id", id);

  if (error) {
    console.error("updateContract error:", error.message, error);
    return { success: false, error: "계약서 수정 중 오류가 발생했습니다." };
  }

  revalidateContractPaths(id, input.inquiryId, input.estimateId);
  return { success: true, contractId: id };
}

export async function updateContractStatus(
  id: string,
  status: ContractStatus
): Promise<ContractMutationResult> {
  await requireAdmin();

  if (!isContractStatus(status)) {
    return { success: false, error: "유효하지 않은 상태입니다." };
  }

  const contract = await fetchContractById(id);
  if (!contract) {
    return { success: false, error: "계약서를 찾을 수 없습니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contracts").update({ status }).eq("id", id);

  if (error) {
    console.error("updateContractStatus error:", error.message, error);
    return { success: false, error: "상태 변경 중 오류가 발생했습니다." };
  }

  if (status === "계약완료") {
    const paymentResult = await createPaymentsForContract(contract);
    if (!paymentResult.success) {
      console.error("updateContractStatus payment creation failed:", paymentResult.error);
    }
  }

  revalidateContractPaths(id, contract.inquiry_id ?? undefined, contract.estimate_id ?? undefined);
  return { success: true };
}

export async function deleteContract(id: string): Promise<ContractMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  const contract = await fetchContractById(id);

  const { error: unlinkError } = await supabase
    .from("estimate_inquiries")
    .update({ contract_id: null })
    .eq("contract_id", id);

  if (unlinkError) {
    console.error("deleteContract unlink error:", unlinkError.message, unlinkError);
  }

  const { error } = await supabase.from("contracts").delete().eq("id", id);

  if (error) {
    console.error("deleteContract error:", error.message, error);
    return { success: false, error: "계약서 삭제 중 오류가 발생했습니다." };
  }

  revalidateContractPaths(id, contract?.inquiry_id ?? undefined, contract?.estimate_id ?? undefined);
  redirect("/admin/contracts");
}
