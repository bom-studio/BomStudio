export interface PageMeta {
  label: string;
  title: string;
  description: string;
}

export const PAGE_META: Record<string, PageMeta> = {
  services: {
    label: "서비스",
    title: "필요한 기능만 담아 실용적인 홈페이지를 만듭니다.",
    description: "업종과 목적에 맞는 웹사이트 제작 서비스를 제공합니다.",
  },
  portfolio: {
    label: "Portfolio",
    title: "직접 제작한 웹사이트",
    description: "기획부터 배포까지 완료한 실제 운영 프로젝트입니다.",
  },
  pricing: {
    label: "제작비용",
    title: "예산에 맞는 제작 플랜",
    description: "초기 포트폴리오 제작가로 합리적인 범위에서 상담해 드립니다.",
  },
  process: {
    label: "Process",
    title: "체계적인 6단계 제작 프로세스",
    description: "상담부터 배포까지 투명하고 명확한 과정으로 프로젝트를 진행합니다.",
  },
  estimate: {
    label: "견적문의",
    title: "온라인 견적 문의",
    description: "간단한 정보를 입력하시면 맞춤 견적을 안내해 드립니다.",
  },
  faq: {
    label: "자주 묻는 질문",
    title: "궁금한 점을 빠르게 확인하세요",
    description: "제작 기간, 비용, 유지보수 등 자주 묻는 질문을 정리했습니다.",
  },
  contact: {
    label: "문의하기",
    title: "홈페이지가 필요하다면 편하게 문의해주세요",
    description: "아직 구체적인 기획이 없어도 괜찮습니다. 원하는 분위기, 참고 사이트, 필요한 기능을 함께 정리해드립니다.",
  },
};
