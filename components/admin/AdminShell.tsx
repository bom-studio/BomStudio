import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminShellProps {
  email?: string;
  children: React.ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-section lg:flex">
      <AdminSidebar email={email} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
