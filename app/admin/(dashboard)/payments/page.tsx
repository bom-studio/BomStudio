import {
  getPaymentActivityLogs,
  getPaymentById,
  getPaymentSummary,
  getPayments,
  getPaymentsCount,
} from "@/app/actions/payments";
import { PaymentsSummaryCards } from "@/components/admin/PaymentsSummaryCards";
import { PaymentsTable, PaymentsToolbar } from "@/components/admin/PaymentsTable";

export const metadata = {
  title: "매출관리",
};

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    status?: string;
    period?: string;
    q?: string;
  }>;
}

export default async function AdminPaymentsPage({ searchParams }: AdminPaymentsPageProps) {
  const { status = "전체", period = "이번달", q = "" } = await searchParams;

  const [payments, totalCount, summary] = await Promise.all([
    getPayments({ status, period, q }),
    getPaymentsCount(),
    getPaymentSummary(period),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">매출관리</h1>
        <p className="mt-2 text-muted-foreground">총 {totalCount}건의 결제 내역이 있습니다.</p>
      </div>

      <PaymentsSummaryCards summary={summary} periodLabel={period} />

      <PaymentsToolbar currentStatus={status} currentPeriod={period} currentQuery={q} />
      <PaymentsTable payments={payments} />
    </div>
  );
}
