import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "관리자 로그인",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">Admin</p>
          <h1 className="mt-2 text-2xl font-bold">관리자 로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            견적문의 관리 페이지에 접속합니다.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
