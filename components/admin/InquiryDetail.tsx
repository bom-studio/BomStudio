"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import {
  deleteInquiry,
  updateInquiryAdminNote,
  updateInquiryStatus,
} from "@/app/actions/inquiries";
import { ConfirmDialog } from "@/components/admin/inquiry/ConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/constants/inquiry";
import { getInquiryDisplayNumber } from "@/lib/admin/inquiry-number";
import { buildInquiryCopyText, formatInquiryDate, parseReferenceUrls } from "@/lib/admin/inquiry-utils";
import { formatBudgetCurrency } from "@/lib/format/budget";
import { cn } from "@/lib/utils";
import type { AdjacentInquiryIds, EstimateInquiry } from "@/types/inquiry";

interface InquiryDetailProps {
  inquiry: EstimateInquiry;
  adjacent: AdjacentInquiryIds;
}

function AdminCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex rounded-md bg-section px-2 py-1 text-xs font-medium text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-section hover:text-foreground"
      aria-label={label ?? "복사"}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

function EstimateStatusBadge({ inquiry }: { inquiry: EstimateInquiry }) {
  if (inquiry.estimate_id) {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          생성 완료
        </span>
        {inquiry.estimate_created_at ? (
          <span className="text-xs text-muted-foreground">
            {formatInquiryDate(inquiry.estimate_created_at)}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      미생성
    </span>
  );
}

export function InquiryDetail({ inquiry, adjacent }: InquiryDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [adminNote, setAdminNote] = useState(inquiry.admin_note ?? "");
  const [noteStatus, setNoteStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const inquiryNumber = getInquiryDisplayNumber(inquiry);
  const referenceUrls = parseReferenceUrls(inquiry.reference);

  const saveAdminNote = useCallback(
    (note: string) => {
      setNoteStatus("saving");
      startTransition(async () => {
        const result = await updateInquiryAdminNote(inquiry.id, note);
        setNoteStatus(result.success ? "saved" : "error");
        if (result.success) {
          setTimeout(() => setNoteStatus("idle"), 2000);
        }
      });
    },
    [inquiry.id]
  );

  useEffect(() => {
    if (adminNote === (inquiry.admin_note ?? "")) {
      return;
    }

    const timer = setTimeout(() => {
      saveAdminNote(adminNote);
    }, 1500);

    return () => clearTimeout(timer);
  }, [adminNote, inquiry.admin_note, saveAdminNote]);

  const handleStatusChange = (status: InquiryStatus) => {
    startTransition(async () => {
      await updateInquiryStatus(inquiry.id, status);
    });
  };

  const handleCopyInquiry = async () => {
    const text = buildInquiryCopyText({
      inquiryNumber,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      company: inquiry.company,
      business_type: inquiry.business_type,
      budget: inquiry.budget,
      schedule: inquiry.schedule,
      pages: inquiry.pages,
      features: inquiry.features,
      reference: inquiry.reference,
      message: inquiry.message,
      status: inquiry.status,
      created_at: inquiry.created_at,
    });
    await navigator.clipboard.writeText(text);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteInquiry(inquiry.id);
    });
  };

  const mailtoHref = inquiry.email
    ? `mailto:${inquiry.email}?subject=${encodeURIComponent(`[BOM STUDIO] 견적문의 ${inquiryNumber} 답변`)}`
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 px-2 text-muted-foreground">
              <Link href="/admin/inquiries">
                <ArrowLeft className="h-4 w-4" />
                목록으로
              </Link>
            </Button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                  견적문의 {inquiryNumber}
                </h1>
                <EstimateStatusBadge inquiry={inquiry} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>접수일 {formatInquiryDate(inquiry.created_at)}</span>
                <span>마지막 수정 {formatInquiryDate(inquiry.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-5 flex gap-2 border-t border-border pt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={!adjacent.prevId}
            className={!adjacent.prevId ? "pointer-events-none opacity-40" : ""}
          >
            <Link href={adjacent.prevId ? `/admin/inquiries/${adjacent.prevId}` : "#"}>
              <ArrowLeft className="h-4 w-4" />
              이전 문의
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={!adjacent.nextId}
            className={!adjacent.nextId ? "pointer-events-none opacity-40" : ""}
          >
            <Link href={adjacent.nextId ? `/admin/inquiries/${adjacent.nextId}` : "#"}>
              다음 문의
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Body: 70 / 30 */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        {/* Left column */}
        <div className="space-y-5">
          <AdminCard title="고객 정보" icon={<User className="h-4 w-4" />}>
            <div className="divide-y divide-border/70">
              <InfoRow icon={<User className="h-4 w-4" />} label="이름" value={inquiry.name} />
              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label="회사명"
                value={inquiry.company || "-"}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="연락처"
                value={inquiry.phone}
                action={<CopyButton value={inquiry.phone} label="연락처 복사" />}
              />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="이메일"
                value={
                  inquiry.email ? (
                    <a
                      href={mailtoHref}
                      className="text-primary hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label="업종"
                value={inquiry.business_type || "-"}
              />
            </div>
          </AdminCard>

          <AdminCard title="프로젝트 정보" icon={<Wallet className="h-4 w-4" />}>
            <div className="space-y-4">
              <InfoRow
                icon={<Wallet className="h-4 w-4" />}
                label="예상 예산"
                value={
                  <span className="text-base font-semibold text-foreground">
                    {formatBudgetCurrency(inquiry.budget)}
                  </span>
                }
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="희망 일정"
                value={inquiry.schedule || "-"}
              />
              <div className="space-y-2 border-t border-border/70 pt-4">
                <p className="text-xs font-medium text-muted-foreground">필요 페이지</p>
                <TagList items={inquiry.pages} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">필요 기능</p>
                <TagList items={inquiry.features} />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="문의 내용" icon={<MessageSquare className="h-4 w-4" />}>
            {inquiry.message?.trim() ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {inquiry.message}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">등록된 문의 내용이 없습니다.</p>
            )}
          </AdminCard>

          <AdminCard title="참고 사이트" icon={<Globe className="h-4 w-4" />}>
            {referenceUrls.length > 0 ? (
              <ul className="space-y-2">
                {referenceUrls.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      {url}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">등록된 참고 사이트가 없습니다.</p>
            )}
          </AdminCard>
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <AdminCard title="현재 상태" icon={<ChevronDown className="h-4 w-4" />}>
            <div className="space-y-4">
              <StatusBadge status={inquiry.status} className="px-3 py-1.5 text-sm" />
              <div className="relative">
                <label htmlFor="status-select" className="sr-only">
                  상태 변경
                </label>
                <select
                  id="status-select"
                  value={inquiry.status}
                  disabled={isPending}
                  onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-8 text-sm font-medium shadow-sm transition-colors hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  {INQUIRY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              {isPending ? (
                <p className="text-xs text-muted-foreground">저장 중...</p>
              ) : (
                <p className="text-xs text-muted-foreground">상태 변경 시 즉시 저장됩니다.</p>
              )}
            </div>
          </AdminCard>

          <AdminCard title="관리자 메모" icon={<StickyNote className="h-4 w-4" />}>
            <Textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="전화 상담 내용, 추가 요청사항, 가격 협의 등을 자유롭게 작성하세요."
              className="min-h-36 resize-y rounded-lg border-border text-sm leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">입력 후 1.5초 뒤 자동 저장</p>
              <div className="flex items-center gap-2">
                {noteStatus === "saving" && (
                  <span className="text-xs text-muted-foreground">저장 중...</span>
                )}
                {noteStatus === "saved" && (
                  <span className="text-xs text-primary">저장됨</span>
                )}
                {noteStatus === "error" && (
                  <span className="text-xs text-rose-600">저장 실패</span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => saveAdminNote(adminNote)}
                >
                  저장
                </Button>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="빠른 작업" icon={<FileText className="h-4 w-4" />}>
            <div className="space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link href={`/admin/estimates/new?inquiryId=${inquiry.id}`}>
                  <FileText className="h-4 w-4" />
                  견적서 작성
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCopyInquiry}
              >
                <Copy className="h-4 w-4" />
                {copyStatus === "copied" ? "복사 완료" : "문의 복사"}
              </Button>

              {mailtoHref ? (
                <Button asChild variant="outline" className="w-full">
                  <a href={mailtoHref}>
                    <Mail className="h-4 w-4" />
                    이메일 보내기
                  </a>
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Mail className="h-4 w-4" />
                  이메일 없음
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </Button>
            </div>
          </AdminCard>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="견적문의 삭제"
        description={`${inquiryNumber} (${inquiry.name}) 문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        destructive
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
