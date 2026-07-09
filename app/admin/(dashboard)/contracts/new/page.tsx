import { notFound } from "next/navigation";
import { ContractForm } from "@/components/admin/ContractForm";
import { fetchContractById } from "@/lib/admin/contracts";
import { fetchEstimateById } from "@/lib/admin/estimates";
import {
  buildContractFormFromEstimate,
  buildContractFormFromSaved,
  createEmptyContractForm,
} from "@/lib/admin/contract-form";

export const metadata = {
  title: "계약서 작성",
};

interface NewContractPageProps {
  searchParams: Promise<{ estimateId?: string; contractId?: string }>;
}

export default async function NewContractPage({ searchParams }: NewContractPageProps) {
  const { estimateId, contractId } = await searchParams;

  if (contractId) {
    const contract = await fetchContractById(contractId);
    if (!contract) {
      notFound();
    }

    return (
      <ContractForm
        initialForm={buildContractFormFromSaved(contract)}
        isEditMode
        contractId={contract.id}
      />
    );
  }

  if (!estimateId) {
    return <ContractForm initialForm={createEmptyContractForm()} />;
  }

  const estimate = await fetchEstimateById(estimateId);
  if (!estimate) {
    notFound();
  }

  const initialForm = buildContractFormFromEstimate(estimate);

  return <ContractForm initialForm={initialForm} />;
}
