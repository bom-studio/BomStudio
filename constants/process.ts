import type { ProcessStep } from "@/types";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "상담",
    description: "프로젝트 목표, 예산, 일정을 함께 논의합니다",
  },
  {
    step: 2,
    title: "기획",
    description: "필요한 페이지와 기능을 구체적으로 정리합니다",
  },
  {
    step: 3,
    title: "디자인",
    description: "브랜드에 맞는 UI/UX를 설계합니다",
  },
  {
    step: 4,
    title: "개발",
    description: "최신 기술 스택으로 안정적으로 구현합니다",
  },
  {
    step: 5,
    title: "검수",
    description: "기능과 디자인을 꼼꼼히 확인하고 수정합니다",
  },
  {
    step: 6,
    title: "배포",
    description: "실서버 배포 후 운영 가이드를 제공합니다",
  },
];
