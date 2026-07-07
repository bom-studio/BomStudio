export type PageHeroVariant =
  | "services"
  | "portfolio"
  | "pricing"
  | "process"
  | "estimate"
  | "faq"
  | "contact";

export interface PageMeta {
  label: string;
  title: string;
  description: string;
}

export function getPageSeoTitle(meta: PageMeta): string {
  return meta.title.replace(/\n/g, " ");
}

export const PAGE_META: Record<PageHeroVariant, PageMeta> = {
  services: {
    label: "SERVICE",
    title: "필요한 기능만 담아\n비즈니스에 맞는 홈페이지를 제작합니다.",
    description: "기업, 병원, 학원, 카페, 쇼핑몰 등 업종별 맞춤 홈페이지를 제작합니다.",
  },
  portfolio: {
    label: "PORTFOLIO",
    title: "실제 제작 사례로\n완성도를 확인하세요.",
    description: "업종별 다양한 홈페이지 제작 사례를 확인하실 수 있습니다.",
  },
  pricing: {
    label: "PRICING",
    title: "예산에 맞는\n홈페이지 제작 플랜",
    description: "필요한 기능만 선택하여 합리적인 비용으로 제작합니다.",
  },
  process: {
    label: "PROCESS",
    title: "상담부터 오픈까지\n체계적으로 진행합니다.",
    description: "기획, 디자인, 개발, 검수까지 전 과정을 함께합니다.",
  },
  estimate: {
    label: "ESTIMATE",
    title: "몇 가지 정보만 입력하면\n빠르게 상담드립니다.",
    description: "업종과 필요한 기능을 알려주시면 맞춤 견적을 안내드립니다.",
  },
  faq: {
    label: "FAQ",
    title: "궁금한 내용을\n빠르게 확인하세요.",
    description: "제작 기간, 비용, 유지보수 등 자주 문의하시는 내용을 정리했습니다.",
  },
  contact: {
    label: "CONTACT",
    title: "프로젝트를\n시작해보세요.",
    description: "홈페이지 제작 상담은 언제든지 문의해 주세요.",
  },
};
