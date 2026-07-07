"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Send, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  BasicInfoStep,
  normalizeStep1Data,
} from "@/components/estimate/BasicInfoStep";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FEATURE_OPTIONS, PAGE_OPTIONS } from "@/constants/contact";
import { transition } from "@/lib/motion";
import {
  hasStep1Errors,
  validateStep1,
  validateStep1Field,
} from "@/lib/validation/estimate";
import type { EstimateFormData } from "@/types";
import {
  INITIAL_STEP1_DATA,
  type EstimateStep1Data,
  type EstimateStep1Errors,
  type EstimateStep1Field,
  type EstimateStep1Touched,
} from "@/types/estimate";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "기본 정보", description: "연락처를 입력해 주세요" },
  { id: 2, title: "프로젝트 정보", description: "예산과 일정을 알려주세요" },
  { id: 3, title: "요구사항", description: "필요한 페이지와 기능을 선택해 주세요" },
  { id: 4, title: "추가 정보", description: "참고 자료와 요청사항을 입력해 주세요" },
];

const INITIAL_FORM_DATA: EstimateFormData = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  budget: "",
  schedule: "",
  pages: [],
  features: [],
  reference: "",
  notes: "",
};

const ALL_STEP1_TOUCHED: EstimateStep1Touched = {
  company: true,
  contact: true,
  phone: true,
  email: true,
};

export function StepEstimateForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<EstimateFormData>(INITIAL_FORM_DATA);
  const [step1Data, setStep1Data] = useState<EstimateStep1Data>(INITIAL_STEP1_DATA);
  const [step1Errors, setStep1Errors] = useState<EstimateStep1Errors>({});
  const [step1Touched, setStep1Touched] = useState<EstimateStep1Touched>({});

  const toggleItem = (
    item: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleStep1Change = (field: EstimateStep1Field, value: string) => {
    setStep1Data((prev) => ({ ...prev, [field]: value }));
    setStep1Touched((prev) => ({ ...prev, [field]: true }));
    setStep1Errors((prev) => ({
      ...prev,
      [field]: validateStep1Field(field, value),
    }));
  };

  const handleStep1Blur = (field: EstimateStep1Field) => {
    setStep1Touched((prev) => ({ ...prev, [field]: true }));
    setStep1Errors((prev) => ({
      ...prev,
      [field]: validateStep1Field(field, step1Data[field]),
    }));
  };

  const validateAndNormalizeStep1 = (): EstimateStep1Data | null => {
    const normalized = normalizeStep1Data(step1Data);
    const errors = validateStep1(normalized);

    setStep1Touched(ALL_STEP1_TOUCHED);
    setStep1Errors(errors);

    if (hasStep1Errors(errors)) {
      return null;
    }

    setStep1Data(normalized);
    setFormData((prev) => ({
      ...prev,
      company: normalized.company,
      contact: normalized.contact,
      phone: normalized.phone,
      email: normalized.email,
    }));

    return normalized;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const nextStep = () => {
    if (step === 1) {
      const result = validateAndNormalizeStep1();
      if (!result) return;
    }

    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-3xl border border-border/60 bg-card p-10 text-center shadow-sm"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold">접수 완료</h2>
        <p className="mt-3 text-muted-foreground">
          견적 문의가 접수되었습니다. 영업일 기준 1~2일 내에 연락드리겠습니다.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    step >= s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span className="mt-2 hidden text-xs text-muted-foreground sm:block">
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors",
                    step > s.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={transition.normal}
            >
              <h2 className="text-xl font-semibold">{STEPS[step - 1].title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {STEPS[step - 1].description}
              </p>

              {step === 1 && (
                <BasicInfoStep
                  data={step1Data}
                  errors={step1Errors}
                  touched={step1Touched}
                  onChange={handleStep1Change}
                  onBlur={handleStep1Blur}
                />
              )}

              {step === 2 && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="budget">예산</Label>
                    <Input
                      id="budget"
                      placeholder="예: 39만원"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, budget: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">희망 일정</Label>
                    <Input
                      id="schedule"
                      placeholder="예: 2개월 이내"
                      value={formData.schedule}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, schedule: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-8 space-y-8">
                  <div className="space-y-3">
                    <Label>필요한 페이지</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {PAGE_OPTIONS.map((page) => (
                        <label
                          key={page}
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={formData.pages.includes(page)}
                            onCheckedChange={() =>
                              toggleItem(page, formData.pages, (pages) =>
                                setFormData((prev) => ({ ...prev, pages }))
                              )
                            }
                          />
                          {page}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>필요한 기능</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {FEATURE_OPTIONS.map((feature) => (
                        <label
                          key={feature}
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={formData.features.includes(feature)}
                            onCheckedChange={() =>
                              toggleItem(feature, formData.features, (features) =>
                                setFormData((prev) => ({ ...prev, features }))
                              )
                            }
                          />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reference">참고 사이트</Label>
                    <Input
                      id="reference"
                      placeholder="https://example.com"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reference: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">파일 첨부</Label>
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <Input
                        id="file"
                        type="file"
                        className="border-0 p-0 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">추가 요청사항</Label>
                    <Textarea
                      id="notes"
                      placeholder="추가로 전달하고 싶은 내용을 자유롭게 작성해 주세요"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, notes: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="group">
                <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
                이전
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="group">
                다음
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            ) : (
              <Button type="submit" className="group">
                견적 문의 제출
                <Send className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
