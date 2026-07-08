import type {
  EstimateStep1Data,
  EstimateStep1Errors,
  EstimateStep1Field,
} from "@/types/estimate";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^010-\d{4}-\d{4}$/;

export function validateCompany(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "회사명을 입력해주세요.";
  if (trimmed.length < 2) return "회사명은 2자 이상 입력해주세요.";
  if (trimmed.length > 50) return "회사명은 50자 이하로 입력해주세요.";
  return undefined;
}

export function validateContactName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "담당자명을 입력해주세요.";

  if (!/^[가-힣a-zA-Z\s]+$/.test(trimmed)) {
    return "담당자명은 한글 또는 영문 2글자 이상 입력해주세요.";
  }

  const letterCount = (trimmed.match(/[가-힣a-zA-Z]/g) ?? []).length;
  if (letterCount < 2) {
    return "담당자명은 한글 또는 영문 2글자 이상 입력해주세요.";
  }

  if (trimmed.length > 20) {
    return "담당자명은 20자 이하로 입력해주세요.";
  }

  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "올바른 연락처를 입력해주세요. 예: 010-1234-5678";

  const digits = trimmed.replace(/\D/g, "");
  if (!digits.startsWith("010") || digits.length !== 11 || !PHONE_REGEX.test(trimmed)) {
    return "올바른 연락처를 입력해주세요. 예: 010-1234-5678";
  }

  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "올바른 이메일 주소를 입력해주세요. 예: name@example.com";
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(trimmed)) {
    return "올바른 이메일 주소를 입력해주세요. 예: name@example.com";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "올바른 이메일 주소를 입력해주세요. 예: name@example.com";
  }
  return undefined;
}

export function validateBusinessType(value: string): string | undefined {
  if (!value.trim()) return "업종을 선택해주세요.";
  return undefined;
}

export function validateBusinessTypeOther(
  businessType: string,
  value: string
): string | undefined {
  if (businessType !== "기타") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return "기타 업종을 입력해주세요.";
  if (trimmed.length < 2) return "기타 업종은 2자 이상 입력해주세요.";
  if (trimmed.length > 50) return "기타 업종은 50자 이하로 입력해주세요.";
  return undefined;
}

export function validateStep1Field(
  field: EstimateStep1Field,
  value: string,
  data?: EstimateStep1Data
): string | undefined {
  switch (field) {
    case "company":
      return validateCompany(value);
    case "contact":
      return validateContactName(value);
    case "phone":
      return validatePhone(value);
    case "email":
      return validateEmail(value);
    case "businessType":
      return validateBusinessType(value);
    case "businessTypeOther":
      return validateBusinessTypeOther(data?.businessType ?? "", value);
    default:
      return undefined;
  }
}

export function validateStep1(data: EstimateStep1Data): EstimateStep1Errors {
  return {
    company: validateCompany(data.company),
    contact: validateContactName(data.contact),
    phone: validatePhone(data.phone),
    email: validateEmail(data.email),
    businessType: validateBusinessType(data.businessType),
    businessTypeOther: validateBusinessTypeOther(data.businessType, data.businessTypeOther),
  };
}

export function hasStep1Errors(errors: EstimateStep1Errors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

export function validateStep3(pages: string[], features: string[]) {
  const errors: { pages?: string; features?: string } = {};

  if (pages.length === 0) {
    errors.pages = "필요한 페이지를 최소 1개 이상 선택해 주세요.";
  }

  if (features.length === 0) {
    errors.features = "필요한 기능을 최소 1개 이상 선택해 주세요.";
  }

  return errors;
}

export function hasStep3Errors(errors: { pages?: string; features?: string }): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

export function parseReferenceUrls(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function validateReferenceUrls(value: string): string | undefined {
  const urls = parseReferenceUrls(value);

  for (const url of urls) {
    if (!/^https?:\/\//.test(url)) {
      return "URL은 http:// 또는 https:// 로 시작해야 합니다.";
    }
  }

  return undefined;
}

export function sanitizeCompanyInput(value: string): string {
  return value.slice(0, 50);
}

export function sanitizeContactNameInput(value: string): string {
  return value.replace(/[^가-힣a-zA-Z\s]/g, "").slice(0, 20);
}

export function sanitizeBusinessTypeOtherInput(value: string): string {
  return value.slice(0, 50);
}
