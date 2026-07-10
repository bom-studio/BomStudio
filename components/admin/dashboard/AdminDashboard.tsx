import type { DashboardData } from "@/types/admin-dashboard";
import { DashboardHeader, KpiCards } from "@/components/admin/dashboard/DashboardHeader";
import { InquiryTrendChart } from "@/components/admin/dashboard/InquiryTrendChart";
import { InquiryStatusChart } from "@/components/admin/dashboard/InquiryStatusChart";
import { RecentInquiries } from "@/components/admin/dashboard/RecentInquiries";
import { RecentEstimates } from "@/components/admin/dashboard/RecentEstimates";
import { TodayTasks } from "@/components/admin/dashboard/TodayTasks";
import { QuickMenu } from "@/components/admin/dashboard/QuickMenu";
import { ProjectFunnel } from "@/components/admin/dashboard/ProjectFunnel";
import { MonthlyRevenueChart } from "@/components/admin/dashboard/MonthlyRevenueChart";
import { GoalProgressCard } from "@/components/admin/dashboard/GoalProgressCard";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";

interface AdminDashboardProps {
  data: DashboardData;
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <DashboardHeader
        userName={data.userName}
        todayLabel={data.todayLabel}
        notifications={data.notifications}
        unreadCount={data.unreadNotificationCount}
      />

      <KpiCards kpis={data.kpis} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InquiryTrendChart data={data.inquiryTrend} />
        </div>
        <div>
          <InquiryStatusChart data={data.inquiryStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GoalProgressCard goal={data.goal} />
        <div className="lg:col-span-2">
          <RecentActivity items={data.recentActivity} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentInquiries items={data.recentInquiries} />
        <RecentEstimates items={data.recentEstimates} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayTasks tasks={data.tasks} />
        <QuickMenu />
      </div>

      <ProjectFunnel steps={data.funnel} />

      <MonthlyRevenueChart data={data.monthlyRevenue} summary={data.revenueSummary} />
    </div>
  );
}
