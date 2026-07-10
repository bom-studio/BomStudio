"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";
import { deleteEstimate, updateEstimateStatus } from "@/app/actions/estimates";
import { ContractAmountSummaryBar } from "@/components/admin/contract/ContractAmountSummaryBar";
import { EstimatePdfDownloadButton } from "@/components/admin/estimate/EstimatePreview";
import { ConfirmDialog } from "@/components/admin/inquiry/ConfirmDialog";
import { EstimateStatusBadge } from "@/components/admin/EstimateStatusBadge";
import { Button } from "@/components/ui/button";
import { ESTIMATE_STATUSES, type EstimateStatus } from "@/constants/estimate-admin";
import { displayContractValue } from "@/lib/admin/contract-display";
import type { EstimateDocumentView } from "@/lib/admin/estimate-document";
import {
  formatEstimateDate,
  formatEstimateDateTime,
  formatEstimateMoney,
  parseEstimateItems,
  resolveBusinessType,
} from "@/lib/admin/estimate-display";
import type { SavedEstimate } from "@/types/admin-estimate";
import type { EstimateInquiry } from "@/types/inquiry";
import { cn } from "@/lib/utils";

interface EstimateDetailProps {
  estimate: SavedEstimate;
  inquiry?: Pick<EstimateInquiry, "business_type"> | null;
  documentView: EstimateDocumentView;
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

function ContentSection({
  title,
  content,
  emptyText,
}: {
  title: string;
  content: string | null | undefined;
  emptyText: string;
}) {
  const hasContent = Boolean(content?.trim());

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p
        className={cn(
          "whitespace-pre-line text-sm leading-6",
          hasContent ? "text-gray-700" : "text-gray-400"
        )}
      >
        {hasContent ? content : emptyText}
      </p>
    </div>
  );
}

export function EstimateDetail({ estimate, inquiry, documentView }: EstimateDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(estimate.status || "작성중");
  const [showDelete, setShowDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const businessType = useMemo(
    () => resolveBusinessType(estimate, inquiry),
    [estimate, inquiry]
  );

  const parsedItems = useMemo(
    () => parseEstimateItems(estimate.items, estimate.delivery_period),
    [estimate.items, estimate.delivery_period]
  );

  const estimateTitle = useMemo(() => {
    const summary = estimate.request_summary?.trim();
    if (summary) {
      const firstLine = summary.split("\n")[0]?.trim();
      if (firstLine) return firstLine;
    }
    return "홈페이지 제작 견적";
  }, [estimate.request_summary]);

  const editHref = `/admin/estimates/new?estimateId=${estimate.id}`;
  const previewHref = `/admin/estimates/${estimate.id}/preview`;

  const handleStatusChange = (nextStatus: EstimateStatus) => {
    setStatus(nextStatus);
    setMessage(null);
    startStatusTransition(async () => {
      const result = await updateEstimateStatus(estimate.id, nextStatus);
      if (!result.success) {
        setMessage(result.error);
        setStatus(estimate.status || "작성중");
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteEstimate(estimate.id);
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
            <Link href="/admin/estimates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">견적서 상세</h1>
            <p className="mt-1 text-base font-semibold text-gray-800">{estimate.estimate_number}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              작성일 {formatEstimateDateTime(estimate.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:pt-1">
          <Button asChild variant="outline" size="sm">
            <Link href={previewHref}>
              <Eye className="h-4 w-4" />
              견적서 미리보기
            </Link>
          </Button>
          <select
            id="estimate-status"
            value={status}
            disabled={isStatusPending}
            onChange={(e) => handleStatusChange(e.target.value as EstimateStatus)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="견적서 상태"
          >
            {ESTIMATE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <EstimateStatusBadge status={status} />
        </div>
      </header>

      {message ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {message}
        </p>
      ) : null}

      <DetailCard title="견적 요약">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">고객 정보</p>
            <Field label="고객명" value={displayContractValue(estimate.customer_name)} />
            <Field label="회사명" value={displayContractValue(estimate.company)} />
            <Field label="연락처" value={displayContractValue(estimate.phone)} />
            <Field label="이메일" value={displayContractValue(estimate.email)} />
            <Field label="업종" value={displayContractValue(businessType)} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">견적 정보</p>
            <Field label="견적명" value={estimateTitle} />
            <Field
              label="부가세 타입"
              value={displayContractValue(estimate.vat_type)}
            />
            <Field
              label="결제조건"
              value={displayContractValue(estimate.payment_terms)}
            />
            <Field label="납기" value={displayContractValue(estimate.delivery_period)} />
            <Field
              label="유효기간"
              value={formatEstimateDate(estimate.valid_until)}
            />
            <Field
              label="작성일"
              value={formatEstimateDateTime(estimate.created_at)}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <ContractAmountSummaryBar
            amount={estimate.total}
            vatType={estimate.vat_type}
          />
        </div>
      </DetailCard>

      <DetailCard title="견적 품목">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-section/60 text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">항목명</th>
                <th className="px-3 py-2.5 text-left font-medium">설명</th>
                <th className="px-3 py-2.5 text-left font-medium">기간</th>
                <th className="px-3 py-2.5 text-right font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              {parsedItems.length > 0 ? (
                parsedItems.map((item, index) => (
                  <tr key={index} className="border-b border-border/70 last:border-0">
                    <td className="px-3 py-3 font-medium">{item.name}</td>
                    <td className="px-3 py-3 text-gray-600">{item.description}</td>
                    <td className="px-3 py-3 text-gray-700">{item.period}</td>
                    <td className="px-3 py-3 text-right font-semibold text-foreground">
                      {formatEstimateMoney(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-sm text-muted-foreground">
                    등록된 견적 품목이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-x-6 gap-y-1 border-t border-border/60 pt-3 text-sm text-muted-foreground">
          <span>공급가 {formatEstimateMoney(estimate.subtotal)}</span>
          <span>부가세 {formatEstimateMoney(estimate.vat)}</span>
          <span className="font-semibold text-foreground">
            총액 {formatEstimateMoney(estimate.total)}
          </span>
        </div>
      </DetailCard>

      <DetailCard title="요청 요약">
        <div className="space-y-6">
          <ContentSection
            title="요청 내용"
            content={estimate.request_summary}
            emptyText="등록된 요청 요약이 없습니다."
          />
          <ContentSection
            title="참고 URL"
            content={estimate.reference_urls}
            emptyText="등록된 참고 URL이 없습니다."
          />
          <ContentSection
            title="관리자 메모"
            content={estimate.memo}
            emptyText="등록된 관리자 메모가 없습니다."
          />
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
          <Button asChild variant="secondary">
            <Link href={previewHref}>견적서 미리보기</Link>
          </Button>
          <EstimatePdfDownloadButton data={documentView} variant="secondary" />
          <Button asChild variant="secondary">
            <Link href={`/admin/contracts/new?estimateId=${estimate.id}`}>
              계약서 작성하기
            </Link>
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
        open={showDelete}
        title="견적서 삭제"
        description="이 견적서를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        isPending={isDeletePending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
