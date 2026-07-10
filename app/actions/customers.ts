"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ALLOWED_ATTACHMENT_MIME_TYPES,
  CONSULTATION_TYPES,
  CUSTOMER_STATUSES,
  isCustomerStatus,
} from "@/constants/customer-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { findCustomerByContact, propagateCustomerId, resolveOrCreateCustomer, syncCustomerIdFromInquiry } from "@/lib/admin/customer-link";
import { fetchCustomerById, fetchCustomers } from "@/lib/admin/customers";
import { createClient } from "@/lib/supabase/server";
import type {
  CreateConsultationInput,
  CreateCustomerInput,
  CustomerMutationResult,
  UpdateCustomerInput,
} from "@/types/admin-customer";

export async function getCustomers(params?: Parameters<typeof fetchCustomers>[0]) {
  return fetchCustomers(params);
}

export async function getCustomerById(id: string) {
  return fetchCustomerById(id);
}

function revalidateCustomerPaths(customerId?: string) {
  revalidatePath("/admin/customers");
  if (customerId) revalidatePath(`/admin/customers/${customerId}`);
}

export async function createCustomer(input: CreateCustomerInput): Promise<CustomerMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  if (!input.contact_name?.trim()) return { success: false, error: "담당자명을 입력해 주세요." };
  if (!input.phone?.trim()) return { success: false, error: "연락처를 입력해 주세요." };

  const existingId = await findCustomerByContact(supabase, input.phone, input.email);
  if (existingId) {
    return { success: false, error: "동일한 연락처 또는 이메일의 고객이 이미 존재합니다." };
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      company: input.company?.trim() || null,
      contact_name: input.contact_name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      address: input.address?.trim() || null,
      website: input.website?.trim() || null,
      business_number: input.business_number?.trim() || null,
      memo: input.memo?.trim() || null,
      status: input.status ?? "신규",
      last_contacted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { success: false, error: "고객 등록 중 오류가 발생했습니다." };
  }

  revalidateCustomerPaths(data.id as string);
  redirect(`/admin/customers/${data.id}`);
}

export async function updateCustomer(input: UpdateCustomerInput): Promise<CustomerMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("customers")
    .update({
      company: input.company?.trim() || null,
      contact_name: input.contact_name?.trim(),
      phone: input.phone?.trim(),
      email: input.email?.trim() || null,
      address: input.address?.trim() || null,
      website: input.website?.trim() || null,
      business_number: input.business_number?.trim() || null,
      memo: input.memo?.trim() || null,
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) return { success: false, error: "고객 정보 수정 중 오류가 발생했습니다." };

  revalidateCustomerPaths(input.id);
  return { success: true, customerId: input.id };
}

export async function updateCustomerStatus(
  id: string,
  status: string
): Promise<CustomerMutationResult> {
  await requireAdmin();
  if (!isCustomerStatus(status)) {
    return { success: false, error: "유효하지 않은 상태입니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("customers").update({ status }).eq("id", id);
  if (error) return { success: false, error: "상태 변경 중 오류가 발생했습니다." };

  revalidateCustomerPaths(id);
  return { success: true, customerId: id };
}

export async function addCustomerConsultation(
  input: CreateConsultationInput
): Promise<CustomerMutationResult> {
  await requireAdmin();
  if (!CONSULTATION_TYPES.includes(input.type)) {
    return { success: false, error: "상담 유형을 확인해 주세요." };
  }
  if (!input.content.trim()) {
    return { success: false, error: "상담 내용을 입력해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("customer_consultations").insert({
    customer_id: input.customer_id,
    consulted_at: input.consulted_at,
    type: input.type,
    content: input.content.trim(),
  });

  if (error) return { success: false, error: "상담 기록 저장 중 오류가 발생했습니다." };

  await supabase
    .from("customers")
    .update({ last_contacted_at: input.consulted_at })
    .eq("id", input.customer_id);

  revalidateCustomerPaths(input.customer_id);
  return { success: true, customerId: input.customer_id };
}

export async function uploadCustomerAttachment(
  customerId: string,
  formData: FormData
): Promise<CustomerMutationResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "업로드할 파일을 선택해 주세요." };
  }

  if (!ALLOWED_ATTACHMENT_MIME_TYPES.includes(file.type as (typeof ALLOWED_ATTACHMENT_MIME_TYPES)[number])) {
    return { success: false, error: "지원하지 않는 파일 형식입니다." };
  }

  const supabase = await createClient();
  const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_");
  const filePath = `${customerId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("customer-attachments")
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { success: false, error: "파일 업로드 중 오류가 발생했습니다." };
  }

  const { error } = await supabase.from("customer_attachments").insert({
    customer_id: customerId,
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.type,
  });

  if (error) {
    await supabase.storage.from("customer-attachments").remove([filePath]);
    return { success: false, error: "첨부파일 저장 중 오류가 발생했습니다." };
  }

  revalidateCustomerPaths(customerId);
  return { success: true, customerId };
}

export async function deleteCustomerAttachment(
  attachmentId: string,
  customerId: string
): Promise<CustomerMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("customer_attachments")
    .select("file_path")
    .eq("id", attachmentId)
    .maybeSingle();

  if (!data?.file_path) {
    return { success: false, error: "첨부파일을 찾을 수 없습니다." };
  }

  await supabase.storage.from("customer-attachments").remove([data.file_path]);
  const { error } = await supabase.from("customer_attachments").delete().eq("id", attachmentId);
  if (error) return { success: false, error: "첨부파일 삭제 중 오류가 발생했습니다." };

  revalidateCustomerPaths(customerId);
  return { success: true, customerId };
}

export async function getCustomerAttachmentUrl(
  filePath: string
): Promise<{ url: string | null; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("customer-attachments")
    .createSignedUrl(filePath, 60 * 10);

  if (error || !data?.signedUrl) {
    return { url: null, error: "파일 URL 생성에 실패했습니다." };
  }
  return { url: data.signedUrl };
}

export async function linkInquiryToCustomer(inquiryId: string): Promise<CustomerMutationResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: inquiry } = await supabase
    .from("estimate_inquiries")
    .select("id, name, phone, email, company, status")
    .eq("id", inquiryId)
    .maybeSingle();

  if (!inquiry) return { success: false, error: "문의를 찾을 수 없습니다." };

  const customerId = await resolveOrCreateCustomer(
    supabase,
    {
      contact_name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      company: inquiry.company,
    },
    inquiry.status
  );

  await propagateCustomerId(supabase, customerId, { inquiryId });
  revalidateCustomerPaths(customerId);
  return { success: true, customerId };
}
