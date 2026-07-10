import { notFound } from "next/navigation";
import { ProjectExistingNotice } from "@/components/admin/ProjectExistingNotice";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { fetchContractById } from "@/lib/admin/contracts";
import { fetchProjectByContractId } from "@/lib/admin/projects";
import {
  buildProjectFormFromContract,
  createEmptyProjectForm,
} from "@/lib/admin/project-form";

export const metadata = {
  title: "프로젝트 생성",
};

interface NewProjectPageProps {
  searchParams: Promise<{ contractId?: string }>;
}

export default async function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const { contractId } = await searchParams;

  if (!contractId) {
    return <ProjectForm initialForm={createEmptyProjectForm()} />;
  }

  const existing = await fetchProjectByContractId(contractId);
  if (existing) {
    return <ProjectExistingNotice project={existing} />;
  }

  const contract = await fetchContractById(contractId);
  if (!contract) {
    notFound();
  }

  const initialForm = buildProjectFormFromContract(contract);

  return <ProjectForm initialForm={initialForm} />;
}
