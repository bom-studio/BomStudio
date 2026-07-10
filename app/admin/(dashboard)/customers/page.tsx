import { CustomersTable, CustomersToolbar } from "@/components/admin/CustomersTable";
import { CustomerSummaryCards } from "@/components/admin/CustomerSummaryCards";
import { CustomersSetupRequired } from "@/components/admin/CustomersSetupRequired";
import { isCustomersTableMissingError } from "@/lib/admin/customer-errors";
import { fetchCustomerKpiSummary, fetchCustomers } from "@/lib/admin/customers";
import type { CustomerSort } from "@/constants/customer-admin";

export const metadata = {
  title: "고객 관리",
};

interface AdminCustomersPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  const { status = "전체", q = "", sort = "created_desc" } = await searchParams;

  try {
    const [customers, summary] = await Promise.all([
      fetchCustomers({ status, q, sort: sort as CustomerSort }),
      fetchCustomerKpiSummary(),
    ]);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">고객 관리</h1>
          <p className="mt-2 text-muted-foreground">총 {summary.total}명의 고객이 등록되어 있습니다.</p>
        </div>

        <CustomerSummaryCards summary={summary} />
        <CustomersToolbar currentStatus={status} currentQuery={q} currentSort={sort} />
        <CustomersTable customers={customers} />
      </div>
    );
  } catch (error) {
    if (isCustomersTableMissingError(error)) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">고객 관리</h1>
            <p className="mt-2 text-muted-foreground">데이터베이스 설정 후 이용할 수 있습니다.</p>
          </div>
          <CustomersSetupRequired />
        </div>
      );
    }
    throw error;
  }
}
