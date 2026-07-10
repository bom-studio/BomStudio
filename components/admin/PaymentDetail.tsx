"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { updatePaymentStatus } from "@/app/actions/payments";
import { PaymentAmountSummaryBar } from "@/components/admin/payment/PaymentAmountSummaryBar";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { PaymentTypeBadge } from "@/components/admin/PaymentTypeBadge";
import { Button } from "@/components/ui/button";
import { PAYMENT_STATUSES, type PaymentStatus } from "@/constants/payment-admin";
import { displayContractValue } from "@/lib/admin/contract-display";
import {
  formatEstimateDate,
  formatEstimateDateTime,
  formatEstimateMoney,
} from "@/lib/admin/estimate-display";
import {
  formatDepositorName,
  formatPaymentMethod,
} from "@/lib/admin/payment-display";
import type { ActivityLog } from "@/types/admin-project";
import type { SavedPayment } from "@/types/admin-payment";
import { cn } from "@/lib/utils";

interface PaymentDetailProps {
  payment: SavedPayment;
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

function ActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-gray-400">등록된 활동 로그가 없습니다.</p>;
  }

  return (
    <div className="space-y-0">
      {logs.map((log, index) => (
        <div key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < logs.length - 1 ? (
            <span
              className="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px bg-border"
              aria-hidden
            />
          ) : null}
          <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0F766E]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500">
              {formatEstimateDate(log.created_at)}
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-800">{log.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RelatedLinkButton({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  if (!href) {
    return (
      <Button variant="outline" size="sm" disabled>
        {label}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function PaymentDetail({ payment, activityLogs }: PaymentDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(payment.status || "입금대기");
  const [toast, setToast] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleStatusChange = (nextStatus: PaymentStatus) => {
    setStatus(nextStatus);
    setMessage(null);

    startTransition(async () => {
      const result = await updatePaymentStatus(payment.id, nextStatus);
      if (!result.success) {
        setStatus(payment.status);
        setToast(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-destructive/30 bg-white px-4 py-3 text-sm text-destructive shadow-lg">
          {toast}
        </div>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <Link href="/admin/payments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">결제 상세</h1>
            <p className="mt-1 text-base font-semibold text-gray-800">{payment.payment_number}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              등록일 {formatEstimateDateTime(payment.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:pt-1">
          <select
            value={status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as PaymentStatus)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="결제 상태"
          >
            {PAYMENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <PaymentStatusBadge status={status} />
        </div>
      </header>

      {message ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {message}
        </p>
      ) : null}

      <DetailCard title="결제 요약">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">고객 정보</p>
            <Field label="고객명" value={displayContractValue(payment.customer_name)} />
            <Field label="회사명" value={displayContractValue(payment.company)} />
            <Field label="연락처" value={displayContractValue(payment.phone)} />
            <Field label="이메일" value={displayContractValue(payment.email)} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">결제 정보</p>
            <Field label="계약번호" value={displayContractValue(payment.contract_number)} />
            <Field label="프로젝트명" value={displayContractValue(payment.project_title)} />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">결제유형</p>
              <PaymentTypeBadge type={payment.payment_type} />
            </div>
            <Field label="결제금액" value={formatEstimateMoney(payment.amount)} />
            <Field
              label="결제예정일"
              value={formatEstimateDate(payment.due_date)}
            />
            <Field label="실제입금일" value={formatEstimateDate(payment.paid_at)} />
            <Field label="결제수단" value={formatPaymentMethod(payment.payment_method)} />
            <Field label="입금자명" value={formatDepositorName(payment.depositor_name)} />
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <PaymentAmountSummaryBar amount={payment.amount} />
        </div>
      </DetailCard>

      <DetailCard title="연결 정보">
        <div className="flex flex-wrap gap-2">
          <RelatedLinkButton
            label="문의"
            href={payment.inquiry_id ? `/admin/inquiries/${payment.inquiry_id}` : undefined}
          />
          <RelatedLinkButton
            label="견적서"
            href={payment.estimate_id ? `/admin/estimates/${payment.estimate_id}` : undefined}
          />
          <RelatedLinkButton
            label="계약서"
            href={payment.contract_id ? `/admin/contracts/${payment.contract_id}` : undefined}
          />
          <RelatedLinkButton
            label="프로젝트"
            href={payment.project_id ? `/admin/projects/${payment.project_id}` : undefined}
          />
        </div>
      </DetailCard>

      <DetailCard title="관리자 메모">
        <p
          className={cn(
            "whitespace-pre-line text-sm leading-6",
            payment.memo?.trim() ? "text-gray-700" : "text-gray-400"
          )}
        >
          {payment.memo?.trim() || "등록된 메모가 없습니다."}
        </p>
      </DetailCard>

      <DetailCard title="Activity Log">
        <ActivityTimeline logs={activityLogs} />
      </DetailCard>
    </div>
  );
}
