import { redirect } from "next/navigation";

interface EditContractPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContractPage({ params }: EditContractPageProps) {
  const { id } = await params;
  redirect(`/admin/contracts/new?contractId=${id}`);
}
