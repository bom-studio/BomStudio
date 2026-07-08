import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminUser } from "@/lib/admin/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-section">
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
