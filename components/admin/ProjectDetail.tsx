"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, CheckCircle2, ExternalLink, Pencil, Trash2 } from "lucide-react";
import {
  completeProject,
  deleteProject,
  updateProjectStatus,
} from "@/app/actions/projects";
import { ConfirmDialog } from "@/components/admin/inquiry/ConfirmDialog";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { ProjectStatusBadge } from "@/components/admin/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import {
  PROJECT_STATUSES,
  getRecommendedProgress,
  type ProjectStatus,
} from "@/constants/project-admin";
import { displayContractValue } from "@/lib/admin/contract-display";
import {
  formatEstimateDate,
  formatEstimateDateTime,
} from "@/lib/admin/estimate-display";
import type { ActivityLog, SavedProject } from "@/types/admin-project";
import { cn } from "@/lib/utils";

interface ProjectDetailProps {
  project: SavedProject;
  activityLogs: ActivityLog[];
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="break-words text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function LinkField({ label, value }: { label: string; value: string | null | undefined }) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return <Field label={label} value="-" />;
  }

  const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 break-all text-sm font-medium text-primary hover:underline"
      >
        {trimmed}
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </a>
    </div>
  );
}

function ActivityTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    작업: "bg-sky-100 text-sky-700",
    완료: "bg-emerald-100 text-emerald-700",
    메모: "bg-slate-100 text-slate-700",
    상태변경: "bg-amber-100 text-amber-800",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        styles[type] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {type}
    </span>
  );
}

export function ProjectDetail({ project, activityLogs }: ProjectDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState((project.status as ProjectStatus) || "대기중");
  const [progress, setProgress] = useState(project.progress);
  const [showDelete, setShowDelete] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isCompletePending, startCompleteTransition] = useTransition();

  const editHref = `/admin/projects/${project.id}/edit`;
  const contractHref = project.contract_id
    ? `/admin/contracts/${project.contract_id}`
    : undefined;
  const estimateHref = project.estimate_id
    ? `/admin/estimates/${project.estimate_id}`
    : undefined;

  const handleStatusChange = (nextStatus: ProjectStatus) => {
    const recommended = getRecommendedProgress(nextStatus);
    setStatus(nextStatus);
    setProgress(recommended);
    setMessage(null);

    startStatusTransition(async () => {
      const result = await updateProjectStatus(project.id, nextStatus, recommended);
      if (!result.success) {
        setStatus((project.status as ProjectStatus) || "대기중");
        setProgress(project.progress);
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleComplete = () => {
    startCompleteTransition(async () => {
      const result = await completeProject(project.id);
      if (!result.success) {
        setMessage(result.error);
        setShowComplete(false);
        return;
      }
      setStatus("완료");
      setProgress(100);
      setShowComplete(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteProject(project.id);
      if (!result.success) {
        setMessage(result.error);
        setShowDelete(false);
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">프로젝트 상세</h1>
            <p className="mt-1 text-base font-semibold text-gray-800">{project.project_number}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              생성일 {formatEstimateDateTime(project.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:pt-1">
          <select
            value={status}
            disabled={isStatusPending}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="프로젝트 상태"
          >
            {PROJECT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ProjectStatusBadge status={status} />
        </div>
      </header>

      {message ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {message}
        </p>
      ) : null}

      <DetailCard title="프로젝트 요약">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="프로젝트명" value={displayContractValue(project.project_title)} />
          <Field label="고객명" value={displayContractValue(project.customer_name)} />
          <Field label="회사명" value={displayContractValue(project.company)} />
          <Field label="연락처" value={displayContractValue(project.phone)} />
          <Field label="이메일" value={displayContractValue(project.email)} />
          <Field label="시작일" value={formatEstimateDate(project.start_date)} />
          <Field label="완료예정일" value={formatEstimateDate(project.due_date)} />
          <Field
            label="완료일"
            value={
              project.completed_at ? formatEstimateDateTime(project.completed_at) : "-"
            }
          />
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 text-sm text-gray-500">진행률</p>
          <ProgressBar value={progress} className="max-w-md" />
        </div>
      </DetailCard>

      <DetailCard title="작업 링크">
        <div className="grid gap-4 sm:grid-cols-2">
          <LinkField label="도메인" value={project.domain} />
          <LinkField label="호스팅" value={project.hosting} />
          <LinkField label="GitHub 저장소" value={project.github_repo} />
          <LinkField label="Figma" value={project.figma_url} />
          <LinkField label="배포 URL" value={project.deployment_url} />
        </div>
      </DetailCard>

      <DetailCard title="작업 메모 / 활동 로그">
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">관리자 메모</p>
            {project.memo?.trim() ? (
              <p className="whitespace-pre-line text-sm leading-7 text-gray-800">{project.memo}</p>
            ) : (
              <p className="text-sm text-gray-400">등록된 메모가 없습니다.</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">활동 로그</p>
            {activityLogs.length > 0 ? (
              <ul className="space-y-3">
                {activityLogs.map((log) => (
                  <li
                    key={log.id}
                    className="rounded-lg border border-border/70 bg-muted/10 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <ActivityTypeBadge type={log.type} />
                      <span className="text-xs text-muted-foreground">
                        {formatEstimateDateTime(log.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-800">{log.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">활동 로그가 없습니다.</p>
            )}
          </div>
        </div>
      </DetailCard>

      <section className="rounded-xl border border-border bg-white px-5 py-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href={editHref}>
              <Pencil className="h-4 w-4" />
              수정하기
            </Link>
          </Button>
          {contractHref ? (
            <Button asChild variant="secondary">
              <Link href={contractHref}>연결 계약서 보기</Link>
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              연결 계약서 보기
            </Button>
          )}
          {estimateHref ? (
            <Button asChild variant="secondary">
              <Link href={estimateHref}>연결 견적서 보기</Link>
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              연결 견적서 보기
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            disabled={status === "완료" || isCompletePending}
            onClick={() => setShowComplete(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
            완료 처리
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:bg-destructive/5 hover:text-destructive sm:ml-auto"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            삭제하기
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={showComplete}
        title="프로젝트 완료 처리"
        description="이 프로젝트를 완료 처리하시겠습니까? 연결된 계약서와 문의 상태도 함께 업데이트됩니다."
        confirmLabel="완료 처리"
        isPending={isCompletePending}
        onConfirm={handleComplete}
        onCancel={() => setShowComplete(false)}
      />

      <ConfirmDialog
        open={showDelete}
        title="프로젝트 삭제"
        description="이 프로젝트를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        isPending={isDeletePending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
