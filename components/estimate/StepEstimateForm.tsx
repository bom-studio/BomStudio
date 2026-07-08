"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { submitEstimateInquiry } from "@/app/actions/inquiries";
import {
  BasicInfoStep,
  normalizeStep1Data,
} from "@/components/estimate/BasicInfoStep";
import { ProjectInfoStep } from "@/components/estimate/ProjectInfoStep";
import { RequirementsStep } from "@/components/estimate/RequirementsStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { transition } from "@/lib/motion";
import {
  hasStep1Errors,
  hasStep3Errors,
  validateReferenceUrls,
  validateStep1,
  validateStep1Field,
  validateStep3,
} from "@/lib/validation/estimate";
import type { EstimateFormData } from "@/types";
import {
  INITIAL_STEP1_DATA,
  type EstimateStep1Data,
  type EstimateStep1Errors,
  type EstimateStep1Field,
  type EstimateStep1Touched,
  type EstimateStep3Errors,
} from "@/types/estimate";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

const STEPS = [
  { id: 1, title: "기본 정보", description: "연락처를 입력해 주세요" },
  { id: 2, title: "프로젝트 정보", description: "예산과 일정을 알려주세요" },
  { id: 3, title: "요구사항", description: "필요한 페이지와 기능을 선택해 주세요" },
  { id: 4, title: "추가 정보", description: "참고 사이트와 문의 내용을 입력해 주세요" },
];

const INITIAL_FORM_DATA: EstimateFormData = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  businessType: "",
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
  businessType: true,
  businessTypeOther: true,
};

const EMPTY_REFERENCE_URLS = ["", "", ""];

export function StepEstimateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<EstimateFormData>(INITIAL_FORM_DATA);
  const [step1Data, setStep1Data] = useState<EstimateStep1Data>(INITIAL_STEP1_DATA);
  const [step1Errors, setStep1Errors] = useState<EstimateStep1Errors>({});
  const [step1Touched, setStep1Touched] = useState<EstimateStep1Touched>({});
  const [step3Errors, setStep3Errors] = useState<EstimateStep3Errors>({});
  const [referenceUrls, setReferenceUrls] = useState<string[]>([...EMPTY_REFERENCE_URLS]);
  const [referenceErrors, setReferenceErrors] = useState<(string | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ]);

  const handleStep1Change = (field: EstimateStep1Field, value: string) => {
    setStep1Data((prev) => {
      const nextData = { ...prev, [field]: value };

      if (field === "businessType" && value !== "기타") {
        nextData.businessTypeOther = "";
      }

      setStep1Touched((prevTouched) => ({
        ...prevTouched,
        [field]: true,
        ...(field === "businessType" && value !== "기타"
          ? { businessTypeOther: false }
          : {}),
      }));

      setStep1Errors((prevErrors) => ({
        ...prevErrors,
        [field]: validateStep1Field(field, value, nextData),
        ...(field === "businessType" && value !== "기타"
          ? { businessTypeOther: undefined }
          : {}),
      }));

      return nextData;
    });
  };

  const handleStep1Blur = (field: EstimateStep1Field) => {
    setStep1Touched((prev) => ({ ...prev, [field]: true }));
    setStep1Errors((prev) => ({
      ...prev,
      [field]: validateStep1Field(field, step1Data[field], step1Data),
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
      businessType:
        normalized.businessType === "기타"
          ? `기타: ${normalized.businessTypeOther}`
          : normalized.businessType,
    }));

    return normalized;
  };

  const validateRequirements = (): boolean => {
    const errors = validateStep3(formData.pages, formData.features);
    setStep3Errors(errors);
    return !hasStep3Errors(errors);
  };

  const validateStep4Reference = () => {
    const joined = referenceUrls.map((url) => url.trim()).filter(Boolean).join("\n");
    const error = validateReferenceUrls(joined);

    if (!error) {
      setReferenceErrors([undefined, undefined, undefined]);
      setFormData((prev) => ({ ...prev, reference: joined }));
      return true;
    }

    setReferenceErrors(
      referenceUrls.map((url) =>
        url.trim() && !/^https?:\/\//.test(url.trim())
          ? "http:// 또는 https:// 로 시작해야 합니다."
          : undefined
      )
    );
    return false;
  };

  const submitFromStep4 = () => {
    setSubmitError(null);

    if (currentStep !== TOTAL_STEPS) {
      return;
    }

    const normalized = validateAndNormalizeStep1();
    if (!normalized) {
      setCurrentStep(1);
      return;
    }

    if (!validateRequirements()) {
      setCurrentStep(3);
      return;
    }

    if (!validateStep4Reference()) {
      setCurrentStep(4);
      return;
    }

    const payload: EstimateFormData = {
      ...formData,
      company: normalized.company,
      contact: normalized.contact,
      phone: normalized.phone,
      email: normalized.email,
      businessType:
        normalized.businessType === "기타"
          ? `기타: ${normalized.businessTypeOther}`
          : normalized.businessType,
    };

    startTransition(async () => {
      const result = await submitEstimateInquiry(payload);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      setSubmitted(true);
      setFormData(INITIAL_FORM_DATA);
      setStep1Data(INITIAL_STEP1_DATA);
      setStep1Errors({});
      setStep1Touched({});
      setStep3Errors({});
      setReferenceUrls([...EMPTY_REFERENCE_URLS]);
      setReferenceErrors([undefined, undefined, undefined]);
      setCurrentStep(1);
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const result = validateAndNormalizeStep1();
      if (!result) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!validateRequirements()) {
        return;
      }
      setCurrentStep(4);
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

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
          견적문의가 정상적으로 접수되었습니다.
          <br />
          영업일 기준 1~2일 내에 연락드리겠습니다.
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
                    currentStep >= s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > s.id ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span className="mt-2 hidden text-xs text-muted-foreground sm:block">
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors",
                    currentStep > s.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        noValidate
      >
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={transition.normal}
            >
              <h2 className="text-xl font-semibold">{STEPS[currentStep - 1].title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {STEPS[currentStep - 1].description}
              </p>

              {currentStep === 1 && (
                <BasicInfoStep
                  data={step1Data}
                  errors={step1Errors}
                  touched={step1Touched}
                  onChange={handleStep1Change}
                  onBlur={handleStep1Blur}
                />
              )}

              {currentStep === 2 && (
                <ProjectInfoStep
                  budget={formData.budget}
                  schedule={formData.schedule}
                  onBudgetChange={(budget) =>
                    setFormData((prev) => ({ ...prev, budget }))
                  }
                  onScheduleChange={(schedule) =>
                    setFormData((prev) => ({ ...prev, schedule }))
                  }
                />
              )}

              {currentStep === 3 && (
                <RequirementsStep
                  pages={formData.pages}
                  features={formData.features}
                  errors={step3Errors}
                  onPagesChange={(pages) => {
                    setFormData((prev) => ({ ...prev, pages }));
                    if (pages.length > 0) {
                      setStep3Errors((prev) => ({ ...prev, pages: undefined }));
                    }
                  }}
                  onFeaturesChange={(features) => {
                    setFormData((prev) => ({ ...prev, features }));
                    if (features.length > 0) {
                      setStep3Errors((prev) => ({ ...prev, features: undefined }));
                    }
                  }}
                />
              )}

              {currentStep === 4 && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label>참고 사이트 URL</Label>
                    <p className="text-sm text-muted-foreground">
                      비슷하게 만들고 싶은 사이트가 있다면 최대 3개까지 입력해주세요.
                    </p>
                    <div className="space-y-3">
                      {referenceUrls.map((url, index) => (
                        <div key={`reference-${index}`} className="space-y-1">
                          <Label htmlFor={`reference-${index + 1}`} className="text-xs text-muted-foreground">
                            참고 사이트 URL {index + 1}
                          </Label>
                          <Input
                            id={`reference-${index + 1}`}
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => {
                              const next = [...referenceUrls];
                              next[index] = e.target.value;
                              setReferenceUrls(next);

                              const nextJoined = next
                                .map((item) => item.trim())
                                .filter(Boolean)
                                .join("\n");
                              setFormData((prev) => ({ ...prev, reference: nextJoined }));

                              setReferenceErrors((prev) => {
                                const nextErrors = [...prev];
                                if (!e.target.value.trim() || /^https?:\/\//.test(e.target.value.trim())) {
                                  nextErrors[index] = undefined;
                                }
                                return nextErrors;
                              });
                            }}
                            onBlur={() => {
                              const trimmed = referenceUrls[index].trim();
                              setReferenceErrors((prev) => {
                                const nextErrors = [...prev];
                                nextErrors[index] =
                                  trimmed && !/^https?:\/\//.test(trimmed)
                                    ? "http:// 또는 https:// 로 시작해야 합니다."
                                    : undefined;
                                return nextErrors;
                              });
                            }}
                          />
                          {referenceErrors[index] ? (
                            <p className="text-xs text-destructive">{referenceErrors[index]}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">문의 내용</Label>
                    <Textarea
                      id="notes"
                      placeholder="프로젝트 목적, 원하는 방향, 추가 요청사항을 자유롭게 작성해 주세요"
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

          <div className="relative mt-10 space-y-4">
            {submitError ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submitError}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="group">
                <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
                이전
              </Button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <Button type="button" onClick={nextStep} className="group">
                다음
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            ) : (
              <Button
                type="button"
                className="group"
                disabled={isPending}
                onClick={submitFromStep4}
              >
                {isPending ? "제출 중..." : "제출하기"}
                <Send className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
