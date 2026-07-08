import { notFound } from "next/navigation";
import { InquiryDetail } from "@/components/admin/InquiryDetail";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "견적문의 상세",
};

interface AdminInquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInquiryDetailPage({ params }: AdminInquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = await fetchInquiryById(id);

  if (!inquiry) {
    notFound();
  }

  return <InquiryDetail inquiry={inquiry} />;
}
