import { notFound } from "next/navigation";
import { getEstimateById, getEstimateByInquiryId } from "@/app/actions/estimates";
import { EstimateBuilderForm } from "@/components/admin/EstimateBuilderForm";
import { EstimateNewLanding } from "@/components/admin/estimate/EstimateNewLanding";
import { fetchEstimateById } from "@/lib/admin/estimates";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적서 작성",
};

interface NewEstimatePageProps {
  searchParams: Promise<{ inquiryId?: string; estimateId?: string }>;
}

export default async function NewEstimatePage({ searchParams }: NewEstimatePageProps) {
  const { inquiryId, estimateId } = await searchParams;

  if (!inquiryId && !estimateId) {
    return <EstimateNewLanding />;
  }

  let resolvedInquiryId = inquiryId;

  if (!resolvedInquiryId && estimateId) {
    const estimate = await getEstimateById(estimateId);
    if (!estimate) {
      notFound();
    }
    resolvedInquiryId = estimate.inquiry_id;
  }

  if (!resolvedInquiryId) {
    notFound();
  }

  const [inquiry, savedEstimate] = await Promise.all([
    fetchInquiryById(resolvedInquiryId),
    estimateId
      ? fetchEstimateById(estimateId)
      : getEstimateByInquiryId(resolvedInquiryId),
  ]);

  if (!inquiry) {
    notFound();
  }

  const isEditMode = Boolean(estimateId && savedEstimate);

  return (
    <EstimateBuilderForm
      inquiry={inquiry}
      savedEstimate={savedEstimate}
      isEditMode={isEditMode}
    />
  );
}
