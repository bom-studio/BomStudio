"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  FileText,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";
import { deleteEstimate, updateEstimateStatus } from "@/app/actions/estimates";
import { ConfirmDialog } from "@/components/admin/inquiry/ConfirmDialog";
import { EstimateStatusBadge } from "@/components/admin/EstimateStatusBadge";
import { Button } from "@/components/ui/button";
import { ESTIMATE_STATUSES, type EstimateStatus } from "@/constants/estimate-admin";
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
}

function DetailCard({
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
        "h-fit rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6",
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground break-words">{value}</p>
    </div>
  );
}

export function EstimateDetail({ estimate, inquiry }: EstimateDetailProps) {
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

  const handleStatusChange = (nextStatus: string) => {
    setStatus(nextStatus);
    setMessage(null);
    startStatusTransition(async () => {
      const result = await updateEstimateStatus(estimate.id, nextStatus as EstimateStatus);
      if (!result.success) {
        setMessage(result.error);
        setStatus(estimate.status || "작성중");
        return;
      }
      setMessage("상태가 변경되었습니다.");
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

  const editHref = `/admin/estimates/new?estimateId=${estimate.id}`;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <header className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 h-9 px-2 text-muted-foreground">
          <Link href="/admin/estimates">
            <ArrowLeft className="h-4 w-4" />
            견적서 목록
          </Link>
        </Button>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">견적서 상세</h1>
            <EstimateStatusBadge status={status} />
          </div>
          <p className="font-mono text-sm text-muted-foreground">{estimate.estimate_number}</p>
        </div>
      </header>

      {message ? (
        <p className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <DetailCard title="고객 정보" icon={<Building2 className="h-4 w-4" />}>
          <div className="space-y-3">
            <InfoRow label="고객명" value={estimate.customer_name} />
            <InfoRow label="회사명" value={estimate.company || "-"} />
            <InfoRow label="연락처" value={estimate.phone || "-"} />
            <InfoRow label="이메일" value={estimate.email || "-"} />
            <InfoRow label="업종" value={businessType} />
          </div>
        </DetailCard>

        <DetailCard title="견적 정보" icon={<Wallet className="h-4 w-4" />}>
          <div className="space-y-3">
            <InfoRow label="공급가" value={formatEstimateMoney(estimate.subtotal)} />
            <InfoRow label="부가세" value={formatEstimateMoney(estimate.vat)} />
            <InfoRow label="총액" value={formatEstimateMoney(estimate.total)} />
            <InfoRow label="부가세 타입" value={estimate.vat_type || "-"} />
            <InfoRow label="결제조건" value={estimate.payment_terms || "-"} />
            <InfoRow label="납기" value={estimate.delivery_period || "-"} />
            <InfoRow label="유효기간" value={formatEstimateDate(estimate.valid_until)} />
            <InfoRow label="작성일" value={formatEstimateDateTime(estimate.created_at)} />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <label htmlFor="estimate-status" className="mb-2 block text-xs font-medium text-muted-foreground">
              견적서 상태
            </label>
            <select
              id="estimate-status"
              value={status}
              disabled={isStatusPending}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
            >
              {ESTIMATE_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </DetailCard>
      </div>

      <DetailCard title="요청 요약" icon={<ClipboardList className="h-4 w-4" />}>
        <div className="space-y-5">
          {estimate.request_summary ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">요청 내용</p>
              <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                {estimate.request_summary}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-gray-700">등록된 요청 내용이 없습니다.</p>
          )}

          {estimate.reference_urls ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">참고 URL</p>
              <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                {estimate.reference_urls}
              </p>
            </div>
          ) : null}

          {estimate.memo ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">관리자 메모</p>
              <p className="whitespace-pre-line text-sm leading-6 text-gray-700">{estimate.memo}</p>
            </div>
          ) : null}
        </div>
      </DetailCard>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">견적 품목</h2>
        </div>

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

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5 sm:gap-3">
          <Button asChild>
            <Link href={editHref}>
              <Pencil className="h-4 w-4" />
              수정하기
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
            삭제하기
          </Button>
          <Button asChild variant="outline">
            <Link href={`/admin/contracts/new?estimateId=${estimate.id}`}>계약서 작성하기</Link>
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
