export interface DashboardKpi {
  todayInquiries: {
    count: number;
    changePercent: number | null;
    changeDelta: number;
  };
  activeProjects: {
    count: number;
    newThisMonth: number;
  };
  monthContracts: {
    count: number;
    changePercent: number | null;
    changeDelta: number;
  };
  monthRevenue: {
    amount: number;
    lastMonthAmount: number;
    changePercent: number | null;
    goalAmount: number;
    goalPercent: number;
  };
}

export interface DashboardTrendPoint {
  date: string;
  label: string;
  count: number;
}

export interface DashboardStatusPoint {
  status: string;
  count: number;
}

export interface DashboardRecentInquiry {
  id: string;
  name: string;
  company: string | null;
  createdAt: string;
  status: string;
}

export interface DashboardRecentEstimate {
  id: string;
  estimateNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  status: string | null;
}

export interface DashboardTask {
  id: string;
  label: string;
  count: number;
  href: string;
  emoji: string;
  accentClass: string;
}

export interface DashboardFunnelStep {
  label: string;
  count: number;
  percent: number;
}

export interface DashboardRevenuePoint {
  month: string;
  label: string;
  amount: number;
}

export interface DashboardActivity {
  id: string;
  time: string;
  timeLabel: string;
  label: string;
  href: string;
  type: "inquiry" | "estimate" | "contract" | "payment";
}

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
}

export interface DashboardGoal {
  targetAmount: number;
  currentAmount: number;
  percent: number;
}

export interface DashboardRevenueSummary {
  currentAmount: number;
  lastMonthAmount: number;
  changePercent: number | null;
}

export interface DashboardData {
  userName: string;
  todayLabel: string;
  kpis: DashboardKpi;
  inquiryTrend: DashboardTrendPoint[];
  inquiryStatus: DashboardStatusPoint[];
  recentInquiries: DashboardRecentInquiry[];
  recentEstimates: DashboardRecentEstimate[];
  tasks: DashboardTask[];
  funnel: DashboardFunnelStep[];
  monthlyRevenue: DashboardRevenuePoint[];
  revenueSummary: DashboardRevenueSummary;
  goal: DashboardGoal;
  recentActivity: DashboardActivity[];
  notifications: DashboardNotification[];
  unreadNotificationCount: number;
}
