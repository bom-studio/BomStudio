"use client";

import type {
  EstimateStep1Data,
  EstimateStep1Errors,
  EstimateStep1Field,
  EstimateStep1Touched,
} from "@/types/estimate";
import { BUSINESS_TYPE_OPTIONS } from "@/constants/business-type";
import { FormField } from "@/components/estimate/FormField";
import { Label } from "@/components/ui/label";
import { formatPhoneNumber } from "@/lib/format/phone";
import {
  sanitizeBusinessTypeOtherInput,
  sanitizeCompanyInput,
  sanitizeContactNameInput,
} from "@/lib/validation/estimate";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
  data: EstimateStep1Data;
  errors: EstimateStep1Errors;
  touched: EstimateStep1Touched;
  onChange: (field: EstimateStep1Field, value: string) => void;
  onBlur: (field: EstimateStep1Field) => void;
}

export function BasicInfoStep({
  data,
  errors,
  touched,
  onChange,
  onBlur,
}: BasicInfoStepProps) {
  const showError = (field: EstimateStep1Field) =>
    touched[field] ? errors[field] : undefined;

  const handleCompanyChange = (value: string) => {
    onChange("company", sanitizeCompanyInput(value));
  };

  const handleContactChange = (value: string) => {
    onChange("contact", sanitizeContactNameInput(value));
  };

  const handlePhoneChange = (value: string) => {
    onChange("phone", formatPhoneNumber(value));
  };

  const handleEmailChange = (value: string) => {
    onChange("email", value);
  };

  const handleBusinessTypeChange = (value: string) => {
    onChange("businessType", value);
  };

  const handleBusinessTypeOtherChange = (value: string) => {
    onChange("businessTypeOther", sanitizeBusinessTypeOtherInput(value));
  };

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField
          id="company"
          label="회사명"
          placeholder="봄스튜디오"
          value={data.company}
          onChange={(e) => handleCompanyChange(e.target.value)}
          onBlur={() => onBlur("company")}
          error={showError("company")}
          errorId="company-error"
          autoComplete="organization"
        />
      </div>

      <FormField
        id="contact"
        label="담당자"
        placeholder="홍길동"
        value={data.contact}
        onChange={(e) => handleContactChange(e.target.value)}
        onBlur={() => onBlur("contact")}
        error={showError("contact")}
        errorId="contact-error"
        autoComplete="name"
      />

      <FormField
        id="phone"
        label="연락처"
        type="tel"
        inputMode="numeric"
        placeholder="010-1234-5678"
        value={data.phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        onBlur={() => onBlur("phone")}
        error={showError("phone")}
        errorId="phone-error"
        autoComplete="tel"
        maxLength={13}
      />

      <div className="sm:col-span-2 space-y-2">
        <Label htmlFor="businessType">업종</Label>
        <select
          id="businessType"
          value={data.businessType}
          onChange={(e) => handleBusinessTypeChange(e.target.value)}
          onBlur={() => onBlur("businessType")}
          aria-invalid={Boolean(showError("businessType"))}
          aria-describedby={showError("businessType") ? "businessType-error" : undefined}
          className={cn(
            "flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            showError("businessType") && "border-destructive focus-visible:ring-destructive"
          )}
        >
          <option value="">업종을 선택해주세요</option>
          {BUSINESS_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {showError("businessType") ? (
          <p id="businessType-error" className="text-xs text-destructive" role="alert">
            {showError("businessType")}
          </p>
        ) : null}
      </div>

      {data.businessType === "기타" ? (
        <div className="sm:col-span-2">
          <FormField
            id="businessTypeOther"
            label="기타 업종"
            placeholder="예: 제조업, IT 서비스"
            value={data.businessTypeOther}
            onChange={(e) => handleBusinessTypeOtherChange(e.target.value)}
            onBlur={() => onBlur("businessTypeOther")}
            error={showError("businessTypeOther")}
            errorId="businessTypeOther-error"
            maxLength={50}
          />
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <FormField
          id="email"
          label="이메일"
          type="email"
          placeholder="bomstudio@example.com"
          value={data.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={() => onBlur("email")}
          error={showError("email")}
          errorId="email-error"
          autoComplete="email"
        />
      </div>
    </div>
  );
}

export function normalizeStep1Data(data: EstimateStep1Data): EstimateStep1Data {
  return {
    company: data.company.trim(),
    contact: data.contact.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    businessType: data.businessType.trim(),
    businessTypeOther: data.businessTypeOther.trim(),
  };
}