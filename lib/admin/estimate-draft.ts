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
