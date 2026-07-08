import { InquiriesTable, InquiriesToolbar } from "@/components/admin/InquiriesTable";
import { fetchInquiries, fetchInquiryCount } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적문의 관리",
};

interface AdminInquiriesPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
}

export default async function AdminInquiriesPage({ searchParams }: AdminInquiriesPageProps) {
  const { status = "전체", q = "" } = await searchParams;
  const [inquiries, totalCount] = await Promise.all([
    fetchInquiries({ status, q }),
    fetchInquiryCount(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">견적문의 관리</h1>
        <p className="mt-2 text-muted-foreground">총 {totalCount}건의 문의가 접수되었습니다.</p>
      </div>

      <InquiriesToolbar currentStatus={status} currentQuery={q} />
      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
