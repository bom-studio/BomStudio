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
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.nameEn}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.nameEn}`,
    description: siteConfig.description,
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
  serviceType: [
    "웹사이트 제작",
    "홈페이지 제작",
    "반응형 웹 개발",
    "쇼핑몰 제작",
    "예약 시스템 개발",
  ],
};
