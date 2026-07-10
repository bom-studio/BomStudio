"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, FileText, Loader2, ScrollText } from "lucide-react";
import { createProject, updateProject } from "@/app/actions/projects";
import { ProjectStatusBadge } from "@/components/admin/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PROJECT_STATUSES,
  getRecommendedProgress,
  type ProjectStatus,
} from "@/constants/project-admin";
import {
  formatProjectPeriod,
  formatRemainingDays,
  formatRemainingDaysLabel,
} from "@/lib/admin/project-display";
import { clampProgress } from "@/lib/admin/project-form";
import { buildProjectTitle } from "@/lib/admin/project-title";
import type { ProjectFormState } from "@/types/admin-project";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  initialForm: ProjectFormState;
  isEditMode?: boolean;
  projectId?: string;
}

const INPUT_CLASS = "h-10";
const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const FIELD_GAP = "gap-3";
const GRID_GAP = "gap-3";

function FormCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/80 bg-white px-4 py-3.5 shadow-sm sm:px-5 sm:py-4",
        className
      )}
    >
      <h2 className="mb-2.5 text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        {hint ? <span className="text-[11px] text-primary">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function ProgressField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const clamped = clampProgress(value);

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={100}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 min-w-0 flex-1 cursor-pointer accent-[#0F766E]"
        aria-label="진행률"
      />
      <div className="flex shrink-0 items-center gap-1.5">
        <Input
          type="number"
          min={0}
          max={100}
          value={clamped}
          onChange={(e) => onChange(clampProgress(Number(e.target.value || 0)))}
          className={cn(INPUT_CLASS, "w-14 px-2 text-center text-sm")}
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function ProjectForm({ initialForm, isEditMode = false, projectId }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const progressValue = clampProgress(Number(form.progress || 0));

  const remainingLabel = useMemo(
    () => formatRemainingDays(form.dueDate),
    [form.dueDate]
  );
  const remainingDaysText = useMemo(
    () => formatRemainingDaysLabel(form.dueDate),
    [form.dueDate]
  );
  const periodText = useMemo(
    () => formatProjectPeriod(form.startDate, form.dueDate),
    [form.startDate, form.dueDate]
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateField = <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "company") {
        next.projectTitle = buildProjectTitle(value as string, prev.contractType);
      }

      return next;
    });
  };

  const handleStatusChange = (status: ProjectStatus) => {
    setForm((prev) => ({
      ...prev,
      status,
      progress: String(getRecommendedProgress(status)),
    }));
  };

  const handleProgressChange = (value: number) => {
    updateField("progress", String(clampProgress(value)));
  };

  const buildInput = () => ({
    inquiryId: form.inquiryId || undefined,
    estimateId: form.estimateId || undefined,
    contractId: form.contractId || undefined,
    projectNumber: form.projectNumber,
    projectTitle: buildProjectTitle(form.company, form.contractType),
    contractType: form.contractType || undefined,
    customerName: form.customerName,
    company: form.company,
    phone: form.phone,
    email: form.email,
    startDate: form.startDate || undefined,
    dueDate: form.dueDate || undefined,
    status: form.status,
    progress: progressValue,
    domain: form.domain,
    hosting: form.hosting,
    githubRepo: form.githubRepo,
    figmaUrl: form.figmaUrl,
    deploymentUrl: form.deploymentUrl,
    memo: form.memo,
  });

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const input = buildInput();

      if (isEditMode && projectId) {
        const result = await updateProject(projectId, input);
        if (!result.success) {
          setError(result.error);
          return;
        }
        router.push(`/admin/projects/${projectId}`);
        router.refresh();
        return;
      }

      const result = await createProject(input);
      if (!result.success) {
        setError(result.error);
        return;
      }

      setToast("프로젝트가 생성되었습니다.");
      window.setTimeout(() => {
        if (result.projectId) {
          router.push(`/admin/projects/${result.projectId}`);
        }
      }, 900);
    });
  };

  const backHref =
    isEditMode && projectId
      ? `/admin/projects/${projectId}`
      : form.contractId
        ? `/admin/contracts/${form.contractId}`
        : "/admin/projects";

  const estimateHref = form.estimateId ? `/admin/estimates/${form.estimateId}` : undefined;
  const contractHref = form.contractId ? `/admin/contracts/${form.contractId}` : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Button asChild variant="ghost" size="icon" className="mt-0.5 h-9 w-9 shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? "프로젝트 수정" : "프로젝트 생성"}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isEditMode
                ? "프로젝트 정보를 수정합니다."
                : "계약서를 기반으로 프로젝트를 생성합니다."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {estimateHref ? (
            <Button asChild variant="outline" size="sm" className="h-9">
              <Link href={estimateHref}>
                <FileText className="h-4 w-4" />
                견적서 보기
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-9" disabled>
              <FileText className="h-4 w-4" />
              견적서 보기
            </Button>
          )}
          {contractHref ? (
            <Button asChild variant="outline" size="sm" className="h-9">
              <Link href={contractHref}>
                <ScrollText className="h-4 w-4" />
                계약서 보기
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-9" disabled>
              <ScrollText className="h-4 w-4" />
              계약서 보기
            </Button>
          )}
        </div>
      </div>

      <FormCard title="기본 정보">
        <div className={cn("flex flex-col", FIELD_GAP)}>
          <Field label="프로젝트 번호">
            <Input
              value={form.projectNumber}
              readOnly
              className={cn(INPUT_CLASS, "bg-muted/30 font-mono text-sm")}
            />
          </Field>
          <Field label="프로젝트명" hint="회사명+계약유형">
            <Input
              value={form.projectTitle}
              readOnly
              className={cn(INPUT_CLASS, "bg-muted/30")}
              placeholder="회사명+계약유형으로 자동 생성"
            />
          </Field>
          <div className={cn("grid sm:grid-cols-2", GRID_GAP)}>
            <Field label="고객명">
              <Input
                value={form.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="회사명">
              <Input
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="연락처">
              <Input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="이메일">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
        </div>
      </FormCard>

      <FormCard title="일정 / 진행 상태">
        <div className={cn("flex flex-col", FIELD_GAP)}>
          <div className={cn("grid sm:grid-cols-2", GRID_GAP)}>
            <Field label="시작일">
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field
              label="완료 예정일"
              hint={
                remainingLabel && remainingDaysText
                  ? `${remainingDaysText} (${remainingLabel})`
                  : undefined
              }
            >
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label="진행 상태">
            <div className="flex items-center gap-2">
              <select
                value={form.status}
                onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                className={cn(SELECT_CLASS, "min-w-0 flex-1")}
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ProjectStatusBadge status={form.status} className="shrink-0" />
            </div>
          </Field>

          <Field label="진행률">
            <ProgressField value={progressValue} onChange={handleProgressChange} />
          </Field>
        </div>
      </FormCard>

      <FormCard title="작업 링크">
        <div className={cn("grid sm:grid-cols-2", GRID_GAP)}>
          <Field label="도메인">
            <Input
              value={form.domain}
              onChange={(e) => updateField("domain", e.target.value)}
              placeholder="bomstudio.kr"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="호스팅">
            <Input
              value={form.hosting}
              onChange={(e) => updateField("hosting", e.target.value)}
              placeholder="https://dashboard.cafe24.com"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="GitHub">
            <Input
              value={form.githubRepo}
              onChange={(e) => updateField("githubRepo", e.target.value)}
              placeholder="https://github.com/bom-studio/project"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Figma">
            <Input
              value={form.figmaUrl}
              onChange={(e) => updateField("figmaUrl", e.target.value)}
              placeholder="https://www.figma.com/file/..."
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="배포 URL" className="sm:col-span-2">
            <Input
              value={form.deploymentUrl}
              onChange={(e) => updateField("deploymentUrl", e.target.value)}
              placeholder="https://project.vercel.app"
              className={INPUT_CLASS}
            />
          </Field>
        </div>
      </FormCard>

      <FormCard title="메모">
        <Textarea
          value={form.memo}
          onChange={(e) => updateField("memo", e.target.value)}
          placeholder="프로젝트 진행 중 참고할 내용을 입력하세요."
          className="min-h-[120px] resize-y py-2.5 text-sm leading-relaxed"
          rows={4}
        />
      </FormCard>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="space-y-3 rounded-xl border border-border/80 bg-muted/15 px-4 py-3">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            생성 전 확인
          </p>
          <div className={cn("grid sm:grid-cols-2 lg:grid-cols-3", GRID_GAP)}>
            <SummaryItem label="프로젝트명" value={form.projectTitle.trim() || "-"} />
            <SummaryItem label="회사명" value={form.company.trim() || "-"} />
            <SummaryItem label="계약기간" value={periodText} />
            <SummaryItem label="진행상태" value={form.status} />
            <SummaryItem label="진행률" value={`${progressValue}%`} />
            {remainingLabel ? (
              <SummaryItem
                label="남은 기간"
                value={`${remainingDaysText ?? "-"} (${remainingLabel})`}
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border/50 pt-3">
          <Button type="button" variant="outline" asChild disabled={isPending} className="h-10">
            <Link href={backHref}>취소</Link>
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending} className="h-10">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : isEditMode ? (
              "프로젝트 수정"
            ) : (
              "프로젝트 생성"
            )}
          </Button>
        </div>
      </section>

      {toast ? (
        <p
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </p>
      ) : null}
    </div>
  );
}
