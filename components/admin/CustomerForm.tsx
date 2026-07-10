"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createCustomer } from "@/app/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CUSTOMER_STATUSES } from "@/constants/customer-admin";

export function CustomerForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const result = await createCustomer({
        company: String(formData.get("company") ?? ""),
        contact_name: String(formData.get("contact_name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        website: String(formData.get("website") ?? ""),
        business_number: String(formData.get("business_number") ?? ""),
        memo: String(formData.get("memo") ?? ""),
        status: String(formData.get("status") ?? "신규") as (typeof CUSTOMER_STATUSES)[number],
      });
      if (!result.success) return { error: result.error ?? "등록 실패" };
      return { error: null };
    },
    { error: null }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/customers">
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">고객 등록</h1>
      </div>

      <form action={formAction} className="max-w-2xl space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">회사명</Label>
            <Input id="company" name="company" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_name">담당자 *</Label>
            <Input id="contact_name" name="contact_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">연락처 *</Label>
            <Input id="phone" name="phone" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">주소</Label>
            <Input id="address" name="address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">홈페이지</Label>
            <Input id="website" name="website" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_number">사업자번호</Label>
            <Input id="business_number" name="business_number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <select id="status" name="status" className="h-10 w-full rounded-md border border-input px-3 text-sm">
              {CUSTOMER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea id="memo" name="memo" rows={4} />
          </div>
        </div>
        {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "등록 중..." : "고객 등록"}
        </Button>
      </form>
    </div>
  );
}
