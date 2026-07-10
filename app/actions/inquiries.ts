"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEFAULT_INQUIRY_STATUS, INQUIRY_STATUSES, type InquiryStatus } from "@/constants/inquiry";
import { requireAdmin } from "@/lib/admin/auth";
import { propagateCustomerId, resolveOrCreateCustomer, syncCustomerIdFromInquiry } from "@/lib/admin/customer-link";
import { createClient } from "@/lib/supabase/server";
import type { EstimateInquiryInsert } from "@/types/inquiry";
import type { EstimateFormData } from "@/types";
import {
  validateContactName,
  validateEmail,
  validatePhone,
  validateReferenceUrls,
  validateStep3,
  hasStep3Errors,
} from "@/lib/validation/estimate";

export type InquiryActionResult =
  | { success: true }
  | { success: false; error: string };

function mapFormToInsert(data: EstimateFormData): EstimateInquiryInsert {
  return {
    name: data.contact.trim(),
    phone: data.phone.trim(),
    email: data.email.trim() || null,
    company: data.company.trim() || null,
    business_type: data.businessType.trim() || null,
    budget: data.budget.trim() || null,
    schedule: data.schedule.trim() || null,
    pages: data.pages,
    features: data.features,
    reference: data.reference.trim() || null,
    message: data.notes.trim() || null,
  };
}

function validateInquiryPayload(data: EstimateFormData): string | null {
  const nameError = validateContactName(data.contact);
  if (nameError) return nameError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) return phoneError;

  if (data.email.trim()) {
    const emailError = validateEmail(data.email);
    if (emailError) return emailError;
  }

  const referenceError = validateReferenceUrls(data.reference);
  if (referenceError) return referenceError;

  const step3Errors = validateStep3(data.pages, data.features);
  if (hasStep3Errors(step3Errors)) {
    return step3Errors.pages ?? step3Errors.features ?? "요구사항을 확인해 주세요.";
  }

  return null;
}

export async function submitEstimateInquiry(
  data: EstimateFormData
): Promise<InquiryActionResult> {
  const validationError = validateInquiryPayload(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();
  const payload = mapFormToInsert(data);

  const customerId = await resolveOrCreateCustomer(supabase, {
    contact_name: payload.name,
    phone: payload.phone,
    email: payload.email,
    company: payload.company,
  });

  const { data: inserted, error } = await supabase
    .from("estimate_inquiries")
    .insert({
      ...payload,
      status: DEFAULT_INQUIRY_STATUS,
      customer_id: customerId,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: "문의 접수 중 오류가 발생했습니다." };
  }

  if (inserted?.id) {
    await propagateCustomerId(supabase, customerId, { inquiryId: inserted.id as string });
  }

  return { success: true };
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<InquiryActionResult> {
  await requireAdmin();

  if (!INQUIRY_STATUSES.includes(status)) {
    return { success: false, error: "유효하지 않은 상태입니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("estimate_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: "상태 변경 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return { success: true };
}

export async function updateInquiryAdminNote(
  id: string,
  adminNote: string
): Promise<InquiryActionResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("estimate_inquiries")
    .update({ admin_note: adminNote.trim() || null })
    .eq("id", id);

  if (error) {
    return { success: false, error: "메모 저장 중 오류가 발생했습니다." };
  }

  revalidatePath(`/admin/inquiries/${id}`);
  return { success: true };
}

export async function deleteInquiry(id: string): Promise<InquiryActionResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("estimate_inquiries").delete().eq("id", id);

  if (error) {
    return { success: false, error: "문의 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}

export async function createEstimateFromInquiry(
  inquiryId: string
): Promise<InquiryActionResult & { estimateId?: string }> {
  await requireAdmin();

  const estimateId = crypto.randomUUID();
  const supabase = await createClient();
  await syncCustomerIdFromInquiry(supabase, inquiryId);

  const { error } = await supabase
    .from("estimate_inquiries")
    .update({
      estimate_id: estimateId,
      estimate_created_at: new Date().toISOString(),
      status: "견적서작성",
    })
    .eq("id", inquiryId);

  if (error) {
    return { success: false, error: "견적서 저장 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  return { success: true, estimateId };
}
