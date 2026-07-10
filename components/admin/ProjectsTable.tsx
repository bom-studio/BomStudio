"use client";

import Link from "next/link";
import { updateProjectStatus } from "@/app/actions/projects";
import { PROJECT_STATUSES, PROJECT_STATUS_OPTIONS } from "@/constants/project-admin";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEstimateDate } from "@/lib/admin/estimate-display";
import type { SavedProject } from "@/types/admin-project";
import { cn } from "@/lib/utils";

interface ProjectsTableProps {
  projects: SavedProject[];
  currentStatus: string;
  currentQuery: string;
}

function buildProjectsUrl(status?: string, q?: string) {
  const params = new URLSearchParams();
  if (status && status !== "전체") params.set("status", status);
  if (q?.trim()) params.set("q", q.trim());
  const query = params.toString();
  return `/admin/projects${query ? `?${query}` : ""}`;
}

export function ProjectsToolbar({
  currentStatus,
  currentQuery,
}: Pick<ProjectsTableProps, "currentStatus" | "currentQuery">) {
  const activeStatus = currentStatus || "전체";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {["전체", ...PROJECT_STATUSES].map((status) => (
          <Link
            key={status}
            href={buildProjectsUrl(status, currentQuery)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              activeStatus === status
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-muted-foreground hover:border-primary/30"
            )}
          >
            {status}
          </Link>
        ))}
      </div>

      <form action="/admin/projects" method="get" className="w-full lg:max-w-xs">
        {currentStatus && currentStatus !== "전체" ? (
          <input type="hidden" name="status" value={currentStatus} />
        ) : null}
        <Input
          name="q"
          defaultValue={currentQuery}
          placeholder="프로젝트번호, 프로젝트명, 고객명, 연락처, 회사명 검색"
        />
      </form>
    </div>
  );
}

export function ProjectsTable({ projects }: Pick<ProjectsTableProps, "projects">) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-muted-foreground">진행 중인 프로젝트가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-white md:block">
        <table className="w-full text-center text-sm">
          <thead className="border-b border-border bg-section/60 text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">프로젝트번호</th>
              <th className="px-5 py-3 font-medium">프로젝트명</th>
              <th className="px-5 py-3 font-medium">진행상태</th>
              <th className="px-5 py-3 font-medium">진행률</th>
              <th className="px-5 py-3 font-medium">시작일</th>
              <th className="px-5 py-3 font-medium">완료예정일</th>
              <th className="px-5 py-3 font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-3 font-medium">{project.project_number}</td>
                <td className="px-5 py-3">{project.project_title || "-"}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <StatusSelect
                      value={project.status}
                      options={PROJECT_STATUS_OPTIONS}
                      onChange={(status) => updateProjectStatus(project.id, status)}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="mx-auto max-w-[120px]">
                    <ProgressBar value={project.progress} />
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatEstimateDate(project.start_date)}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatEstimateDate(project.due_date)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/projects/${project.id}`}>상세보기</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {projects.map((project) => (
          <div
            key={project.id}
            className="block rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{project.project_number}</p>
                <p className="mt-1 text-sm text-muted-foreground">{project.project_title || "-"}</p>
              </div>
              <StatusSelect
                value={project.status}
                options={PROJECT_STATUS_OPTIONS}
                onChange={(status) => updateProjectStatus(project.id, status)}
              />
            </div>
            <div className="mt-3">
              <ProgressBar value={project.progress} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatEstimateDate(project.start_date)}</span>
              <span>{formatEstimateDate(project.due_date)}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href={`/admin/projects/${project.id}`}>상세보기</Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
