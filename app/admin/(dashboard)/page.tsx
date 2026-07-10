import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";
import { fetchDashboardData } from "@/lib/admin/dashboard";

export const metadata = {
  title: "대시보드",
};

export default async function AdminDashboardPage() {
  const data = await fetchDashboardData();
  return <AdminDashboard data={data} />;
}
