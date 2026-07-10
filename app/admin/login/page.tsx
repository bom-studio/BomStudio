import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export const metadata = {
  title: "관리자 로그인",
};

interface AdminLoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const adminUser = await getAdminUser();

  if (adminUser) {
    const redirectTo =
      params.redirect && params.redirect.startsWith("/admin") ? params.redirect : "/admin";
    redirect(redirectTo);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-bold text-primary">
            BOM STUDIO
          </Link>
          <h1 className="mt-4 text-2xl font-bold">관리자 로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">관리자 전용 페이지입니다.</p>
        </div>
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-muted/60" />}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
