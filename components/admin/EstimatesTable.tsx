"use client";

import Link from "next/link";
import { updateEstimateStatus } from "@/app/actions/estimates";
import { ESTIMATE_STATUSES, ESTIMATE_STATUS_OPTIONS } from "@/constants/estimate-admin";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SavedEstimate } from "@/types/admin-estimate";
import { cn } from "@/lib/utils";

interface EstimatesTableProps {
  estimates: SavedEstimate[];
  currentStatus: string;
  currentQuery: string;
}

function buildEstimatesUrl(status?: string, q?: string) {
  const params = new URLSearchParams();
  if (status && status !== "전체") params.set("status", status);
  if (q?.trim()) params.set("q", q.trim());
  const query = params.toString();
  return `/admin/estimates${query ? `?${query}` : ""}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function EstimatesToolbar({
  currentStatus,
  currentQuery,
}: Pick<EstimatesTableProps, "currentStatus" | "currentQuery">) {
  const activeStatus = currentStatus || "전체";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {["전체", ...ESTIMATE_STATUSES].map((status) => (
          <Link
            key={status}
            href={buildEstimatesUrl(status, currentQuery)}
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

      <form action="/admin/estimates" method="get" className="w-full lg:max-w-xs">
        {currentStatus && currentStatus !== "전체" ? (
          <input type="hidden" name="status" value={currentStatus} />
        ) : null}
        <Input
          name="q"
          defaultValue={currentQuery}
          placeholder="견적번호, 이름, 연락처, 회사명, 업종 검색"
        />
      </form>
    </div>
  );
}

export function EstimatesTable({ estimates }: Pick<EstimatesTableProps, "estimates">) {
  if (estimates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-muted-foreground">작성된 견적서가 없습니다.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/estimates/new">견적서 작성하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-white md:block">
        <table className="w-full text-center text-sm">
          <thead className="border-b border-border bg-section/60 text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">견적번호</th>
              <th className="px-5 py-3 font-medium">회사명</th>
              <th className="px-5 py-3 font-medium">고객명</th>
              <th className="px-5 py-3 font-medium">작성일</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => (
              <tr key={estimate.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                  {estimate.estimate_number}
                </td>
                <td className="px-5 py-4">{estimate.company || "-"}</td>
                <td className="px-5 py-4 font-medium">{estimate.customer_name}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(estimate.created_at)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <StatusSelect
                      value={estimate.status}
                      options={ESTIMATE_STATUS_OPTIONS}
                      onChange={(status) => updateEstimateStatus(estimate.id, status)}
                    />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/estimates/${estimate.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    상세보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {estimates.map((estimate) => (
          <div
            key={estimate.id}
            className="block rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{estimate.company || estimate.customer_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{estimate.estimate_number}</p>
              </div>
              <StatusSelect
                value={estimate.status}
                options={ESTIMATE_STATUS_OPTIONS}
                onChange={(status) => updateEstimateStatus(estimate.id, status)}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{estimate.customer_name}</span>
              <span>{formatDate(estimate.created_at)}</span>
            </div>
            <Link
              href={`/admin/estimates/${estimate.id}`}
              className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
            >
              상세보기
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
