import { ContractsTable, ContractsToolbar } from "@/components/admin/ContractsTable";
import { fetchContractCount, fetchContracts } from "@/lib/admin/contracts";

export const metadata = {
  title: "계약서 관리",
};

interface AdminContractsPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
}

export default async function AdminContractsPage({ searchParams }: AdminContractsPageProps) {
  const { status = "전체", q = "" } = await searchParams;
  const [contracts, totalCount] = await Promise.all([
    fetchContracts({ status, q }),
    fetchContractCount(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">계약서 관리</h1>
        <p className="mt-2 text-muted-foreground">
          총 {totalCount}건의 계약서가 작성되었습니다.
        </p>
      </div>

      <ContractsToolbar currentStatus={status} currentQuery={q} />
      <ContractsTable contracts={contracts} />
    </div>
  );
}
