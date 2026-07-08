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

export { FEATURE_OPTIONS, PAGE_OPTIONS } from "@/constants/estimate-requirements";
