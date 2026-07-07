import type { PortfolioProject } from "@/types/portfolio";

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: "a-one-academy",
    title: "A-One 수학학원",
    tagline: "학생과 학부모를 위한 반응형 학원 홈페이지입니다.",
    description:
      "학원 소개부터 강사진, 커리큘럼, 상담 예약까지 학부모와 학생이 필요한 정보를 한곳에서 확인할 수 있도록 구성했습니다.",
    deployUrl: "https://a-one-academy.vercel.app",
    githubUrl: "https://github.com/bom-studio/AOne_Academy",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI", "Vercel"],
    category: "Education",
    features: [
      "반응형 홈페이지",
      "상담예약",
      "강사진 소개",
      "커리큘럼",
      "SEO 최적화",
    ],
    screenshot: "/images/portfolio/aone-home.webp",
    screenshotAlt: "A-One 수학학원 홈페이지 전체 화면",
    featured: true,
  },
  {
    slug: "mukhyang-print",
    title: "묵향인쇄",
    tagline: "기업 및 인쇄소 소개 홈페이지입니다.",
    description:
      "회사 소개, 제품 안내, 상담 문의, 공지사항을 포함한 기업 홈페이지로 브랜드 신뢰감을 전달합니다.",
    deployUrl: "https://mukhyang-print.vercel.app",
    githubUrl: "https://github.com/huhbomi/mukhyang-print",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Shadcn UI",
      "Vercel",
    ],
    category: "Corporate",
    features: [
      "회사소개",
      "제품소개",
      "상담문의",
      "공지사항",
      "관리자 기능",
    ],
    screenshot: "/images/portfolio/mukhyang-home.webp",
    screenshotAlt: "묵향인쇄 홈페이지 전체 화면",
    featured: true,
  },
  {
    slug: "sajangman",
    title: "사장만",
    tagline: "소상공인을 위한 무료 계산기 및 문서 생성 플랫폼입니다.",
    description:
      "복잡한 계산과 문서 작성을 웹에서 간편하게 처리할 수 있는 SaaS 구조로 설계했습니다.",
    deployUrl: "https://sajangman.vercel.app",
    githubUrl: "https://github.com/bom-studio/sajangman",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Shadcn UI",
      "Vercel",
    ],
    category: "SaaS",
    features: [
      "계산기",
      "문서 생성",
      "SEO 최적화",
      "반응형",
      "SaaS 구조",
    ],
    screenshot: "/images/portfolio/sajangman-home.webp",
    screenshotAlt: "사장만 웹서비스 전체 화면",
    featured: true,
  },
];

export const PORTFOLIO_STATS = {
  projectCount: "3+",
  deployedSites: "3",
  techStack: ["Next.js", "Supabase", "TypeScript", "Tailwind"],
} as const;
