import { notFound } from "next/navigation";
import { ContractDetail } from "@/components/admin/ContractDetail";
import { buildContractDocumentView } from "@/lib/admin/contract-document";
import { fetchContractById } from "@/lib/admin/contracts";
import { fetchEstimateById } from "@/lib/admin/estimates";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "계약서 상세",
};

interface AdminContractDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminContractDetailPage({ params }: AdminContractDetailPageProps) {
  const { id } = await params;
  const contract = await fetchContractById(id);

  if (!contract) {
    notFound();
  }

  const [estimate, inquiry] = await Promise.all([
    contract.estimate_id ? fetchEstimateById(contract.estimate_id) : null,
    contract.inquiry_id ? fetchInquiryById(contract.inquiry_id) : null,
  ]);

  const documentView = buildContractDocumentView({ contract, estimate, inquiry });

  return <ContractDetail contract={contract} documentView={documentView} />;
}
