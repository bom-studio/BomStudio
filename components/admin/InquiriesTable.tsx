"use client";

import Link from "next/link";
import { INQUIRY_STATUSES } from "@/constants/inquiry";
import type { EstimateInquiry } from "@/types/inquiry";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InquiriesTableProps {
  inquiries: EstimateInquiry[];
  currentStatus: string;
  currentQuery: string;
}

function buildInquiriesUrl(status?: string, q?: string) {
  const params = new URLSearchParams();
  if (status && status !== "전체") params.set("status", status);
  if (q?.trim()) params.set("q", q.trim());
  const query = params.toString();
  return `/admin/inquiries${query ? `?${query}` : ""}`;
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

export function InquiriesToolbar({
  currentStatus,
  currentQuery,
}: Pick<InquiriesTableProps, "currentStatus" | "currentQuery">) {
  const activeStatus = currentStatus || "전체";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {["전체", ...INQUIRY_STATUSES].map((status) => (
          <Link
            key={status}
            href={buildInquiriesUrl(status, currentQuery)}
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

      <form action="/admin/inquiries" method="get" className="w-full lg:max-w-xs">
        {currentStatus && currentStatus !== "전체" ? (
          <input type="hidden" name="status" value={currentStatus} />
        ) : null}
        <Input
          name="q"
          defaultValue={currentQuery}
          placeholder="이름, 연락처, 회사명, 업종 검색"
        />
      </form>
    </div>
  );
}

export function InquiriesTable({ inquiries }: Pick<InquiriesTableProps, "inquiries">) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-muted-foreground">
        조회된 견적문의가 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-section/60 text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">접수일</th>
              <th className="px-5 py-3 font-medium">이름</th>
              <th className="px-5 py-3 font-medium">연락처</th>
              <th className="px-5 py-3 font-medium">업종</th>
              <th className="px-5 py-3 font-medium">예산</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-4 text-muted-foreground">{formatDate(inquiry.created_at)}</td>
                <td className="px-5 py-4 font-medium">{inquiry.name}</td>
                <td className="px-5 py-4">{inquiry.phone}</td>
                <td className="px-5 py-4">{inquiry.business_type || inquiry.company || "-"}</td>
                <td className="px-5 py-4">{inquiry.budget || "-"}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={inquiry.status} />
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
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
        {inquiries.map((inquiry) => (
          <Link
            key={inquiry.id}
            href={`/admin/inquiries/${inquiry.id}`}
            className="block rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{inquiry.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{inquiry.phone}</p>
              </div>
              <StatusBadge status={inquiry.status} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatDate(inquiry.created_at)}</span>
              <span>{inquiry.budget || "-"}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
