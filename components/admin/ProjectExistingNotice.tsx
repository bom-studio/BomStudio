import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SavedProject } from "@/types/admin-project";

interface ProjectExistingNoticeProps {
  project: SavedProject;
}

export function ProjectExistingNotice({ project }: ProjectExistingNoticeProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-12 text-center">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold">이미 생성된 프로젝트가 있습니다.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          이 계약서와 연결된 프로젝트가 이미 존재합니다.
        </p>
        <p className="mt-4 font-medium text-foreground">{project.project_number}</p>
        <p className="text-sm text-muted-foreground">{project.project_title || "-"}</p>
        <Button asChild className="mt-6">
          <Link href={`/admin/projects/${project.id}`}>기존 프로젝트 보기</Link>
        </Button>
      </div>
    </div>
  );
}
