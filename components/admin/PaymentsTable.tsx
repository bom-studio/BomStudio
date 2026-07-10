"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Download } from "lucide-react";
import { getPaymentsCsv, updatePaymentStatus } from "@/app/actions/payments";
import {
  PAYMENT_PERIOD_FILTERS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_OPTIONS,
} from "@/constants/payment-admin";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEstimateDate, formatEstimateMoney } from "@/lib/admin/estimate-display";
import { resolvePaymentDisplayDate } from "@/lib/admin/payment-display";
import type { SavedPayment } from "@/types/admin-payment";
import { cn } from "@/lib/utils";

interface PaymentsTableProps {
  payments: SavedPayment[];
  currentStatus: string;
  currentPeriod: string;
  currentQuery: string;
}

function buildPaymentsUrl(status?: string, period?: string, q?: string) {
  const params = new URLSearchParams();
  if (status && status !== "전체") params.set("status", status);
  if (period && period !== "이번달") params.set("period", period);
  if (q?.trim()) params.set("q", q.trim());
  const query = params.toString();
  return `/admin/payments${query ? `?${query}` : ""}`;
}

export function PaymentsToolbar({
  currentStatus,
  currentPeriod,
  currentQuery,
}: Pick<PaymentsTableProps, "currentStatus" | "currentPeriod" | "currentQuery">) {
  const [isPending, startTransition] = useTransition();
  const activeStatus = currentStatus || "전체";
  const activePeriod = currentPeriod || "이번달";

  const handleCsvDownload = () => {
    startTransition(async () => {
      const csv = await getPaymentsCsv({
        status: activeStatus,
        period: activePeriod,
        q: currentQuery,
      });
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["전체", ...PAYMENT_STATUSES].map((status) => (
            <Link
              key={status}
              href={buildPaymentsUrl(status, activePeriod, currentQuery)}
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

        <div className="flex flex-wrap items-center gap-2">
          <form action="/admin/payments" method="get" className="w-full sm:w-auto sm:min-w-[240px]">
            {activeStatus !== "전체" ? <input type="hidden" name="status" value={activeStatus} /> : null}
            {activePeriod !== "이번달" ? (
              <input type="hidden" name="period" value={activePeriod} />
            ) : null}
            <Input
              name="q"
              defaultValue={currentQuery}
              placeholder="고객명, 회사명, 계약번호 검색"
            />
          </form>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCsvDownload}
            disabled={isPending}
          >
            <Download className="h-4 w-4" />
            CSV 다운로드
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PAYMENT_PERIOD_FILTERS.map((period) => (
          <Link
            key={period}
            href={buildPaymentsUrl(activeStatus, period, currentQuery)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              activePeriod === period
                ? "border-[#0F766E] bg-[#F0FDFA] text-[#0F766E]"
                : "border-border bg-white text-muted-foreground hover:border-primary/30"
            )}
          >
            {period}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PaymentsTable({ payments }: Pick<PaymentsTableProps, "payments">) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-muted-foreground">결제 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-white md:block">
        <table className="w-full text-center text-sm">
          <thead className="border-b border-border bg-section/60 text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">계약번호</th>
              <th className="px-5 py-3 font-medium">프로젝트명</th>
              <th className="px-5 py-3 font-medium">금액</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium">결제일</th>
              <th className="px-5 py-3 font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-3 font-medium">{payment.contract_number || "-"}</td>
                <td className="px-5 py-3">{payment.project_title || "-"}</td>
                <td className="px-5 py-3 font-semibold">
                  {formatEstimateMoney(payment.amount)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <StatusSelect
                      value={payment.status}
                      options={PAYMENT_STATUS_OPTIONS}
                      onChange={(status) => updatePaymentStatus(payment.id, status)}
                    />
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatEstimateDate(resolvePaymentDisplayDate(payment))}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/payments/${payment.id}`}>상세보기</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="block rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{payment.contract_number || payment.payment_number}</p>
                <p className="mt-1 text-sm text-muted-foreground">{payment.project_title || "-"}</p>
              </div>
              <StatusSelect
                value={payment.status}
                options={PAYMENT_STATUS_OPTIONS}
                onChange={(status) => updatePaymentStatus(payment.id, status)}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {formatEstimateDate(resolvePaymentDisplayDate(payment))}
              </span>
              <p className="font-semibold">{formatEstimateMoney(payment.amount)}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href={`/admin/payments/${payment.id}`}>상세보기</Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
