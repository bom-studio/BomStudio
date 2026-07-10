import { notFound } from "next/navigation";
import { EstimatePreview } from "@/components/admin/estimate/EstimatePreview";
import { buildEstimateDocumentView } from "@/lib/admin/estimate-document";
import { fetchEstimateById } from "@/lib/admin/estimates";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적서 미리보기",
};

interface EstimatePreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function EstimateDetailPreviewPage({ params }: EstimatePreviewPageProps) {
  const { id } = await params;
  const estimate = await fetchEstimateById(id);

  if (!estimate) {
    notFound();
  }

  const inquiry = await fetchInquiryById(estimate.inquiry_id);
  const documentView = buildEstimateDocumentView({ estimate, inquiry });

  return <EstimatePreview estimateId={estimate.id} documentView={documentView} />;
}
