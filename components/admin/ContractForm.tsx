"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { createContract, updateContract } from "@/app/actions/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BILLING_CYCLES,
  CONTRACT_TYPES,
  type BillingCycle,
  type ContractType,
} from "@/constants/contract-admin";
import { splitPayment } from "@/lib/admin/contract-form";
import { buildProjectTitle } from "@/lib/admin/project-title";
import type { ContractFormState } from "@/types/admin-contract";
import { cn } from "@/lib/utils";

interface ContractFormProps {
  initialForm: ContractFormState;
  isEditMode?: boolean;
  contractId?: string;
}

function FormCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6",
        className
      )}
    >
      <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function parseAmount(value: string) {
  const num = Number(value.replace(/[^\d]/g, "") || 0);
  return Number.isFinite(num) ? num : 0;
}

export function ContractForm({ initialForm, isEditMode = false, contractId }: ContractFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ContractFormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateField = <K extends keyof ContractFormState>(key: K, value: ContractFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "company" || key === "contractType") {
        next.projectTitle = buildProjectTitle(
          key === "company" ? (value as string) : prev.company,
          key === "contractType" ? (value as ContractType) : prev.contractType
        );
      }

      return next;
    });
  };

  const handleContractAmountChange = (value: string) => {
    const amount = parseAmount(value);
    const { down, balance } = splitPayment(amount);
    setForm((prev) => ({
      ...prev,
      contractAmount: String(amount),
      downPaymentAmount: String(down),
      balancePaymentAmount: String(balance),
    }));
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const input = {
        inquiryId: form.inquiryId || undefined,
        estimateId: form.estimateId || undefined,
        contractNumber: form.contractNumber,
        customerName: form.customerName,
        company: form.company,
        phone: form.phone,
        email: form.email,
        projectTitle: buildProjectTitle(form.company, form.contractType),
        contractAmount: parseAmount(form.contractAmount),
        downPaymentAmount: parseAmount(form.downPaymentAmount),
        balancePaymentAmount: parseAmount(form.balancePaymentAmount),
        contractType: form.contractType,
        billingCycle: form.billingCycle,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        contractTerms: form.contractTerms,
        specialTerms: form.specialTerms,
        memo: form.memo,
      };

      if (isEditMode && contractId) {
        const result = await updateContract(contractId, input);
        if (!result.success) {
          setError(result.error);
          return;
        }
        router.push(`/admin/contracts/${contractId}`);
        router.refresh();
        return;
      }

      const result = await createContract(input);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  const backHref = isEditMode && contractId
    ? `/admin/contracts/${contractId}`
    : form.estimateId
      ? `/admin/estimates/${form.estimateId}`
      : "/admin/contracts";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-start gap-3">
        <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isEditMode ? "계약서 수정" : "계약서 작성"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "계약서 내용을 수정합니다."
              : "견적서를 기반으로 계약서를 작성합니다."}
          </p>
        </div>
      </div>

      <FormCard title="고객 정보">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="고객명">
            <Input
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              placeholder="고객명"
            />
          </Field>
          <Field label="회사명">
            <Input
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
              placeholder="회사명"
            />
          </Field>
          <Field label="연락처">
            <Input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="연락처"
            />
          </Field>
          <Field label="이메일">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="이메일"
            />
          </Field>
        </div>
      </FormCard>

      <FormCard title="계약 정보">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="계약번호">
            <Input value={form.contractNumber} readOnly className="bg-muted/30" />
          </Field>
          <Field label="프로젝트명">
            <Input
              value={form.projectTitle}
              readOnly
              className="bg-muted/30"
              placeholder="회사명+계약유형으로 자동 생성"
            />
          </Field>
          <Field label="계약금액">
            <Input
              type="number"
              min={0}
              value={form.contractAmount}
              onChange={(e) => handleContractAmountChange(e.target.value)}
            />
          </Field>
          <Field label="계약금">
            <Input
              type="number"
              min={0}
              value={form.downPaymentAmount}
              onChange={(e) => updateField("downPaymentAmount", e.target.value)}
            />
          </Field>
          <Field label="잔금">
            <Input
              type="number"
              min={0}
              value={form.balancePaymentAmount}
              onChange={(e) => updateField("balancePaymentAmount", e.target.value)}
            />
          </Field>
          <Field label="계약유형">
            <select
              value={form.contractType}
              onChange={(e) => updateField("contractType", e.target.value as ContractType)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {CONTRACT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="청구주기">
            <select
              value={form.billingCycle}
              onChange={(e) => updateField("billingCycle", e.target.value as BillingCycle)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {BILLING_CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
          </Field>
          <Field label="시작일">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </Field>
          <Field label="종료일">
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
            />
          </Field>
        </div>
      </FormCard>

      <FormCard title="계약 조건">
        <div className="space-y-4">
          <Field label="기본 계약 조건">
            <Textarea
              value={form.contractTerms}
              onChange={(e) => updateField("contractTerms", e.target.value)}
              rows={8}
              className="min-h-[180px]"
            />
          </Field>
          <Field label="특약사항">
            <Textarea
              value={form.specialTerms}
              onChange={(e) => updateField("specialTerms", e.target.value)}
              rows={4}
              placeholder="특약사항이 있으면 입력해 주세요."
            />
          </Field>
          <Field label="관리자 메모">
            <Textarea
              value={form.memo}
              onChange={(e) => updateField("memo", e.target.value)}
              rows={3}
              placeholder="내부 관리용 메모"
            />
          </Field>
        </div>
      </FormCard>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5">
        <Button type="button" variant="outline" asChild disabled={isPending}>
          <Link href={backHref}>취소</Link>
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "저장 중..." : isEditMode ? "계약서 수정" : "계약서 저장"}
        </Button>
      </div>
    </div>
  );
}
