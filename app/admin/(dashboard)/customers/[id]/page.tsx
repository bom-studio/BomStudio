import { notFound } from "next/navigation";
import { CustomerDetail } from "@/components/admin/CustomerDetail";
import { CustomersSetupRequired } from "@/components/admin/CustomersSetupRequired";
import { isCustomersTableMissingError } from "@/lib/admin/customer-errors";
import { fetchCustomerById } from "@/lib/admin/customers";

export const metadata = {
  title: "고객 상세",
};

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { id } = await params;

  try {
    const data = await fetchCustomerById(id);

    if (!data) {
      notFound();
    }

    return <CustomerDetail data={data} />;
  } catch (error) {
    if (isCustomersTableMissingError(error)) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">고객 상세</h1>
          </div>
          <CustomersSetupRequired />
        </div>
      );
    }
    throw error;
  }
}
