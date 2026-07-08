"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { updateInquiryStatus } from "@/app/actions/inquiries";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/constants/inquiry";
import type { EstimateInquiry } from "@/types/inquiry";

interface InquiryDetailProps {
  inquiry: EstimateInquiry;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border/70 py-4 sm:grid-cols-[140px_1fr]">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "-"}</dd>
    </div>
  );
}

export function InquiryDetail({ inquiry }: InquiryDetailProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: InquiryStatus) => {
    startTransition(async () => {
      await updateInquiryStatus(inquiry.id, status);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/inquiries">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </Button>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">견적문의 상세</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          접수일 {formatDate(inquiry.created_at)}
        </p>

        <dl className="mt-6">
          <DetailRow label="이름" value={inquiry.name} />
          <DetailRow label="연락처" value={inquiry.phone} />
          <DetailRow label="이메일" value={inquiry.email} />
          <DetailRow label="회사명" value={inquiry.company} />
          <DetailRow label="업종" value={inquiry.business_type} />
          <DetailRow label="예상 예산" value={inquiry.budget} />
          <DetailRow label="희망 일정" value={inquiry.schedule} />
          <DetailRow
            label="필요한 페이지"
            value={inquiry.pages.length ? inquiry.pages.join(", ") : "-"}
          />
          <DetailRow
            label="필요한 기능"
            value={inquiry.features.length ? inquiry.features.join(", ") : "-"}
          />
          <DetailRow label="참고 사이트" value={inquiry.reference} />
          <DetailRow label="문의 내용" value={inquiry.message} />
        </dl>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm font-medium text-muted-foreground">상태 변경</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {INQUIRY_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isPending}
                onClick={() => handleStatusChange(status)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  inquiry.status === status
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white hover:border-primary/30"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild size="lg">
          <Link href={`/admin/estimates/new?inquiryId=${inquiry.id}`}>
            <FileText className="h-4 w-4" />
            견적서 작성
          </Link>
        </Button>
      </div>
    </div>
  );
}
