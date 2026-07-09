"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_ADDON_OPTIONS,
  calculateEstimate,
  FEATURE_ADDON_OPTIONS,
  INCLUDED_FEATURE_LABELS,
  INCLUDED_INTEGRATION_LABELS,
  INTEGRATION_ADDON_OPTIONS,
  MEMBER_ADDON_OPTIONS,
  PACKAGE_OPTIONS,
  PAGE_ADDON_OPTIONS,
  paymentTermsByDepositRatio,
  type EstimateDraftData,
  type PackageType,
  type PriceOption,
} from "@/lib/admin/estimate-draft";
import { parseReferenceUrls } from "@/lib/admin/inquiry-utils";
import type { EstimateInquiry } from "@/types/inquiry";

type AddonSelectionKey =
  | "pageAddons"
  | "featureAddons"
  | "memberAddons"
  | "adminAddons"
  | "integrationAddons";

interface EstimateFormProps {
  inquiry: EstimateInquiry;
  draft: EstimateDraftData;
  setDraft: React.Dispatch<React.SetStateAction<EstimateDraftData>>;
  onNext: () => void;
}

function formatWon(value: number | null) {
  if (value === null) return "별도 견적";
  return `${value.toLocaleString("ko-KR")}원`;
}

function OptionChecks({
  options,
  selected,
  onToggle,
}: {
  options: PriceOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const checked = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onToggle(option.id)}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
              checked
                ? "border-primary bg-primary/5"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <span>{option.label}</span>
            <span className="text-xs text-muted-foreground">{formatWon(option.price)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function EstimateForm({ inquiry, draft, setDraft, onNext }: EstimateFormProps) {
  const referenceUrls = parseReferenceUrls(inquiry.reference);
  const summary = useMemo(() => calculateEstimate(draft), [draft]);

  const toggle = (key: AddonSelectionKey, id: string) => {
    setDraft((prev) => {
      const has = prev.selections[key].includes(id);
      return {
        ...prev,
        selections: {
          ...prev.selections,
          [key]: has
            ? prev.selections[key].filter((item) => item !== id)
            : [...prev.selections[key], id],
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">견적서 작성</h1>
        <p className="text-sm text-muted-foreground">
          견적 계산 후 다음 단계에서 견적서를 확인하고 PDF를 저장하세요.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">고객 정보</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>이름</Label>
                <Input
                  value={draft.customer.name}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, name: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>회사명</Label>
                <Input
                  value={draft.customer.company}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, company: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>연락처</Label>
                <Input
                  value={draft.customer.phone}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, phone: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>이메일</Label>
                <Input
                  value={draft.customer.email}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, email: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>업종</Label>
                <Input
                  value={draft.customer.businessType}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, businessType: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">견적 정보</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>견적번호</Label>
                <Input value={draft.estimateNumber} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label>작성일</Label>
                <Input
                  type="date"
                  value={draft.issuedDate}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, issuedDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>담당자</Label>
                <Input
                  value={draft.manager}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, manager: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>계약금 비율</Label>
                <div className="flex gap-2">
                  {[50, 30].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        draft.depositRatio === ratio
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          depositRatio: ratio as 30 | 50,
                          paymentTerms: paymentTermsByDepositRatio(ratio as 30 | 50),
                        }))
                      }
                    >
                      {ratio}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>결제조건</Label>
                <Textarea
                  value={draft.paymentTerms}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, paymentTerms: e.target.value }))
                  }
                  className="min-h-24"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <Accordion type="single" collapsible>
              <AccordionItem value="request">
                <AccordionTrigger>고객 요청 내용 보기</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 rounded-xl border border-dashed border-border bg-slate-50/60 p-4 text-sm">
                    <p><span className="font-medium">필요 페이지:</span> {inquiry.pages.join(", ") || "-"}</p>
                    <p><span className="font-medium">필요 기능:</span> {inquiry.features.join(", ") || "-"}</p>
                    <p><span className="font-medium">문의 내용:</span> {inquiry.message || "-"}</p>
                    <p><span className="font-medium">참고 사이트:</span> {referenceUrls.join(", ") || "-"}</p>
                    <p><span className="font-medium">예산:</span> {inquiry.budget || "-"}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">견적 계산</h2>
            <Accordion type="multiple" defaultValue={["package", "page", "feature"]} className="mt-2">
              <AccordionItem value="package">
                <AccordionTrigger>기본 패키지</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(Object.keys(PACKAGE_OPTIONS) as PackageType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            selections: { ...prev.selections, packageType: key },
                          }))
                        }
                        className={`rounded-xl border px-3 py-2 text-left transition ${
                          draft.selections.packageType === key
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <p className="font-medium">{PACKAGE_OPTIONS[key].label}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatWon(PACKAGE_OPTIONS[key].price)}
                        </p>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="page">
                <AccordionTrigger>페이지 추가</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-4 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">일반 페이지</p>
                        <p className="text-xs text-muted-foreground">30,000원 / 1페이지</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              selections: {
                                ...prev.selections,
                                generalPageCount: Math.max(0, prev.selections.generalPageCount - 1),
                              },
                            }))
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {draft.selections.generalPageCount}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              selections: {
                                ...prev.selections,
                                generalPageCount: prev.selections.generalPageCount + 1,
                              },
                            }))
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <OptionChecks
                    options={PAGE_ADDON_OPTIONS}
                    selected={draft.selections.pageAddons}
                    onToggle={(id) => toggle("pageAddons", id)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="feature">
                <AccordionTrigger>기능 추가</AccordionTrigger>
                <AccordionContent>
                  <OptionChecks
                    options={FEATURE_ADDON_OPTIONS}
                    selected={draft.selections.featureAddons}
                    onToggle={(id) => toggle("featureAddons", id)}
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    기본 포함: {INCLUDED_FEATURE_LABELS.join(", ")}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="member">
                <AccordionTrigger>회원 기능</AccordionTrigger>
                <AccordionContent>
                  <OptionChecks
                    options={MEMBER_ADDON_OPTIONS}
                    selected={draft.selections.memberAddons}
                    onToggle={(id) => toggle("memberAddons", id)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="admin">
                <AccordionTrigger>관리자 기능</AccordionTrigger>
                <AccordionContent>
                  <OptionChecks
                    options={ADMIN_ADDON_OPTIONS}
                    selected={draft.selections.adminAddons}
                    onToggle={(id) => toggle("adminAddons", id)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="integration">
                <AccordionTrigger>외부 연동</AccordionTrigger>
                <AccordionContent>
                  <OptionChecks
                    options={INTEGRATION_ADDON_OPTIONS}
                    selected={draft.selections.integrationAddons}
                    onToggle={(id) => toggle("integrationAddons", id)}
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    기본 포함: {INCLUDED_INTEGRATION_LABELS.join(", ")}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">추가 조건</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["domainSeparate", "도메인 비용 별도"],
                ["serverSeparate", "서버 비용 별도"],
                ["maintenanceSeparate", "유지보수 별도"],
                ["vatIncluded", "부가세 포함"],
                ["vatSeparate", "부가세 별도"],
                ["openBalance", "잔금 오픈 후"],
                ["contentRequired", "콘텐츠 제공 필요"],
                ["photoSeparate", "사진촬영 별도"],
                ["designDraft1", "디자인 시안 1회"],
                ["designDraft2", "디자인 시안 2회"],
                ["revision2Included", "수정 2회 포함"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <Checkbox
                    checked={draft.conditions[key as keyof EstimateDraftData["conditions"]]}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({
                        ...prev,
                        conditions: {
                          ...prev.conditions,
                          [key]: Boolean(checked),
                          ...(key === "vatIncluded" && checked ? { vatSeparate: false } : {}),
                          ...(key === "vatSeparate" && checked ? { vatIncluded: false } : {}),
                        },
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">할인 적용</h2>
            <div className="mt-4 space-y-3">
              {[
                ["none", "할인 없음"],
                ["10", "10% 할인"],
                ["20", "20% 할인"],
                ["custom", "기타 할인금액 직접 입력"],
              ].map(([type, label]) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="discountType"
                    checked={draft.discount.type === type}
                    onChange={() =>
                      setDraft((prev) => ({
                        ...prev,
                        discount: {
                          ...prev.discount,
                          type: type as EstimateDraftData["discount"]["type"],
                        },
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
              {draft.discount.type === "custom" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="customDiscount">할인 금액</Label>
                  <Input
                    id="customDiscount"
                    placeholder="숫자만 입력"
                    value={draft.discount.customAmount ? String(draft.discount.customAmount) : ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        discount: {
                          ...prev.discount,
                          customAmount: Number(e.target.value.replace(/\D/g, "") || 0),
                        },
                      }))
                    }
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">비고</h2>
            <Textarea
              className="mt-4 min-h-24"
              value={draft.note}
              onChange={(e) => setDraft((prev) => ({ ...prev, note: e.target.value }))}
            />
          </section>

          <div className="flex items-center justify-between pt-2">
            <Button asChild variant="outline">
              <Link href={`/admin/inquiries/${inquiry.id}`}>
                <ArrowLeft className="h-4 w-4" />
                문의 상세로
              </Link>
            </Button>
            <Button type="button" onClick={onNext}>
              다음
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <motion.div
            layout
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold">실시간 견적 요약</h3>
            <div className="mt-3 space-y-2 text-sm">
              {summary.lines.map((line) => (
                <div key={line.id} className="flex items-center justify-between">
                  <span>{line.label}</span>
                  <span className="font-medium">{formatWon(line.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">소계</span>
                  <span>{summary.subtotal.toLocaleString("ko-KR")}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">할인</span>
                  <span>-{summary.discountAmount.toLocaleString("ko-KR")}원</span>
                </div>
                {draft.conditions.vatSeparate ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">부가세</span>
                    <span>{summary.vat.toLocaleString("ko-KR")}원</span>
                  </div>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">최종 금액</p>
              <p className="text-3xl font-bold text-foreground">
                {summary.total.toLocaleString("ko-KR")}원
              </p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
