import { ProjectsTable, ProjectsToolbar } from "@/components/admin/ProjectsTable";
import { fetchProjectCount, fetchProjects } from "@/lib/admin/projects";

export const metadata = {
  title: "프로젝트 관리",
};

interface AdminProjectsPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const { status = "전체", q = "" } = await searchParams;
  const [projects, totalCount] = await Promise.all([
    fetchProjects({ status, q }),
    fetchProjectCount(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">프로젝트 관리</h1>
        <p className="mt-2 text-muted-foreground">
          총 {totalCount}건의 프로젝트가 진행 중입니다.
        </p>
      </div>

      <ProjectsToolbar currentStatus={status} currentQuery={q} />
      <ProjectsTable projects={projects} />
    </div>
  );
}
