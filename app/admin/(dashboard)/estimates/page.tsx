import Link from "next/link";
import { Plus } from "lucide-react";
import { EstimatesTable, EstimatesToolbar } from "@/components/admin/EstimatesTable";
import { Button } from "@/components/ui/button";
import { fetchEstimateCount, fetchEstimates } from "@/lib/admin/estimates";

export const metadata = {
  title: "견적서 관리",
};

interface AdminEstimatesPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
}

export default async function AdminEstimatesPage({ searchParams }: AdminEstimatesPageProps) {
  const { status = "전체", q = "" } = await searchParams;
  const [estimates, totalCount] = await Promise.all([
    fetchEstimates({ status, q }),
    fetchEstimateCount(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">견적서 관리</h1>
          <p className="mt-2 text-muted-foreground">
            총 {totalCount}건의 견적서가 작성되었습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/estimates/new">
            <Plus className="h-4 w-4" />
            견적서 작성
          </Link>
        </Button>
      </div>

      <EstimatesToolbar currentStatus={status} currentQuery={q} />
      <EstimatesTable estimates={estimates} />
    </div>
  );
}
