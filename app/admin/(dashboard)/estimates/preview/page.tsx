import { notFound } from "next/navigation";
import { EstimatePreview } from "@/components/admin/EstimatePreview";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적서 미리보기",
};

interface EstimatePreviewPageProps {
  searchParams: Promise<{ inquiryId?: string; draft?: string }>;
}

export default async function EstimatePreviewPage({ searchParams }: EstimatePreviewPageProps) {
  const { inquiryId, draft } = await searchParams;

  if (!inquiryId) {
    notFound();
  }

  const inquiry = await fetchInquiryById(inquiryId);
  if (!inquiry) {
    notFound();
  }

  return <EstimatePreview inquiry={inquiry} draftParam={draft} />;
}
