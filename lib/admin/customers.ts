import { CUSTOMER_STATUSES, type CustomerSort, type CustomerStatus } from "@/constants/customer-admin";
import { assertCustomersQueryOk } from "@/lib/admin/customer-errors";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type {
  CustomerDetailData,
  CustomerKpiSummary,
  CustomerListItem,
  CustomerTimelineEvent,
  SavedCustomer,
} from "@/types/admin-customer";

function mapCustomerRow(row: Record<string, unknown>): SavedCustomer {
  return {
    id: row.id as string,
    customer_number: (row.customer_number as string | null) ?? null,
    company: (row.company as string | null) ?? null,
    contact_name: row.contact_name as string,
    phone: row.phone as string,
    email: (row.email as string | null) ?? null,
    address: (row.address as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    business_number: (row.business_number as string | null) ?? null,
    memo: (row.memo as string | null) ?? null,
    status: row.status as CustomerStatus,
    last_contacted_at: (row.last_contacted_at as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export interface FetchCustomersParams {
  status?: string;
  q?: string;
  sort?: CustomerSort;
}

async function buildCustomerAggregates(customerIds: string[]) {
  const supabase = await createClient();
  const aggregates = new Map<
    string,
    { project_count: number; latest_project_title: string | null; total_revenue: number; unpaid_amount: number }
  >();

  for (const id of customerIds) {
    aggregates.set(id, {
      project_count: 0,
      latest_project_title: null,
      total_revenue: 0,
      unpaid_amount: 0,
    });
  }

  if (customerIds.length === 0) return aggregates;

  const [projectsRes, paymentsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, customer_id, project_title, created_at")
      .in("customer_id", customerIds)
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("customer_id, amount, status")
      .in("customer_id", customerIds),
  ]);

  for (const project of projectsRes.data ?? []) {
    const customerId = project.customer_id as string;
    const agg = aggregates.get(customerId);
    if (!agg) continue;
    agg.project_count += 1;
    if (!agg.latest_project_title) {
      agg.latest_project_title = (project.project_title as string | null) ?? null;
    }
  }

  for (const payment of paymentsRes.data ?? []) {
    const customerId = payment.customer_id as string;
    const agg = aggregates.get(customerId);
    if (!agg) continue;
    const amount = Number(payment.amount ?? 0);
    if (payment.status === "입금완료") {
      agg.total_revenue += amount;
    } else if (["입금대기", "입금예정", "연체", "부분입금"].includes(payment.status as string)) {
      agg.unpaid_amount += amount;
    }
  }

  return aggregates;
}

export async function fetchCustomerKpiSummary(): Promise<CustomerKpiSummary> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("customers").select("status");
  assertCustomersQueryOk(error);

  const summary: CustomerKpiSummary = {
    total: data?.length ?? 0,
    newCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    dormantCount: 0,
  };

  for (const row of data ?? []) {
    switch (row.status as CustomerStatus) {
      case "신규":
        summary.newCount += 1;
        break;
      case "상담중":
      case "진행중":
        summary.inProgressCount += 1;
        break;
      case "완료":
        summary.completedCount += 1;
        break;
      case "휴면":
        summary.dormantCount += 1;
        break;
      default:
        break;
    }
  }

  return summary;
}

export async function fetchCustomers(params: FetchCustomersParams = {}): Promise<CustomerListItem[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { status = "전체", q = "", sort = "created_desc" } = params;

  let query = supabase.from("customers").select("*");

  if (status && status !== "전체" && CUSTOMER_STATUSES.includes(status as CustomerStatus)) {
    query = query.eq("status", status);
  }

  if (q.trim()) {
    const pattern = `%${q.trim()}%`;
    query = query.or(
      `company.ilike.${pattern},contact_name.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern}`
    );
  }

  if (sort === "contacted_desc") {
    query = query.order("last_contacted_at", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  assertCustomersQueryOk(error);

  const customers = (data ?? []).map(mapCustomerRow);
  const aggregates = await buildCustomerAggregates(customers.map((c) => c.id));

  let items: CustomerListItem[] = customers.map((customer) => {
    const agg = aggregates.get(customer.id) ?? {
      project_count: 0,
      latest_project_title: null,
      total_revenue: 0,
      unpaid_amount: 0,
    };
    return { ...customer, ...agg };
  });

  if (sort === "revenue_desc") {
    items = items.sort((a, b) => b.total_revenue - a.total_revenue);
  }

  return items;
}

function buildTimeline(detail: Omit<CustomerDetailData, "timeline">): CustomerTimelineEvent[] {
  const events: CustomerTimelineEvent[] = [];

  for (const estimate of detail.estimates) {
    events.push({
      id: `estimate-${estimate.id}`,
      occurred_at: estimate.created_at,
      label:
        estimate.status === "발송완료"
          ? `견적서 발송 (${estimate.estimate_number})`
          : `견적 생성 (${estimate.estimate_number})`,
      href: `/admin/estimates/${estimate.id}`,
    });
  }

  for (const contract of detail.contracts) {
    events.push({
      id: `contract-${contract.id}`,
      occurred_at: contract.created_at,
      label:
        contract.status === "계약완료"
          ? `계약 완료 (${contract.contract_number})`
          : `계약 작성 (${contract.contract_number})`,
      href: `/admin/contracts/${contract.id}`,
    });
  }

  for (const project of detail.projects) {
    const date = project.completed_at ?? project.start_date ?? project.id;
    events.push({
      id: `project-start-${project.id}`,
      occurred_at: date,
      label: `프로젝트 시작 (${project.project_title ?? project.project_number})`,
      href: `/admin/projects/${project.id}`,
    });
    if (project.status === "완료" && project.completed_at) {
      events.push({
        id: `project-done-${project.id}`,
        occurred_at: project.completed_at,
        label: `프로젝트 완료 (${project.project_title ?? project.project_number})`,
        href: `/admin/projects/${project.id}`,
      });
    }
  }

  for (const payment of detail.payments) {
    if (payment.status !== "입금완료") continue;
    events.push({
      id: `payment-${payment.id}`,
      occurred_at: payment.paid_at ?? payment.id,
      label: `${payment.payment_type} 입금`,
      href: `/admin/payments/${payment.id}`,
    });
  }

  for (const consultation of detail.consultations) {
    events.push({
      id: `consult-${consultation.id}`,
      occurred_at: consultation.consulted_at,
      label: `상담 기록 (${consultation.type})`,
    });
  }

  return events.sort(
    (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  );
}

export async function fetchCustomerById(id: string): Promise<CustomerDetailData | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: customerRow, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  assertCustomersQueryOk(error);
  if (!customerRow) return null;

  const customer = mapCustomerRow(customerRow);

  const [projectsRes, estimatesRes, contractsRes, paymentsRes, consultationsRes, attachmentsRes, inquiriesRes] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id, project_number, project_title, status, start_date, completed_at, contract_id")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("estimates")
        .select("id, estimate_number, created_at, total, status")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contracts")
        .select("id, contract_number, down_payment_amount, balance_payment_amount, status, created_at")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("id, paid_at, amount, payment_type, status, created_at")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("customer_consultations")
        .select("*")
        .eq("customer_id", id)
        .order("consulted_at", { ascending: false }),
      supabase
        .from("customer_attachments")
        .select("*")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("estimate_inquiries")
        .select("id, created_at, inquiry_number")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const contractIds = (contractsRes.data ?? []).map((c) => c.id as string);
  const contractAmountMap = new Map<string, number>();
  for (const contract of contractsRes.data ?? []) {
    contractAmountMap.set(
      contract.id as string,
      Number(contract.down_payment_amount ?? 0) + Number(contract.balance_payment_amount ?? 0)
    );
  }

  const projects = await Promise.all(
    (projectsRes.data ?? []).map(async (project) => {
      let contractAmount = 0;
      let balanceAmount = 0;
      if (project.contract_id) {
        const { data: contract } = await supabase
          .from("contracts")
          .select("contract_amount, balance_payment_amount")
          .eq("id", project.contract_id)
          .maybeSingle();
        contractAmount = Number(contract?.contract_amount ?? 0);
        balanceAmount = Number(contract?.balance_payment_amount ?? 0);
      }
      return {
        id: project.id as string,
        project_number: project.project_number as string,
        project_title: (project.project_title as string | null) ?? null,
        status: project.status as string,
        contract_amount: contractAmount,
        balance_amount: balanceAmount,
        start_date: (project.start_date as string | null) ?? null,
        completed_at: (project.completed_at as string | null) ?? null,
      };
    })
  );

  const payments = (paymentsRes.data ?? []).map((payment) => ({
    id: payment.id as string,
    paid_at: (payment.paid_at as string | null) ?? null,
    amount: Number(payment.amount ?? 0),
    payment_type: payment.payment_type as string,
    status: payment.status as string,
  }));

  const totalPaid = payments
    .filter((p) => p.status === "입금완료")
    .reduce((sum, p) => sum + p.amount, 0);
  const unpaid = payments
    .filter((p) => ["입금대기", "입금예정", "연체", "부분입금"].includes(p.status))
    .reduce((sum, p) => sum + p.amount, 0);
  const totalContract = (contractsRes.data ?? []).reduce(
    (sum, c) => sum + Number(c.down_payment_amount ?? 0) + Number(c.balance_payment_amount ?? 0),
    0
  );

  const detailBase = {
    customer,
    summary: {
      project_count: projects.length,
      total_revenue: totalPaid,
      unpaid_amount: unpaid,
      last_contacted_at: customer.last_contacted_at,
      total_contract_amount: totalContract,
      total_paid_amount: totalPaid,
    },
    projects,
    estimates: (estimatesRes.data ?? []).map((e) => ({
      id: e.id as string,
      estimate_number: e.estimate_number as string,
      created_at: e.created_at as string,
      total: Number(e.total ?? 0),
      status: (e.status as string | null) ?? null,
    })),
    contracts: (contractsRes.data ?? []).map((c) => ({
      id: c.id as string,
      contract_number: c.contract_number as string,
      down_payment_amount: Number(c.down_payment_amount ?? 0),
      balance_payment_amount: Number(c.balance_payment_amount ?? 0),
      status: (c.status as string | null) ?? null,
      created_at: c.created_at as string,
    })),
    payments,
    consultations: (consultationsRes.data ?? []).map((row) => ({
      id: row.id as string,
      customer_id: row.customer_id as string,
      consulted_at: row.consulted_at as string,
      type: row.type as CustomerDetailData["consultations"][number]["type"],
      content: row.content as string,
      created_at: row.created_at as string,
    })),
    attachments: (attachmentsRes.data ?? []).map((row) => ({
      id: row.id as string,
      customer_id: row.customer_id as string,
      file_name: row.file_name as string,
      file_path: row.file_path as string,
      file_size: (row.file_size as number | null) ?? null,
      mime_type: (row.mime_type as string | null) ?? null,
      created_at: row.created_at as string,
    })),
  };

  const inquiryEvents: CustomerTimelineEvent[] = (inquiriesRes.data ?? []).map((inquiry) => ({
    id: `inquiry-${inquiry.id}`,
    occurred_at: inquiry.created_at as string,
    label: `문의 접수 (${inquiry.inquiry_number ?? "문의"})`,
    href: `/admin/inquiries/${inquiry.id}`,
  }));

  const timeline = [...inquiryEvents, ...buildTimeline(detailBase)];

  return { ...detailBase, timeline };
}
