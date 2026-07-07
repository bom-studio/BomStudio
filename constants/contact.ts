import type { ContactItem } from "@/types";

export const CONTACT_ITEMS: ContactItem[] = [
  {
    type: "카카오톡",
    value: "문의 시 안내",
    icon: "MessageCircle",
  },
  {
    type: "전화",
    value: "010-6780-5934",
    href: "tel:01067805934",
    icon: "Phone",
  },
  {
    type: "이메일",
    value: "bomstudio22@gmail.com",
    href: "mailto:bomstudio22@gmail.com",
    icon: "Mail",
  },
];

export const BUSINESS_HOURS = "평일 10:00 - 18:00 (주말·공휴일 휴무)";

export const PAGE_OPTIONS = [
  "메인",
  "회사소개",
  "서비스/제품",
  "포트폴리오",
  "문의",
  "블로그",
  "기타",
];

export const FEATURE_OPTIONS = [
  "반응형 디자인",
  "관리자 페이지",
  "회원가입/로그인",
  "예약 시스템",
  "결제 시스템",
  "다국어 지원",
  "SEO 최적화",
  "블로그/게시판",
  "채팅 상담",
  "기타",
];
