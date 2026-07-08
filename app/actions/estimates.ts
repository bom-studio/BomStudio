"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

interface EstimateItemInput {
  title: string;
  description: string;
  duration: string;
  amount: number;
  note: string;
}

export interface SaveEstimateInput {
  inquiryId: string;
  estimateNumber: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  businessType: string;
  items: EstimateItemInput[];
  subtotal: number;
  vat: number;
  total: number;
  paymentTerms: string;
  memo: string;
}

export type EstimateActionResult =
  | { success: true; estimateId: string }
  | { success: false; error: string };

export async function saveEstimate(input: SaveEstimateInput): Promise<EstimateActionResult> {
  await requireAdmin();

  if (!input.inquiryId) {
    return { success: false, error: "문의 정보가 올바르지 않습니다." };
  }

  const normalizedItems = input.items
    .map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
      duration: item.duration.trim(),
      amount: Math.max(0, Math.round(item.amount || 0)),
      note: item.note.trim(),
    }))
    .filter((item) => item.title || item.description || item.amount > 0);

  if (normalizedItems.length === 0) {
    return { success: false, error: "제작 항목을 최소 1개 이상 입력해 주세요." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimates")
    .insert({
      inquiry_id: input.inquiryId,
      estimate_number: input.estimateNumber.trim(),
      customer_name: input.customerName.trim(),
      company: input.company.trim() || null,
      phone: input.phone.trim() || null,
      email: input.email.trim() || null,
      business_type: input.businessType.trim() || null,
      items: normalizedItems,
      subtotal: Math.max(0, Math.round(input.subtotal || 0)),
      vat: Math.max(0, Math.round(input.vat || 0)),
      total: Math.max(0, Math.round(input.total || 0)),
      payment_terms: input.paymentTerms.trim() || null,
      memo: input.memo.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { success: false, error: "견적서 저장 중 오류가 발생했습니다." };
  }

  const { error: updateError } = await supabase
    .from("estimate_inquiries")
    .update({
      status: "견적서작성",
      estimate_id: data.id,
      estimate_created_at: new Date().toISOString(),
    })
    .eq("id", input.inquiryId);

  if (updateError) {
    return { success: false, error: "문의 상태 업데이트 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${input.inquiryId}`);
  revalidatePath(`/admin/estimates/new?inquiryId=${input.inquiryId}`);

  return { success: true, estimateId: data.id };
}
