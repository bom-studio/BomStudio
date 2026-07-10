import { notFound } from "next/navigation";
import { EstimateDetail } from "@/components/admin/EstimateDetail";
import { buildEstimateDocumentView } from "@/lib/admin/estimate-document";
import { fetchEstimateById } from "@/lib/admin/estimates";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적서 상세",
};

interface AdminEstimateDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEstimateDetailPage({ params }: AdminEstimateDetailPageProps) {
  const { id } = await params;
  const estimate = await fetchEstimateById(id);

  if (!estimate) {
    notFound();
  }

  const inquiry = await fetchInquiryById(estimate.inquiry_id);
  const documentView = buildEstimateDocumentView({ estimate, inquiry });

  return (
    <EstimateDetail estimate={estimate} inquiry={inquiry} documentView={documentView} />
  );
}
