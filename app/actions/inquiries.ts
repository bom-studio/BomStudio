"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEFAULT_INQUIRY_STATUS, INQUIRY_STATUSES, type InquiryStatus } from "@/constants/inquiry";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { EstimateInquiryInsert } from "@/types/inquiry";
import type { EstimateFormData } from "@/types";
import {
  validateContactName,
  validateEmail,
  validatePhone,
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
    business_type: null,
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

  const { error } = await supabase.from("estimate_inquiries").insert({
    ...payload,
    status: DEFAULT_INQUIRY_STATUS,
  });

  if (error) {
    console.error("submitEstimateInquiry error:", error.message);
    return { success: false, error: "문의 접수 중 오류가 발생했습니다." };
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

export async function loginAdmin(
  email: string,
  password: string
): Promise<InquiryActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user?.email) {
    return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const userEmail = data.user.email.toLowerCase();
  const adminEmail = getAdminEmail();

  if (adminEmail && userEmail !== adminEmail) {
    await supabase.auth.signOut();
    return { success: false, error: "관리자 권한이 없는 계정입니다." };
  }

  const { data: adminRow } = await supabase
    .from("admin_emails")
    .select("email")
    .ilike("email", userEmail)
    .maybeSingle();

  if (!adminRow && adminEmail && userEmail !== adminEmail) {
    await supabase.auth.signOut();
    return { success: false, error: "관리자 권한이 없는 계정입니다." };
  }

  redirect("/admin/inquiries");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
