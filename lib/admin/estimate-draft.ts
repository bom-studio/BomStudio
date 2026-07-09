import { getInquiryDisplayNumber } from "@/lib/admin/inquiry-number";
import type { EstimateInquiry } from "@/types/inquiry";

export type PackageType = "starter" | "basic" | "premium";

export interface PriceOption {
  id: string;
  label: string;
  price: number | null;
  included?: boolean;
}

export interface EstimateLine {
  id: string;
  label: string;
  price: number | null;
}

export interface EstimateDraftData {
  estimateNumber: string;
  issuedDate: string;
  manager: string;
  depositRatio: 30 | 50;
  paymentTerms: string;
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    businessType: string;
  };
  selections: {
    packageType: PackageType;
    generalPageCount: number;
    pageAddons: string[];
    featureAddons: string[];
    memberAddons: string[];
    adminAddons: string[];
    integrationAddons: string[];
  };
  discount: {
    type: "none" | "10" | "20" | "custom";
    customAmount: number;
  };
  conditions: {
    domainSeparate: boolean;
    serverSeparate: boolean;
    maintenanceSeparate: boolean;
    vatIncluded: boolean;
    vatSeparate: boolean;
    openBalance: boolean;
    contentRequired: boolean;
    photoSeparate: boolean;
    designDraft1: boolean;
    designDraft2: boolean;
    revision2Included: boolean;
  };
  note: string;
}

export const PACKAGE_OPTIONS: Record<PackageType, { label: string; price: number | null }> = {
  starter: { label: "Starter", price: 390000 },
  basic: { label: "Basic", price: 590000 },
  premium: { label: "Premium", price: null },
};

export const PAGE_ADDON_OPTIONS: PriceOption[] = [
  { id: "page-notice", label: "공지사항", price: 50000 },
  { id: "page-faq", label: "FAQ", price: 30000 },
  { id: "page-gallery", label: "갤러리", price: 50000 },
  { id: "page-board", label: "게시글", price: 70000 },
  { id: "page-reservation", label: "예약 페이지", price: 80000 },
  { id: "page-recruit", label: "채용", price: 70000 },
  { id: "page-mall", label: "쇼핑몰", price: null },
];

export const FEATURE_ADDON_OPTIONS: PriceOption[] = [
  { id: "feature-admin", label: "관리자 페이지", price: 250000 },
  { id: "feature-reservation", label: "예약 시스템", price: 250000 },
  { id: "feature-payment", label: "결제 시스템", price: 350000 },
  { id: "feature-upload", label: "파일 업로드", price: 120000 },
  { id: "feature-search", label: "검색 기능", price: 120000 },
  { id: "feature-multi-lang", label: "다국어", price: 350000 },
  { id: "feature-popup", label: "팝업 관리", price: 90000 },
  { id: "feature-analytics", label: "방문자 통계", price: 80000 },
  { id: "feature-notice-sms", label: "알림톡/SMS", price: 180000 },
];

export const INCLUDED_FEATURE_LABELS = [
  "반응형",
  "SEO",
  "문의폼",
  "Google 지도",
  "카카오톡",
];

export const MEMBER_ADDON_OPTIONS: PriceOption[] = [
  { id: "member-signup", label: "회원가입", price: 120000 },
  { id: "member-mypage", label: "마이페이지", price: 180000 },
  { id: "member-board", label: "회원 게시판", price: 150000 },
  { id: "member-comment", label: "댓글", price: 60000 },
  { id: "member-private", label: "비밀글", price: 50000 },
  { id: "member-attach", label: "첨부파일", price: 50000 },
  { id: "member-social", label: "소셜 로그인", price: 120000 },
];

export const ADMIN_ADDON_OPTIONS: PriceOption[] = [
  { id: "admin-notice", label: "공지 관리", price: 90000 },
  { id: "admin-post", label: "게시글 관리", price: 120000 },
  { id: "admin-inquiry", label: "문의 관리", price: 90000 },
  { id: "admin-reservation", label: "예약 관리", price: 120000 },
  { id: "admin-member", label: "회원 관리", price: 120000 },
  { id: "admin-order", label: "주문 관리", price: 180000 },
];

export const INTEGRATION_ADDON_OPTIONS: PriceOption[] = [
  { id: "integration-smtp", label: "SMTP", price: 50000 },
  { id: "integration-toss", label: "토스페이먼츠", price: 220000 },
  { id: "integration-import", label: "아임포트", price: 220000 },
];

export const INCLUDED_INTEGRATION_LABELS = [
  "Google Analytics",
  "Search Console",
  "네이버 서치",
  "카카오톡 채널",
];

function selectedLines(ids: string[], options: PriceOption[]): EstimateLine[] {
  const set = new Set(ids);
  return options
    .filter((option) => set.has(option.id))
    .map((option) => ({ id: option.id, label: option.label, price: option.price }));
}

export function calculateEstimate(draft: EstimateDraftData) {
  const lines: EstimateLine[] = [
    {
      id: `package-${draft.selections.packageType}`,
      label: PACKAGE_OPTIONS[draft.selections.packageType].label,
      price: PACKAGE_OPTIONS[draft.selections.packageType].price,
    },
    ...selectedLines(draft.selections.pageAddons, PAGE_ADDON_OPTIONS),
    ...selectedLines(draft.selections.featureAddons, FEATURE_ADDON_OPTIONS),
    ...selectedLines(draft.selections.memberAddons, MEMBER_ADDON_OPTIONS),
    ...selectedLines(draft.selections.adminAddons, ADMIN_ADDON_OPTIONS),
    ...selectedLines(draft.selections.integrationAddons, INTEGRATION_ADDON_OPTIONS),
  ];

  if (draft.selections.generalPageCount > 0) {
    lines.push({
      id: "page-general-count",
      label: `일반 페이지 × ${draft.selections.generalPageCount}`,
      price: 30000 * draft.selections.generalPageCount,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + (line.price ?? 0), 0);
  const discountAmount =
    draft.discount.type === "10"
      ? Math.round(subtotal * 0.1)
      : draft.discount.type === "20"
        ? Math.round(subtotal * 0.2)
        : draft.discount.type === "custom"
          ? Math.max(0, Math.min(subtotal, Math.round(draft.discount.customAmount || 0)))
          : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const vat = draft.conditions.vatSeparate ? Math.round(discountedSubtotal * 0.1) : 0;
  const total = draft.conditions.vatSeparate ? discountedSubtotal + vat : discountedSubtotal;

  return { lines, subtotal, discountAmount, discountedSubtotal, vat, total };
}

export function encodeDraft(draft: EstimateDraftData) {
  return encodeURIComponent(JSON.stringify(draft));
}

export function decodeDraft(value?: string) {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as EstimateDraftData;
  } catch {
    return null;
  }
}

export interface EstimatePreviewRow {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
}

const PACKAGE_META: Record<PackageType, { description: string; duration: string }> = {
  starter: {
    description: "반응형 홈페이지 기본 제작 (메인, 회사소개, 문의 등)",
    duration: "2~3주",
  },
  basic: {
    description: "확장형 홈페이지 제작 (페이지 및 기능 확장)",
    duration: "3~4주",
  },
  premium: {
    description: "맞춤형 프리미엄 홈페이지 제작",
    duration: "별도 협의",
  },
};

function addonRows(ids: string[], options: PriceOption[]): EstimatePreviewRow[] {
  const set = new Set(ids);
  return options
    .filter((option) => set.has(option.id))
    .map((option) => ({
      id: option.id,
      title: option.label,
      description: `${option.label} 제작 및 반응형 적용`,
      duration: "2~5일",
      price: option.price,
    }));
}

export function buildPreviewRows(draft: EstimateDraftData): EstimatePreviewRow[] {
  const packageOption = PACKAGE_OPTIONS[draft.selections.packageType];
  const rows: EstimatePreviewRow[] = [
    {
      id: `package-${draft.selections.packageType}`,
      title: packageOption.label,
      description: PACKAGE_META[draft.selections.packageType].description,
      duration: PACKAGE_META[draft.selections.packageType].duration,
      price: packageOption.price,
    },
    ...addonRows(draft.selections.pageAddons, PAGE_ADDON_OPTIONS),
    ...addonRows(draft.selections.featureAddons, FEATURE_ADDON_OPTIONS),
    ...addonRows(draft.selections.memberAddons, MEMBER_ADDON_OPTIONS),
    ...addonRows(draft.selections.adminAddons, ADMIN_ADDON_OPTIONS),
    ...addonRows(draft.selections.integrationAddons, INTEGRATION_ADDON_OPTIONS),
  ];

  if (draft.selections.generalPageCount > 0) {
    rows.push({
      id: "page-general-count",
      title: `일반 페이지 × ${draft.selections.generalPageCount}`,
      description: "추가 일반 페이지 제작",
      duration: `${draft.selections.generalPageCount * 2}~${draft.selections.generalPageCount * 3}일`,
      price: 30000 * draft.selections.generalPageCount,
    });
  }

  return rows;
}

export function formatPreviewPrice(price: number | null) {
  if (price === null) return "별도 견적";
  if (price === 0) return "-";
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

export function formatDisplayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function paymentTermsByDepositRatio(ratio: 30 | 50) {
  if (ratio === 30) {
    return "계약 시 계약금 30% 입금\n홈페이지 제작 완료 및 배포 후 잔금 70% 입금";
  }
  return "계약 시 계약금 50% 입금\n홈페이지 제작 완료 및 배포 후 잔금 50% 입금";
}


export function createDefaultDraft(inquiry: EstimateInquiry): EstimateDraftData {
  return {
    estimateNumber: getInquiryDisplayNumber(inquiry),
    issuedDate: new Date().toISOString().slice(0, 10),
    manager: "허보미",
    depositRatio: 50,
    paymentTerms: paymentTermsByDepositRatio(50),
    customer: {
      name: inquiry.name,
      company: inquiry.company ?? "",
      phone: inquiry.phone,
      email: inquiry.email ?? "",
      businessType: inquiry.business_type ?? "",
    },
    selections: {
      packageType: "starter",
      generalPageCount: 0,
      pageAddons: [],
      featureAddons: [],
      memberAddons: [],
      adminAddons: [],
      integrationAddons: [],
    },
    discount: { type: "none", customAmount: 0 },
    conditions: {
      domainSeparate: true,
      serverSeparate: true,
      maintenanceSeparate: true,
      vatIncluded: false,
      vatSeparate: true,
      openBalance: true,
      contentRequired: true,
      photoSeparate: false,
      designDraft1: false,
      designDraft2: false,
      revision2Included: true,
    },
    note: "",
  };
}

export function getEstimateStorageKey(inquiryId: string) {
  return `bom-estimate-form-${inquiryId}`;
}

export function loadDraftFromStorage(inquiryId: string): EstimateDraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getEstimateStorageKey(inquiryId));
    if (!raw) return null;
    return JSON.parse(raw) as EstimateDraftData;
  } catch {
    return null;
  }
}

export function saveDraftToStorage(inquiryId: string, draft: EstimateDraftData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getEstimateStorageKey(inquiryId), JSON.stringify(draft));
}

export function formatContractConditions(draft: EstimateDraftData) {
  const lines = [draft.paymentTerms.trim()];
  if (draft.conditions.domainSeparate) lines.push("도메인 별도");
  if (draft.conditions.serverSeparate) lines.push("호스팅(서버) 별도");
  if (draft.conditions.maintenanceSeparate) lines.push("유지보수 별도");
  return lines.filter(Boolean).join("\n");
}
