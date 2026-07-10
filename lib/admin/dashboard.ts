import { requireAdmin } from "@/lib/admin/auth";
import { MONTHLY_REVENUE_GOAL } from "@/lib/admin/dashboard-config";
import {
  calcChangePercent,
  formatActivityTime,
  formatKSTDisplayDate,
  formatMonthLabel,
  formatShortDate,
  getKSTDateString,
  getKSTMonthKey,
  isInKSTMonth,
  isTodayKST,
  kstDayEndIso,
  kstDayStartIso,
  toKSTDateKey,
} from "@/lib/admin/dashboard-dates";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import { createClient } from "@/lib/supabase/server";
import type {
  DashboardActivity,
  DashboardData,
  DashboardNotification,
} from "@/types/admin-dashboard";

const FUNNEL_STATUSES = [
  { label: "문의", status: "접수완료" },
  { label: "상담", status: "상담중" },
  { label: "견적", status: "견적서작성" },
  { label: "계약", status: "계약완료" },
  { label: "완료", status: "완료" },
] as const;

const STATUS_CHART_STATUSES = [
  "접수완료",
  "상담중",
  "견적서작성",
  "계약완료",
  "보류",
] as const;

function resolveAdminName(email?: string | null): string {
  if (!email) return "허보미";
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (local.includes("bomi") || local.includes("bom")) return "허보미";
  return "허보미";
}

function countInRange(
  rows: { created_at: string }[],
  startIso: string,
  endIso: string
): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return rows.filter((row) => {
    const t = new Date(row.created_at).getTime();
    return t >= start && t <= end;
  }).length;
}

function sumPaidInMonth(
  rows: { amount: number; paid_at: string | null; status: string }[],
  year: number,
  month: number
): number {
  return rows
    .filter(
      (row) =>
        row.status === "입금완료" &&
        row.paid_at &&
        isInKSTMonth(row.paid_at, year, month)
    )
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
}

function buildActivities(
  inquiries: { id: string; name: string; created_at: string }[],
  estimates: {
    id: string;
    customer_name: string;
    status: string | null;
    created_at: string;
  }[],
  contracts: {
    id: string;
    project_title: string | null;
    status: string;
    created_at: string;
  }[],
  payments: {
    id: string;
    amount: number;
    status: string;
    paid_at: string | null;
    created_at: string;
  }[]
): DashboardActivity[] {
  const events: DashboardActivity[] = [];

  for (const inquiry of inquiries.slice(0, 20)) {
    events.push({
      id: `inquiry-${inquiry.id}`,
      time: inquiry.created_at,
      timeLabel: formatActivityTime(inquiry.created_at),
      label: `${inquiry.name} 문의 등록`,
      href: `/admin/inquiries/${inquiry.id}`,
      type: "inquiry",
    });
  }

  for (const estimate of estimates.slice(0, 20)) {
    const sent = estimate.status === "발송완료";
    events.push({
      id: `estimate-${estimate.id}`,
      time: estimate.created_at,
      timeLabel: formatActivityTime(estimate.created_at),
      label: sent
        ? `${estimate.customer_name} 견적서 발송`
        : `${estimate.customer_name} 견적서 작성`,
      href: `/admin/estimates/${estimate.id}`,
      type: "estimate",
    });
  }

  for (const contract of contracts) {
    if (contract.status !== "계약완료") continue;
    events.push({
      id: `contract-${contract.id}`,
      time: contract.created_at,
      timeLabel: formatActivityTime(contract.created_at),
      label: `${contract.project_title ?? "프로젝트"} 계약 완료`,
      href: `/admin/contracts/${contract.id}`,
      type: "contract",
    });
  }

  for (const payment of payments) {
    if (payment.status !== "입금완료") continue;
    const time = payment.paid_at ?? payment.created_at;
    events.push({
      id: `payment-${payment.id}`,
      time,
      timeLabel: formatActivityTime(time),
      label: `${formatEstimateMoney(Number(payment.amount ?? 0))} 입금 확인`,
      href: `/admin/payments/${payment.id}`,
      type: "payment",
    });
  }

  return events
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);
}

function buildNotifications(
  inquiries: { id: string; name: string; created_at: string }[],
  contracts: {
    id: string;
    project_title: string | null;
    status: string;
    created_at: string;
  }[],
  payments: {
    id: string;
    amount: number;
    status: string;
    paid_at: string | null;
    created_at: string;
  }[]
): DashboardNotification[] {
  const items: DashboardNotification[] = [];

  for (const inquiry of inquiries.slice(0, 5)) {
    items.push({
      id: `n-inquiry-${inquiry.id}`,
      title: "새 문의",
      description: `${inquiry.name}님 문의가 접수되었습니다.`,
      href: `/admin/inquiries/${inquiry.id}`,
      createdAt: inquiry.created_at,
    });
  }

  for (const contract of contracts) {
    if (contract.status !== "계약완료") continue;
    items.push({
      id: `n-contract-${contract.id}`,
      title: "계약 완료",
      description: `${contract.project_title ?? "프로젝트"} 계약이 완료되었습니다.`,
      href: `/admin/contracts/${contract.id}`,
      createdAt: contract.created_at,
    });
  }

  for (const payment of payments) {
    if (payment.status !== "입금완료") continue;
    items.push({
      id: `n-payment-${payment.id}`,
      title: "입금 완료",
      description: `${formatEstimateMoney(Number(payment.amount ?? 0))} 입금이 확인되었습니다.`,
      href: `/admin/payments/${payment.id}`,
      createdAt: payment.paid_at ?? payment.created_at,
    });
  }

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const user = await requireAdmin();
  const supabase = await createClient();

  const today = getKSTDateString();
  const yesterday = getKSTDateString(-1);
  const currentMonth = getKSTMonthKey(0);
  const lastMonth = getKSTMonthKey(-1);

  const [
    inquiriesRes,
    estimatesRes,
    contractsRes,
    projectsRes,
    paymentsRes,
    consultingRes,
    draftEstimatesRes,
    pendingContractsRes,
    pendingPaymentsRes,
  ] = await Promise.all([
    supabase
      .from("estimate_inquiries")
      .select("id, name, company, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("estimates")
      .select("id, estimate_number, customer_name, total, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("contracts")
      .select("id, project_title, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("id, amount, status, paid_at, created_at")
      .order("paid_at", { ascending: false }),
    supabase
      .from("estimate_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "상담중"),
    supabase
      .from("estimates")
      .select("*", { count: "exact", head: true })
      .eq("status", "작성중"),
    supabase
      .from("contracts")
      .select("*", { count: "exact", head: true })
      .eq("status", "작성중"),
    supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "입금대기"),
  ]);

  const inquiries = inquiriesRes.data ?? [];
  const estimates = estimatesRes.data ?? [];
  const contracts = contractsRes.data ?? [];
  const projects = projectsRes.data ?? [];
  const payments = paymentsRes.data ?? [];

  const todayCount = countInRange(
    inquiries,
    kstDayStartIso(today),
    kstDayEndIso(today)
  );
  const yesterdayCount = countInRange(
    inquiries,
    kstDayStartIso(yesterday),
    kstDayEndIso(yesterday)
  );

  const activeProjects = projects.filter(
    (p) => !["완료", "취소", "보류"].includes(p.status ?? "")
  ).length;

  const newProjectsThisMonth = projects.filter((p) =>
    isInKSTMonth(p.created_at, currentMonth.year, currentMonth.month)
  ).length;

  const monthContracts = contracts.filter(
    (c) =>
      c.status === "계약완료" &&
      isInKSTMonth(c.created_at, currentMonth.year, currentMonth.month)
  ).length;

  const lastMonthContracts = contracts.filter(
    (c) =>
      c.status === "계약완료" &&
      isInKSTMonth(c.created_at, lastMonth.year, lastMonth.month)
  ).length;

  const monthRevenue = sumPaidInMonth(
    payments,
    currentMonth.year,
    currentMonth.month
  );
  const lastMonthRevenue = sumPaidInMonth(
    payments,
    lastMonth.year,
    lastMonth.month
  );

  const goalPercent =
    MONTHLY_REVENUE_GOAL > 0
      ? Math.min(Math.round((monthRevenue / MONTHLY_REVENUE_GOAL) * 100), 100)
      : 0;

  const trendMap = new Map<string, number>();
  for (let i = 29; i >= 0; i -= 1) {
    const dateStr = getKSTDateString(-i);
    trendMap.set(dateStr, 0);
  }

  for (const inquiry of inquiries) {
    const key = toKSTDateKey(inquiry.created_at);
    if (trendMap.has(key)) {
      trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
    }
  }

  const inquiryTrend = Array.from(trendMap.entries()).map(([date, count]) => ({
    date,
    label: formatShortDate(`${date}T12:00:00+09:00`),
    count,
  }));

  const statusCounts = new Map<string, number>();
  for (const status of STATUS_CHART_STATUSES) {
    statusCounts.set(status, 0);
  }
  for (const inquiry of inquiries) {
    const status = inquiry.status ?? "접수완료";
    if (statusCounts.has(status)) {
      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    }
  }

  const inquiryStatus = STATUS_CHART_STATUSES.map((status) => ({
    status,
    count: statusCounts.get(status) ?? 0,
  }));

  const totalInquiries = inquiries.length || 1;
  const funnel = FUNNEL_STATUSES.map(({ label, status }) => {
    const count = inquiries.filter((i) => i.status === status).length;
    return {
      label,
      count,
      percent: Math.round((count / totalInquiries) * 100),
    };
  });

  const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
    const offset = index - 5;
    const { year, month } = getKSTMonthKey(offset);
    return {
      month: `${year}-${String(month).padStart(2, "0")}`,
      label: formatMonthLabel(year, month),
      amount: sumPaidInMonth(payments, year, month),
    };
  });

  const recentActivity = buildActivities(inquiries, estimates, contracts, payments);
  const notifications = buildNotifications(inquiries, contracts, payments);
  const unreadNotificationCount = notifications.filter((n) =>
    isTodayKST(n.createdAt)
  ).length;

  return {
    userName: resolveAdminName(user.email),
    todayLabel: formatKSTDisplayDate(),
    kpis: {
      todayInquiries: {
        count: todayCount,
        changePercent: calcChangePercent(todayCount, yesterdayCount),
        changeDelta: todayCount - yesterdayCount,
      },
      activeProjects: {
        count: activeProjects,
        newThisMonth: newProjectsThisMonth,
      },
      monthContracts: {
        count: monthContracts,
        changePercent: calcChangePercent(monthContracts, lastMonthContracts),
        changeDelta: monthContracts - lastMonthContracts,
      },
      monthRevenue: {
        amount: monthRevenue,
        lastMonthAmount: lastMonthRevenue,
        changePercent: calcChangePercent(monthRevenue, lastMonthRevenue),
        goalAmount: MONTHLY_REVENUE_GOAL,
        goalPercent,
      },
    },
    inquiryTrend,
    inquiryStatus,
    recentInquiries: inquiries.slice(0, 5).map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      company: inquiry.company,
      createdAt: inquiry.created_at,
      status: inquiry.status ?? "접수완료",
    })),
    recentEstimates: estimates.slice(0, 5).map((estimate) => ({
      id: estimate.id,
      estimateNumber: estimate.estimate_number ?? "-",
      customerName: estimate.customer_name,
      total: Number(estimate.total ?? 0),
      createdAt: estimate.created_at,
      status: estimate.status,
    })),
    tasks: [
      {
        id: "consulting",
        label: "상담중 문의",
        count: consultingRes.count ?? 0,
        href: "/admin/inquiries?status=상담중",
        emoji: "🔥",
        accentClass: "border-orange-200/80 bg-orange-50/80 hover:bg-orange-50",
      },
      {
        id: "draft-estimates",
        label: "미발송 견적",
        count: draftEstimatesRes.count ?? 0,
        href: "/admin/estimates?status=작성중",
        emoji: "📝",
        accentClass: "border-sky-200/80 bg-sky-50/80 hover:bg-sky-50",
      },
      {
        id: "pending-contracts",
        label: "계약 대기",
        count: pendingContractsRes.count ?? 0,
        href: "/admin/contracts?status=작성중",
        emoji: "📄",
        accentClass: "border-amber-200/80 bg-amber-50/80 hover:bg-amber-50",
      },
      {
        id: "pending-payments",
        label: "입금 대기",
        count: pendingPaymentsRes.count ?? 0,
        href: "/admin/payments?status=입금대기",
        emoji: "💰",
        accentClass: "border-emerald-200/80 bg-emerald-50/80 hover:bg-emerald-50",
      },
    ],
    funnel,
    monthlyRevenue,
    revenueSummary: {
      currentAmount: monthRevenue,
      lastMonthAmount: lastMonthRevenue,
      changePercent: calcChangePercent(monthRevenue, lastMonthRevenue),
    },
    goal: {
      targetAmount: MONTHLY_REVENUE_GOAL,
      currentAmount: monthRevenue,
      percent: goalPercent,
    },
    recentActivity,
    notifications,
    unreadNotificationCount,
  };
}
