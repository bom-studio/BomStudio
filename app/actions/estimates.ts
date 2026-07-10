"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isEstimateStatus, type EstimateStatus } from "@/constants/estimate-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { syncCustomerIdFromInquiry } from "@/lib/admin/customer-link";
import { createClient } from "@/lib/supabase/server";
import type {
  EstimateActionResult,
  EstimateItem,
  SaveEstimateInput,
  SavedEstimate,
  VatType,
} from "@/types/admin-estimate";

export type EstimateMutationResult =
  | { success: true }
  | { success: false; error: string };

function normalizeItems(items: SaveEstimateInput["items"]): EstimateItem[] {
  return items
    .map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
      duration: item.duration.trim(),
      amount: Math.max(0, Math.round(item.amount || 0)),
      note: item.note?.trim() ?? "",
    }))
    .filter((item) => item.title || item.description || item.amount > 0);
}

function validateSaveInput(input: SaveEstimateInput, items: EstimateItem[]): string | null {
  if (!input.inquiryId) return "문의 정보가 올바르지 않습니다.";
  if (!input.estimateNumber?.trim()) return "견적번호를 확인해 주세요.";
  if (!input.customerName?.trim()) return "고객명을 입력해 주세요.";
  if (items.length === 0) return "제작 항목을 최소 1개 이상 입력해 주세요.";
  if (Math.round(input.total || 0) <= 0) return "최종 견적금액을 확인해 주세요.";
  return null;
}

function mapRowToSavedEstimate(row: Record<string, unknown>): SavedEstimate {
  return {
    id: row.id as string,
    inquiry_id: row.inquiry_id as string,
    estimate_number: row.estimate_number as string,
    customer_name: row.customer_name as string,
    company: (row.company as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    business_type: (row.business_type as string | null) ?? null,
    items: (row.items as EstimateItem[]) ?? [],
    subtotal: Number(row.subtotal ?? 0),
    vat: Number(row.vat ?? 0),
    total: Number(row.total ?? 0),
    vat_type: (row.vat_type as VatType | null) ?? null,
    payment_terms: (row.payment_terms as string | null) ?? null,
    delivery_period: (row.delivery_period as string | null) ?? null,
    valid_until: (row.valid_until as string | null) ?? null,
    request_summary: (row.request_summary as string | null) ?? null,
    reference_urls: (row.reference_urls as string | null) ?? null,
    memo: (row.memo as string | null) ?? null,
    status: (row.status as string | null) ?? null,
    form_snapshot: (row.form_snapshot as SavedEstimate["form_snapshot"]) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function buildEstimatePayload(input: SaveEstimateInput, items: EstimateItem[]) {
  return {
    estimate_number: input.estimateNumber.trim(),
    customer_name: input.customerName.trim(),
    company: input.company?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    business_type: input.businessType?.trim() || null,
    items,
    subtotal: Math.max(0, Math.round(input.subtotal || 0)),
    vat: Math.max(0, Math.round(input.vat || 0)),
    total: Math.max(0, Math.round(input.total || 0)),
    vat_type: input.vatType,
    payment_terms: input.paymentTerms?.trim() || null,
    delivery_period: input.deliveryPeriod?.trim() || null,
    valid_until: input.validUntil || null,
    request_summary: input.requestSummary?.trim() || null,
    reference_urls: input.referenceUrls?.trim() || null,
    memo: input.memo?.trim() || null,
    status: "작성중",
    form_snapshot: input.formSnapshot ?? null,
  };
}

async function resolveEstimateId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: SaveEstimateInput
): Promise<string | null> {
  if (input.estimateId) return input.estimateId;

  const { data: inquiry } = await supabase
    .from("estimate_inquiries")
    .select("estimate_id")
    .eq("id", input.inquiryId)
    .maybeSingle();

  if (inquiry?.estimate_id) return inquiry.estimate_id;

  const { data: existing } = await supabase
    .from("estimates")
    .select("id")
    .eq("inquiry_id", input.inquiryId)
    .maybeSingle();

  return existing?.id ?? null;
}

export async function getEstimateByInquiryId(
  inquiryId: string
): Promise<SavedEstimate | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: inquiry } = await supabase
    .from("estimate_inquiries")
    .select("estimate_id")
    .eq("id", inquiryId)
    .maybeSingle();

  if (inquiry?.estimate_id) {
    const { data, error } = await supabase
      .from("estimates")
      .select("*")
      .eq("id", inquiry.estimate_id)
      .maybeSingle();

    if (!error && data) {
      return mapRowToSavedEstimate(data as Record<string, unknown>);
    }
  }

  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("inquiry_id", inquiryId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToSavedEstimate(data as Record<string, unknown>);
}

export async function getEstimateById(id: string): Promise<SavedEstimate | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getEstimateById error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRowToSavedEstimate(data as Record<string, unknown>);
}

export async function updateEstimateStatus(
  id: string,
  status: EstimateStatus
): Promise<EstimateMutationResult> {
  await requireAdmin();

  if (!isEstimateStatus(status)) {
    return { success: false, error: "유효하지 않은 상태입니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("estimates").update({ status }).eq("id", id);

  if (error) {
    console.error("updateEstimateStatus error:", error.message, error);
    return { success: false, error: "상태 변경 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/estimates");
  revalidatePath(`/admin/estimates/${id}`);
  return { success: true };
}

export async function deleteEstimate(id: string): Promise<EstimateMutationResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error: unlinkError } = await supabase
    .from("estimate_inquiries")
    .update({ estimate_id: null })
    .eq("estimate_id", id);

  if (unlinkError) {
    console.error("deleteEstimate unlink error:", unlinkError.message, unlinkError);
  }

  const { error } = await supabase.from("estimates").delete().eq("id", id);

  if (error) {
    console.error("deleteEstimate error:", error.message, error);
    return { success: false, error: "견적서 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/estimates");
  redirect("/admin/estimates");
}

export async function updateEstimate(
  id: string,
  input: SaveEstimateInput
): Promise<EstimateActionResult> {
  return saveEstimate({ ...input, estimateId: id });
}

export async function saveEstimate(input: SaveEstimateInput): Promise<EstimateActionResult> {
  await requireAdmin();

  const normalizedItems = normalizeItems(input.items);
  const validationError = validateSaveInput(input, normalizedItems);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();
  const payload = buildEstimatePayload(input, normalizedItems);
  const customerId = await syncCustomerIdFromInquiry(supabase, input.inquiryId);
  const existingId = await resolveEstimateId(supabase, input);

  if (existingId) {
    const { data, error } = await supabase
      .from("estimates")
      .update({ ...payload, customer_id: customerId })
      .eq("id", existingId)
      .select("id")
      .single();

    if (error || !data?.id) {
      console.error("saveEstimate update error:", error?.message, error);
      return { success: false, error: "견적서 저장 중 오류가 발생했습니다." };
    }

    const { error: inquiryError } = await supabase
      .from("estimate_inquiries")
      .update({
        status: "견적서작성",
        estimate_id: data.id,
        estimate_created_at: new Date().toISOString(),
      })
      .eq("id", input.inquiryId);

    if (inquiryError) {
      console.error("saveEstimate inquiry update error:", inquiryError.message, inquiryError);
      return { success: false, error: "견적서 저장 중 오류가 발생했습니다." };
    }

    revalidateEstimatePaths(input.inquiryId);
    return { success: true, estimateId: data.id, isUpdate: true };
  }

  const { data, error } = await supabase
    .from("estimates")
    .insert({
      ...payload,
      inquiry_id: input.inquiryId,
      customer_id: customerId,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("saveEstimate insert error:", error?.message, error);
    return { success: false, error: "견적서 저장 중 오류가 발생했습니다." };
  }

  const { error: inquiryError } = await supabase
    .from("estimate_inquiries")
    .update({
      status: "견적서작성",
      estimate_id: data.id,
      estimate_created_at: new Date().toISOString(),
    })
    .eq("id", input.inquiryId);

  if (inquiryError) {
    console.error("saveEstimate inquiry update error:", inquiryError.message, inquiryError);
    return { success: false, error: "견적서 저장 중 오류가 발생했습니다." };
  }

  revalidateEstimatePaths(input.inquiryId);
  return { success: true, estimateId: data.id, isUpdate: false };
}

function revalidateEstimatePaths(inquiryId: string) {
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath("/admin/estimates");
  revalidatePath(`/admin/estimates/new`);
}
