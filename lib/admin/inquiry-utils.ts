export function formatInquiryDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function parseReferenceUrls(reference: string | null): string[] {
  if (!reference?.trim()) {
    return [];
  }

  return reference
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function buildInquiryCopyText(inquiry: {
  inquiryNumber: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  business_type: string | null;
  budget: string | null;
  schedule: string | null;
  pages: string[];
  features: string[];
  reference: string | null;
  message: string | null;
  status: string;
  created_at: string;
}) {
  const lines = [
    `[견적문의] ${inquiry.inquiryNumber}`,
    `상태: ${inquiry.status}`,
    `접수일: ${formatInquiryDate(inquiry.created_at)}`,
    "",
    "■ 고객 정보",
    `이름: ${inquiry.name}`,
    `연락처: ${inquiry.phone}`,
    inquiry.email ? `이메일: ${inquiry.email}` : null,
    inquiry.company ? `회사명: ${inquiry.company}` : null,
    inquiry.business_type ? `업종: ${inquiry.business_type}` : null,
    "",
    "■ 프로젝트",
    inquiry.budget ? `예상 예산: ${inquiry.budget}` : null,
    inquiry.schedule ? `희망 일정: ${inquiry.schedule}` : null,
    inquiry.pages.length ? `필요 페이지: ${inquiry.pages.join(", ")}` : null,
    inquiry.features.length ? `필요 기능: ${inquiry.features.join(", ")}` : null,
    inquiry.reference ? `참고 사이트: ${inquiry.reference}` : null,
    "",
    "■ 문의 내용",
    inquiry.message || "(내용 없음)",
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}
