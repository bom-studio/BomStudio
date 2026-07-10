import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { fetchContractById } from "@/lib/admin/contracts";
import { fetchProjectById } from "@/lib/admin/projects";
import { buildProjectFormFromSaved } from "@/lib/admin/project-form";

export const metadata = {
  title: "프로젝트 수정",
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) {
    notFound();
  }

  const contract = project.contract_id
    ? await fetchContractById(project.contract_id)
    : null;

  return (
    <ProjectForm
      initialForm={buildProjectFormFromSaved(project, contract?.contract_type)}
      isEditMode
      projectId={project.id}
    />
  );
}
