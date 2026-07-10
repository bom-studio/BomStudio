import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/admin/ProjectDetail";
import { fetchActivityLogsByProjectId } from "@/lib/admin/activity-logs";
import { fetchProjectById } from "@/lib/admin/projects";

export const metadata = {
  title: "프로젝트 상세",
};

interface AdminProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectDetailPage({ params }: AdminProjectDetailPageProps) {
  const { id } = await params;
  const [project, activityLogs] = await Promise.all([
    fetchProjectById(id),
    fetchActivityLogsByProjectId(id),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} activityLogs={activityLogs} />;
}
