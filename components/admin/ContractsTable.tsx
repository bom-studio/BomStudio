"use client";

import Link from "next/link";
import { updateContractStatus } from "@/app/actions/contracts";
import { CONTRACT_STATUSES, CONTRACT_STATUS_OPTIONS } from "@/constants/contract-admin";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { SavedContract } from "@/types/admin-contract";
import { cn } from "@/lib/utils";

interface ContractsTableProps {
  contracts: SavedContract[];
  currentStatus: string;
  currentQuery: string;
}

function buildContractsUrl(status?: string, q?: string) {
  const params = new URLSearchParams();
  if (status && status !== "전체") params.set("status", status);
  if (q?.trim()) params.set("q", q.trim());
  const query = params.toString();
  return `/admin/contracts${query ? `?${query}` : ""}`;
}

export function ContractsToolbar({
  currentStatus,
  currentQuery,
}: Pick<ContractsTableProps, "currentStatus" | "currentQuery">) {
  const activeStatus = currentStatus || "전체";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {["전체", ...CONTRACT_STATUSES].map((status) => (
          <Link
            key={status}
            href={buildContractsUrl(status, currentQuery)}
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

      <form action="/admin/contracts" method="get" className="w-full lg:max-w-xs">
        {currentStatus && currentStatus !== "전체" ? (
          <input type="hidden" name="status" value={currentStatus} />
        ) : null}
        <Input
          name="q"
          defaultValue={currentQuery}
          placeholder="계약번호, 고객명, 연락처, 회사명, 프로젝트명 검색"
        />
      </form>
    </div>
  );
}

export function ContractsTable({ contracts }: Pick<ContractsTableProps, "contracts">) {
  if (contracts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-muted-foreground">작성된 계약서가 없습니다.</p>
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
              <th className="px-5 py-3 font-medium">계약금액</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-3 font-medium">{contract.contract_number}</td>
                <td className="px-5 py-3">{contract.project_title || "-"}</td>
                <td className="px-5 py-3 font-semibold">
                  {formatEstimateMoney(contract.contract_amount)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <StatusSelect
                      value={contract.status}
                      options={CONTRACT_STATUS_OPTIONS}
                      onChange={(status) => updateContractStatus(contract.id, status)}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/contracts/${contract.id}`}>상세보기</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="block rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{contract.contract_number}</p>
                <p className="mt-1 text-sm text-muted-foreground">{contract.project_title || "-"}</p>
              </div>
              <StatusSelect
                value={contract.status}
                options={CONTRACT_STATUS_OPTIONS}
                onChange={(status) => updateContractStatus(contract.id, status)}
              />
            </div>
            <p className="mt-3 text-sm font-semibold">
              {formatEstimateMoney(contract.contract_amount)}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href={`/admin/contracts/${contract.id}`}>상세보기</Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
