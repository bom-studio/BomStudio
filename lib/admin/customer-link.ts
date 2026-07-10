import type { SupabaseClient } from "@supabase/supabase-js";
import type { CustomerStatus } from "@/constants/customer-admin";

export interface CustomerContactInput {
  contact_name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  status?: CustomerStatus;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function mapInquiryStatusToCustomerStatus(inquiryStatus?: string): CustomerStatus {
  switch (inquiryStatus) {
    case "상담중":
      return "상담중";
    case "견적서작성":
    case "계약완료":
    case "작업중":
      return "진행중";
    case "완료":
      return "완료";
    default:
      return "신규";
  }
}

export async function findCustomerByContact(
  supabase: SupabaseClient,
  phone: string,
  email?: string | null
) {
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone) {
    const { data: customers } = await supabase
      .from("customers")
      .select("id, phone, email")
      .not("phone", "is", null);

    const matched = (customers ?? []).find(
      (row) => normalizePhone(row.phone ?? "") === normalizedPhone
    );
    if (matched) return matched.id as string;
  }

  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail) {
    const { data } = await supabase
      .from("customers")
      .select("id")
      .ilike("email", normalizedEmail)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  return null;
}

export async function resolveOrCreateCustomer(
  supabase: SupabaseClient,
  input: CustomerContactInput,
  inquiryStatus?: string
): Promise<string> {
  const existingId = await findCustomerByContact(supabase, input.phone, input.email);
  const now = new Date().toISOString();

  if (existingId) {
    await supabase
      .from("customers")
      .update({
        contact_name: input.contact_name.trim(),
        company: input.company?.trim() || null,
        email: input.email?.trim() || null,
        last_contacted_at: now,
        status: input.status ?? mapInquiryStatusToCustomerStatus(inquiryStatus),
        updated_at: now,
      })
      .eq("id", existingId);
    return existingId;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      contact_name: input.contact_name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      company: input.company?.trim() || null,
      status: input.status ?? mapInquiryStatusToCustomerStatus(inquiryStatus),
      last_contacted_at: now,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(error?.message ?? "고객 생성에 실패했습니다.");
  }

  return data.id as string;
}

export async function propagateCustomerId(
  supabase: SupabaseClient,
  customerId: string,
  options: {
    inquiryId?: string | null;
    estimateId?: string | null;
    contractId?: string | null;
    projectId?: string | null;
  }
) {
  if (options.inquiryId) {
    await supabase
      .from("estimate_inquiries")
      .update({ customer_id: customerId })
      .eq("id", options.inquiryId);
    await supabase
      .from("estimates")
      .update({ customer_id: customerId })
      .eq("inquiry_id", options.inquiryId)
      .is("customer_id", null);
    await supabase
      .from("contracts")
      .update({ customer_id: customerId })
      .eq("inquiry_id", options.inquiryId)
      .is("customer_id", null);
    await supabase
      .from("projects")
      .update({ customer_id: customerId })
      .eq("inquiry_id", options.inquiryId)
      .is("customer_id", null);
    await supabase
      .from("payments")
      .update({ customer_id: customerId })
      .eq("inquiry_id", options.inquiryId)
      .is("customer_id", null);
  }

  if (options.estimateId) {
    await supabase.from("estimates").update({ customer_id: customerId }).eq("id", options.estimateId);
  }

  if (options.contractId) {
    await supabase.from("contracts").update({ customer_id: customerId }).eq("id", options.contractId);
    await supabase
      .from("payments")
      .update({ customer_id: customerId })
      .eq("contract_id", options.contractId)
      .is("customer_id", null);
    await supabase
      .from("projects")
      .update({ customer_id: customerId })
      .eq("contract_id", options.contractId)
      .is("customer_id", null);
  }

  if (options.projectId) {
    await supabase.from("projects").update({ customer_id: customerId }).eq("id", options.projectId);
  }
}

export async function syncCustomerIdFromInquiry(
  supabase: SupabaseClient,
  inquiryId: string
): Promise<string | null> {
  const { data: inquiry } = await supabase
    .from("estimate_inquiries")
    .select("id, name, phone, email, company, status, customer_id")
    .eq("id", inquiryId)
    .maybeSingle();

  if (!inquiry) return null;

  if (inquiry.customer_id) {
    return inquiry.customer_id as string;
  }

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
  return customerId;
}
