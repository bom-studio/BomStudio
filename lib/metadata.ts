import type { Metadata } from "next";
import { BRAND } from "@/constants/brand";

const siteUrl = "https://bomstudio.kr";

export const siteConfig = {
  name: BRAND.nameKo,
  nameEn: BRAND.name,
  slogan: BRAND.slogan,
  description:
    "작은 브랜드와 1인 사업자를 위한 홈페이지, 랜딩페이지, 웹서비스를 기획하고 제작합니다.",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.png`,
  keywords: [
    "웹사이트 제작",
    "홈페이지 제작",
    "반응형 웹",
    "봄스튜디오",
    "Bom Studio",
    "웹 에이전시",
    "Next.js",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: `${BRAND.name} | ${BRAND.slogan}`,
    template: `%s | ${BRAND.name}`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,

  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,

  verification: {
    google: "fBxinue1wpSpGf2uqU5tJAXUNaRCEM0EqJ0-yhCvYN8",
    other: {
      "naver-site-verification":
        "0a4f048cbd044e7ad7ab11f1a51962149de1d60b",
    },
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.nameEn}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.nameEn}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export function createPageMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  alternateName: siteConfig.nameEn,
  description: siteConfig.description,
  url: siteConfig.url,

  areaServed: "KR",
  availableLanguage: ["ko"],

  priceRange: "$$",

  serviceType: [
    "홈페이지 제작",
    "기업 홈페이지 제작",
    "반응형 홈페이지 제작",
    "랜딩페이지 제작",
    "웹사이트 제작",
    "쇼핑몰 제작",
    "관리자 시스템 개발",
    "예약 시스템 개발",
    "맞춤형 웹 개발",
    "웹 애플리케이션 개발",
    "CRM 개발",
    "문의 시스템 구축",
    "Supabase 개발",
    "Next.js 개발",
    "UI/UX 디자인",
    "웹 유지보수",
    "SEO 최적화",
    "웹 퍼블리싱",
  ],

  sameAs: [
    "https://github.com/bom-studio",
    "https://bomstudio.kr",
  ],
};