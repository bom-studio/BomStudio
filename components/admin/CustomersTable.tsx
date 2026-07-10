"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { updateCustomerStatus } from "@/app/actions/customers";
import { CustomerStatusBadge } from "@/components/admin/CustomerStatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CUSTOMER_SORT_OPTIONS, CUSTOMER_STATUSES } from "@/constants/customer-admin";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { CustomerListItem } from "@/types/admin-customer";
import { cn } from "@/lib/utils";

interface CustomersTableProps {
  customers: CustomerListItem[];
  currentStatus: string;
  currentQuery: string;
  currentSort: string;
}

function buildCustomersUrl(status?: string, q?: string, sort?: string) {
  const params = new URLSearchParams();
  if (status && status !== "전체") params.set("status", status);
  if (q?.trim()) params.set("q", q.trim());
  if (sort && sort !== "created_desc") params.set("sort", sort);
  const query = params.toString();
  return `/admin/customers${query ? `?${query}` : ""}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function CustomersToolbar({
  currentStatus,
  currentQuery,
  currentSort,
}: Pick<CustomersTableProps, "currentStatus" | "currentQuery" | "currentSort">) {
  const activeStatus = currentStatus || "전체";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild>
          <Link href="/admin/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            고객 등록
          </Link>
        </Button>

        <form action="/admin/customers" method="get" className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
          {currentStatus && currentStatus !== "전체" ? (
            <input type="hidden" name="status" value={currentStatus} />
          ) : null}
          <select
            name="sort"
            defaultValue={currentSort || "created_desc"}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="정렬"
          >
            {CUSTOMER_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Input
            name="q"
            defaultValue={currentQuery}
            placeholder="회사명, 담당자, 전화번호, 이메일 검색"
          />
          <Button type="submit" variant="outline">
            검색
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {["전체", ...CUSTOMER_STATUSES].map((status) => (
          <Link
            key={status}
            href={buildCustomersUrl(status, currentQuery, currentSort)}
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
    </div>
  );
}

export function CustomersTable({ customers }: Pick<CustomersTableProps, "customers">) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-muted-foreground">
        조회된 고객이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:block">
        <table className="w-full text-center text-sm">
          <thead className="border-b border-border bg-muted/30 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">회사명</th>
              <th className="px-4 py-3 font-medium">담당자</th>
              <th className="px-4 py-3 font-medium">연락처</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">현재 상태</th>
              <th className="px-4 py-3 font-medium">최근 프로젝트</th>
              <th className="px-4 py-3 font-medium">프로젝트 수</th>
              <th className="px-4 py-3 font-medium">누적 매출</th>
              <th className="px-4 py-3 font-medium">최근 연락일</th>
              <th className="px-4 py-3 font-medium">등록일</th>
              <th className="px-4 py-3 font-medium">상세</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">{customer.company || "-"}</td>
                <td className="px-4 py-3 font-medium">{customer.contact_name}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{customer.email || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <StatusSelect
                      value={customer.status}
                      options={CUSTOMER_STATUSES}
                      onChange={(status) => updateCustomerStatus(customer.id, status)}
                      size="sm"
                    />
                  </div>
                </td>
                <td className="max-w-[160px] truncate px-4 py-3">
                  {customer.latest_project_title || "-"}
                </td>
                <td className="px-4 py-3">{customer.project_count}건</td>
                <td className="px-4 py-3 font-medium text-[#0F766E]">
                  {formatEstimateMoney(customer.total_revenue)}
                </td>
                <td className="px-4 py-3">{formatDate(customer.last_contacted_at)}</td>
                <td className="px-4 py-3">{formatDate(customer.created_at)}</td>
                <td className="px-4 py-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/customers/${customer.id}`}>보기</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {customers.map((customer) => (
          <Link
            key={customer.id}
            href={`/admin/customers/${customer.id}`}
            className="block rounded-2xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{customer.company || customer.contact_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{customer.contact_name}</p>
              </div>
              <CustomerStatusBadge status={customer.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p>{customer.phone}</p>
              <p className="text-right font-medium text-[#0F766E]">
                {formatEstimateMoney(customer.total_revenue)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
