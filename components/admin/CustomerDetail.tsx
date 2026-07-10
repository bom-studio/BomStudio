"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Trash2, Upload } from "lucide-react";
import {
  addCustomerConsultation,
  deleteCustomerAttachment,
  getCustomerAttachmentUrl,
  updateCustomer,
  uploadCustomerAttachment,
} from "@/app/actions/customers";
import { CustomerStatusBadge } from "@/components/admin/CustomerStatusBadge";
import { EstimateStatusBadge } from "@/components/admin/EstimateStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONSULTATION_TYPES } from "@/constants/customer-admin";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import type { CustomerDetailData } from "@/types/admin-customer";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "개요" },
  { id: "projects", label: "프로젝트" },
  { id: "estimates", label: "견적" },
  { id: "contracts", label: "계약" },
  { id: "payments", label: "결제" },
  { id: "consultations", label: "상담" },
  { id: "attachments", label: "첨부파일" },
  { id: "timeline", label: "타임라인" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

interface CustomerDetailProps {
  data: CustomerDetailData;
}

export function CustomerDetail({ data }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [message, setMessage] = useState<string | null>(null);
  const { customer, summary } = data;

  const [saveState, saveAction, savePending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const result = await updateCustomer({
        id: customer.id,
        company: String(formData.get("company") ?? ""),
        contact_name: String(formData.get("contact_name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        website: String(formData.get("website") ?? ""),
        business_number: String(formData.get("business_number") ?? ""),
        memo: String(formData.get("memo") ?? ""),
      });
      if (!result.success) return { error: result.error ?? "저장 실패" };
      return { error: null };
    },
    { error: null }
  );

  const [uploadState, uploadAction, uploadPending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const result = await uploadCustomerAttachment(customer.id, formData);
      if (!result.success) return { error: result.error ?? "업로드 실패" };
      return { error: null };
    },
    { error: null }
  );

  const [consultState, consultAction, consultPending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const result = await addCustomerConsultation({
        customer_id: customer.id,
        consulted_at: String(formData.get("consulted_at") ?? new Date().toISOString()),
        type: String(formData.get("type") ?? "전화") as CustomerDetailData["consultations"][number]["type"],
        content: String(formData.get("content") ?? ""),
      });
      if (!result.success) return { error: result.error ?? "저장 실패" };
      return { error: null };
    },
    { error: null }
  );

  const handleDownload = async (filePath: string) => {
    const result = await getCustomerAttachmentUrl(filePath);
    if (result.url) window.open(result.url, "_blank");
    else setMessage(result.error ?? "다운로드 실패");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/customers">
              <ArrowLeft className="mr-1 h-4 w-4" />
              목록
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {customer.company || customer.contact_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{customer.customer_number}</p>
          </div>
        </div>
        <CustomerStatusBadge status={customer.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "총 프로젝트", value: `${summary.project_count}건` },
          { label: "누적 매출", value: formatEstimateMoney(summary.total_revenue) },
          { label: "미수금", value: formatEstimateMoney(summary.unpaid_amount) },
          { label: "최근 연락일", value: formatDate(summary.last_contacted_at) },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-primary">{message}</p> : null}

      {activeTab === "overview" ? (
        <form action={saveAction} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <SectionCard title="고객 정보">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">회사명</Label>
                <Input id="company" name="company" defaultValue={customer.company ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name">담당자</Label>
                <Input id="contact_name" name="contact_name" defaultValue={customer.contact_name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" name="phone" defaultValue={customer.phone} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" type="email" defaultValue={customer.email ?? ""} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" name="address" defaultValue={customer.address ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">홈페이지</Label>
                <Input id="website" name="website" defaultValue={customer.website ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_number">사업자번호</Label>
                <Input id="business_number" name="business_number" defaultValue={customer.business_number ?? ""} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="memo">메모</Label>
                <Textarea id="memo" name="memo" rows={4} defaultValue={customer.memo ?? ""} />
              </div>
            </div>
            {saveState.error ? <p className="mt-2 text-sm text-destructive">{saveState.error}</p> : null}
            <Button type="submit" className="mt-4" disabled={savePending}>
              {savePending ? "저장 중..." : "정보 저장"}
            </Button>
          </SectionCard>
        </form>
      ) : null}

      {activeTab === "projects" ? (
        <SectionCard title="프로젝트 이력">
          {data.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">연결된 프로젝트가 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-center text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">프로젝트명</th>
                    <th className="px-3 py-2">상태</th>
                    <th className="px-3 py-2">계약금</th>
                    <th className="px-3 py-2">잔금</th>
                    <th className="px-3 py-2">시작일</th>
                    <th className="px-3 py-2">완료일</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.map((project) => (
                    <tr key={project.id} className="border-b border-border/50">
                      <td className="px-3 py-3">
                        <Link href={`/admin/projects/${project.id}`} className="font-medium text-primary hover:underline">
                          {project.project_title || project.project_number}
                        </Link>
                      </td>
                      <td className="px-3 py-3">{project.status}</td>
                      <td className="px-3 py-3">{formatEstimateMoney(project.contract_amount)}</td>
                      <td className="px-3 py-3">{formatEstimateMoney(project.balance_amount)}</td>
                      <td className="px-3 py-3">{formatDate(project.start_date)}</td>
                      <td className="px-3 py-3">{formatDate(project.completed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      ) : null}

      {activeTab === "estimates" ? (
        <SectionCard title="견적 이력">
          {data.estimates.length === 0 ? (
            <p className="text-sm text-muted-foreground">연결된 견적서가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {data.estimates.map((estimate) => (
                <Link
                  key={estimate.id}
                  href={`/admin/estimates/${estimate.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3 hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{estimate.estimate_number}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(estimate.created_at)}</p>
                  </div>
                  <p className="font-semibold text-[#0F766E]">{formatEstimateMoney(estimate.total)}</p>
                  <EstimateStatusBadge status={estimate.status} />
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}

      {activeTab === "contracts" ? (
        <SectionCard title="계약 이력">
          {data.contracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">연결된 계약이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-center text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">계약번호</th>
                    <th className="px-3 py-2">계약금</th>
                    <th className="px-3 py-2">잔금</th>
                    <th className="px-3 py-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-border/50">
                      <td className="px-3 py-3">
                        <Link href={`/admin/contracts/${contract.id}`} className="text-primary hover:underline">
                          {contract.contract_number}
                        </Link>
                      </td>
                      <td className="px-3 py-3">{formatEstimateMoney(contract.down_payment_amount)}</td>
                      <td className="px-3 py-3">{formatEstimateMoney(contract.balance_payment_amount)}</td>
                      <td className="px-3 py-3">{contract.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      ) : null}

      {activeTab === "payments" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-sm text-muted-foreground">총 계약금</p>
              <p className="mt-2 text-xl font-bold">{formatEstimateMoney(summary.total_contract_amount)}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-sm text-muted-foreground">총 입금</p>
              <p className="mt-2 text-xl font-bold text-[#0F766E]">{formatEstimateMoney(summary.total_paid_amount)}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-sm text-muted-foreground">미수금</p>
              <p className="mt-2 text-xl font-bold text-rose-600">{formatEstimateMoney(summary.unpaid_amount)}</p>
            </div>
          </div>
          <SectionCard title="결제 내역">
            {data.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">결제 내역이 없습니다.</p>
            ) : (
              <table className="w-full text-center text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">입금일</th>
                    <th className="px-3 py-2">금액</th>
                    <th className="px-3 py-2">유형</th>
                    <th className="px-3 py-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border/50">
                      <td className="px-3 py-3">
                        <Link href={`/admin/payments/${payment.id}`} className="text-primary hover:underline">
                          {formatDate(payment.paid_at)}
                        </Link>
                      </td>
                      <td className="px-3 py-3">{formatEstimateMoney(payment.amount)}</td>
                      <td className="px-3 py-3">{payment.payment_type}</td>
                      <td className="px-3 py-3">{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>
        </div>
      ) : null}

      {activeTab === "consultations" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="상담기록 추가">
            <form action={consultAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consulted_at">날짜</Label>
                <Input
                  id="consulted_at"
                  name="consulted_at"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">유형</Label>
                <select id="type" name="type" className="h-10 w-full rounded-md border border-input px-3 text-sm">
                  {CONSULTATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea id="content" name="content" rows={5} required />
              </div>
              {consultState.error ? <p className="text-sm text-destructive">{consultState.error}</p> : null}
              <Button type="submit" disabled={consultPending}>
                {consultPending ? "저장 중..." : "상담기록 추가"}
              </Button>
            </form>
          </SectionCard>
          <SectionCard title="상담 기록">
            <div className="space-y-3">
              {data.consultations.length === 0 ? (
                <p className="text-sm text-muted-foreground">상담 기록이 없습니다.</p>
              ) : (
                data.consultations.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{item.type}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(item.consulted_at)}</p>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      ) : null}

      {activeTab === "attachments" ? (
        <SectionCard title="첨부파일">
          <form action={uploadAction} className="mb-6 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">PDF, PNG, JPG, DOCX 파일을 업로드하세요.</p>
            <Input type="file" name="file" className="mx-auto mt-4 max-w-sm" accept=".pdf,.png,.jpg,.jpeg,.docx" required />
            {uploadState.error ? <p className="mt-2 text-sm text-destructive">{uploadState.error}</p> : null}
            <Button type="submit" className="mt-4" disabled={uploadPending}>
              업로드
            </Button>
          </form>
          <div className="space-y-2">
            {data.attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground">첨부파일이 없습니다.</p>
            ) : (
              data.attachments.map((file) => (
                <div key={file.id} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(file.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(file.file_path)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const result = await deleteCustomerAttachment(file.id, customer.id);
                        setMessage(result.success ? "삭제되었습니다." : result.error ?? "삭제 실패");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "timeline" ? (
        <SectionCard title="활동 타임라인">
          {data.timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">활동 내역이 없습니다.</p>
          ) : (
            <div className="space-y-0">
              {data.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4 border-b border-border/40 py-4 last:border-0">
                  <div className="w-28 shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(event.occurred_at)}
                  </div>
                  <div className="relative flex-1 pl-4">
                    <span className="absolute top-1.5 left-0 h-2 w-2 rounded-full bg-[#0F766E]" />
                    {index < data.timeline.length - 1 ? (
                      <span className="absolute top-4 left-[3px] h-full w-px bg-border" />
                    ) : null}
                    {event.href ? (
                      <Link href={event.href} className="text-sm font-medium text-primary hover:underline">
                        {event.label}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium">{event.label}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}
    </div>
  );
}
