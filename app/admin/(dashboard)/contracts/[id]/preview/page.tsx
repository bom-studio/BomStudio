import { notFound } from "next/navigation";
import { ContractPreview } from "@/components/admin/contract/ContractPreview";
import { buildContractDocumentView } from "@/lib/admin/contract-document";
import { fetchContractById } from "@/lib/admin/contracts";
import { fetchEstimateById } from "@/lib/admin/estimates";
import { fetchInquiryById } from "@/lib/admin/inquiries";

export const metadata = {
  title: "계약서 미리보기",
};

interface ContractPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractPreviewPage({ params }: ContractPreviewPageProps) {
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

  return <ContractPreview contractId={contract.id} documentView={documentView} />;
}
