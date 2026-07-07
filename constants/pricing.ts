import type { PricingPlan } from "@/types";

export const PRICING_INTRO =
  "현재는 봄스튜디오 포트폴리오 구축 기간으로, 초기 제작가로 상담을 진행합니다.";

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "39만원",
    eventLabel: "오픈 이벤트가",
    description: "5페이지 기본 홈페이지",
    features: [
      "반응형 웹 디자인",
      "최대 5페이지",
      "기본 SEO 설정",
      "문의 폼 연동",
      "1회 무료 수정",
      "오픈 후 유지보수 상담",
    ],
  },
  {
    name: "Basic",
    price: "59만원",
    eventLabel: "오픈 이벤트가",
    description: "10페이지 기본 홈페이지",
    recommended: true,
    features: [
      "맞춤 UI/UX 디자인",
      "최대 10페이지",
      "SEO 최적화",
      "관리자 페이지",
      "2회 무료 수정",
      "오픈 후 유지보수 상담",
      "Google Analytics 연동",
    ],
  },
  {
    name: "Premium",
    price: "별도 견적",
    description: "맞춤형 웹사이트 / 관리자 / 예약 / 회원 기능",
    features: [
      "맞춤 UI/UX 디자인",
      "페이지·기능 맞춤 구성",
      "예약/결제 시스템",
      "관리자 대시보드",
      "회원가입/로그인",
      "성능 최적화",
      "유지보수 상담",
    ],
  },
];
