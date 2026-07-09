"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";
import { deleteContract, updateContractStatus } from "@/app/actions/contracts";
import { ContractPdfDownloadButton } from "@/components/admin/contract/ContractPreview";
import { ContractAmountSummaryBar } from "@/components/admin/contract/ContractAmountSummaryBar";
import { ConfirmDialog } from "@/components/admin/inquiry/ConfirmDialog";
import { ContractStatusBadge } from "@/components/admin/ContractStatusBadge";
import { Button } from "@/components/ui/button";
import { CONTRACT_STATUSES, type ContractStatus } from "@/constants/contract-admin";
import {
  displayContractValue,
  formatContractPeriod,
} from "@/lib/admin/contract-display";
import type { ContractDocumentView } from "@/lib/admin/contract-document";
import { parseContractTerms } from "@/lib/admin/contract-document";
import {
  formatEstimateDateTime,
  formatEstimateMoney,
} from "@/lib/admin/estimate-display";
import type { SavedContract } from "@/types/admin-contract";
import { cn } from "@/lib/utils";

interface ContractDetailProps {
  contract: SavedContract;
  documentView: ContractDocumentView;
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

function PaymentBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
      )}
    >
      {paid ? "입금완료" : "미납"}
    </span>
  );
}

function SignatureBadge({ signed }: { signed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        signed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
      )}
    >
      {signed ? "완료" : "미완료"}
    </span>
  );
}

function PaymentProgressRow({
  label,
  amount,
  paid,
}: {
  label: string;
  amount: number;
  paid: boolean;
}) {
  return (
    <div className="space-y-2 rounded-lg bg-muted/20 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{formatEstimateMoney(amount)}</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn("text-base leading-none", paid ? "text-emerald-600" : "text-amber-500")}
          aria-hidden
        >
          {paid ? "●" : "○"}
        </span>
        <PaymentBadge paid={paid} />
      </div>
    </div>
  );
}

function TermsList({ terms }: { terms: string[] }) {
  if (terms.length === 0) {
    return <p className="text-sm text-gray-400">등록된 계약 조건이 없습니다.</p>;
  }

  return (
    <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-7 text-gray-800">
      {terms.map((term, index) => (
        <li key={index}>{term}</li>
      ))}
    </ol>
  );
}

export function ContractDetail({ contract, documentView }: ContractDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(contract.status || "작성중");
  const [showDelete, setShowDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const editHref = `/admin/contracts/new?contractId=${contract.id}`;
  const previewHref = `/admin/contracts/${contract.id}/preview`;
  const estimateHref = contract.estimate_id
    ? `/admin/estimates/${contract.estimate_id}`
    : undefined;
  const terms = parseContractTerms(contract.contract_terms);

  const handleStatusChange = (nextStatus: ContractStatus) => {
    setStatus(nextStatus);
    setMessage(null);
    startStatusTransition(async () => {
      const result = await updateContractStatus(contract.id, nextStatus);
      if (!result.success) {
        setStatus(contract.status || "작성중");
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteContract(contract.id);
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
            <Link href="/admin/contracts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">계약서 상세</h1>
            <p className="mt-1 text-base font-semibold text-gray-800">{contract.contract_number}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              작성일 {formatEstimateDateTime(contract.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:pt-1">
          <Button asChild variant="outline" size="sm">
            <Link href={previewHref}>
              <Eye className="h-4 w-4" />
              계약서 미리보기
            </Link>
          </Button>
          <select
            id="contract-status"
            value={status}
            disabled={isStatusPending}
            onChange={(e) => handleStatusChange(e.target.value as ContractStatus)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="계약 상태"
          >
            {CONTRACT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ContractStatusBadge status={status} />
        </div>
      </header>

      {message ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {message}
        </p>
      ) : null}

      <DetailCard title="계약 요약">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">고객 정보</p>
            <Field label="고객명" value={displayContractValue(contract.customer_name)} />
            <Field label="회사명" value={displayContractValue(contract.company)} />
            <Field label="연락처" value={displayContractValue(contract.phone)} />
            <Field label="이메일" value={displayContractValue(contract.email)} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">프로젝트 / 계약 정보</p>
            <Field label="프로젝트명" value={displayContractValue(contract.project_title)} />
            <Field label="계약유형" value={displayContractValue(contract.contract_type)} />
            <Field label="청구주기" value={displayContractValue(contract.billing_cycle)} />
            <Field
              label="계약기간"
              value={formatContractPeriod(contract.start_date, contract.end_date)}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <ContractAmountSummaryBar
            amount={contract.contract_amount}
            vatType={documentView.amounts.vatType}
          />
        </div>
      </DetailCard>

      <DetailCard title="계약 내용">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">기본 계약 조건</p>
            <TermsList terms={terms} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">특약사항</p>
            {contract.special_terms?.trim() ? (
              <p className="whitespace-pre-line text-sm leading-7 text-gray-800">
                {contract.special_terms}
              </p>
            ) : (
              <p className="text-sm text-gray-400">등록된 특약사항이 없습니다.</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">관리자 메모</p>
            {contract.memo?.trim() ? (
              <p className="whitespace-pre-line text-sm leading-7 text-gray-800">{contract.memo}</p>
            ) : (
              <p className="text-sm text-gray-400">등록된 관리자 메모가 없습니다.</p>
            )}
          </div>
        </div>
      </DetailCard>

      <DetailCard title="결제 및 서명 상태">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">결제 상태</p>
            <PaymentProgressRow
              label="계약금"
              amount={contract.down_payment_amount}
              paid={contract.down_payment_paid}
            />
            <PaymentProgressRow
              label="잔금"
              amount={contract.balance_payment_amount}
              paid={contract.balance_payment_paid}
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">서명 상태</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/20 px-3 py-3">
                <p className="text-sm text-gray-600">공급자</p>
                <SignatureBadge signed={contract.studio_signed} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/20 px-3 py-3">
                <p className="text-sm text-gray-600">고객</p>
                <SignatureBadge signed={contract.customer_signed} />
              </div>
              <Field
                label="서명일"
                value={
                  contract.signed_at ? formatEstimateDateTime(contract.signed_at) : "-"
                }
              />
            </div>
          </div>
        </div>
      </DetailCard>

      <section className="rounded-xl border border-border bg-white px-5 py-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href={editHref}>
              <Pencil className="h-4 w-4" />
              수정
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={previewHref}>미리보기</Link>
          </Button>
          <ContractPdfDownloadButton data={documentView} variant="secondary" />
          {estimateHref ? (
            <Button asChild variant="secondary">
              <Link href={estimateHref}>연결 견적서</Link>
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              연결 견적서
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link href={`/admin/projects/new?contractId=${contract.id}`}>
              프로젝트 생성
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:bg-destructive/5 hover:text-destructive sm:ml-auto"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={showDelete}
        title="계약서 삭제"
        description="이 계약서를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        isPending={isDeletePending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
