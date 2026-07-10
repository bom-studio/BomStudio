import { notFound } from "next/navigation";
import { getPaymentActivityLogs, getPaymentById } from "@/app/actions/payments";
import { PaymentDetail } from "@/components/admin/PaymentDetail";
import { fetchProjectByContractId } from "@/lib/admin/projects";

export const metadata = {
  title: "결제 상세",
};

interface AdminPaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps) {
  const { id } = await params;
  const payment = await getPaymentById(id);

  if (!payment) {
    notFound();
  }

  let projectId = payment.project_id;
  if (!projectId && payment.contract_id) {
    const project = await fetchProjectByContractId(payment.contract_id);
    projectId = project?.id ?? null;
  }

  const paymentWithProject = projectId ? { ...payment, project_id: projectId } : payment;
  const activityLogs = await getPaymentActivityLogs(id);

  return <PaymentDetail payment={paymentWithProject} activityLogs={activityLogs} />;
}
