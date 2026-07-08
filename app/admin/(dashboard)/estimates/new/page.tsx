import { notFound } from "next/navigation";
import { EstimateBuilderForm } from "@/components/admin/EstimateBuilderForm";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적서 작성",
};

interface NewEstimatePageProps {
  searchParams: Promise<{ inquiryId?: string }>;
}

export default async function NewEstimatePage({ searchParams }: NewEstimatePageProps) {
  const { inquiryId } = await searchParams;

  if (!inquiryId) {
    notFound();
  }

  const inquiry = await fetchInquiryById(inquiryId);
  if (!inquiry) {
    notFound();
  }

  return <EstimateBuilderForm inquiry={inquiry} />;
}
