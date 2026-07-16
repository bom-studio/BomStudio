import type { Metadata } from "next";
import { BRAND, SEO_KEYWORDS } from "@/constants/brand";

const siteUrl = "https://bomstudio.kr";

const seoTitle = `${BRAND.seoServiceName} | ${BRAND.name}`;
const metaDescription =
  "김포 홈페이지 제작 전문 봄스튜디오. 기업 홈페이지, 랜딩페이지, 관리자 시스템 제작. 김포·일산 방문상담 가능, 전국 비대면 제작.";
const ogDescription =
  "김포 홈페이지 제작 전문. 기업 홈페이지, 랜딩페이지 제작. 김포·일산 방문상담 가능, 전국 비대면 제작.";

export const siteConfig = {
  name: BRAND.nameKo,
  nameEn: BRAND.name,
  seoServiceName: BRAND.seoServiceName,
  slogan: BRAND.slogan,
  description: metaDescription,
  ogDescription,
  url: siteUrl,
  ogImage: "/og-image.jpg",
  keywords: [...SEO_KEYWORDS],
};

const ogImages: NonNullable<Metadata["openGraph"]>["images"] = [
  {
    url: siteConfig.ogImage,
    width: 1200,
    height: 630,
    alt: `${BRAND.seoServiceName} | ${BRAND.name}`,
    type: "image/jpeg",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: seoTitle,
    template: `%s | ${BRAND.name}`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,

  authors: [{ name: siteConfig.nameEn }],
  creator: siteConfig.nameEn,
  publisher: siteConfig.nameEn,

  verification: {
    google: "0FNk6GsEuO41wRm-t7AgKMX-mhGBztTWF7xOdbbqL_U",
    other: {
      "naver-site-verification":
        "0a4f048cbd044e7ad7ab11f1a51962149de1d60b",
    },
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: seoTitle,
    description: siteConfig.ogDescription,
    siteName: siteConfig.nameEn,
    images: ogImages,
  },

  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: siteConfig.ogDescription,
    images: [siteConfig.ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export function createPageMetadata(
  title: string,
  description: string
): Metadata {
  const pageTitle = `${title} | ${BRAND.name}`;

  return {
    title,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: siteConfig.url,
      siteName: siteConfig.nameEn,
      locale: "ko_KR",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

const areaServed = [
  { "@type": "City", name: "김포시" },
  { "@type": "City", name: "고양시" },
  { "@type": "City", name: "인천광역시" },
  { "@type": "Country", name: "대한민국" },
];

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: BRAND.name,
      alternateName: [BRAND.nameKo, BRAND.seoServiceName],
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "ko-KR",
    },
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${siteConfig.url}/#organization`,
      name: BRAND.name,
      alternateName: [BRAND.nameKo, BRAND.seoServiceName],
      description: siteConfig.description,
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      telephone: "010-6780-5934",
      email: "bomstudio22@gmail.com",
      priceRange: "$$",
      areaServed,
      availableLanguage: ["ko"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "김포시",
        addressRegion: "경기도",
        addressCountry: "KR",
      },
      sameAs: ["https://github.com/bom-studio", "https://bomstudio.kr"],
    },
    {
      "@type": "Service",
      "@id": `${siteConfig.url}/#service`,
      name: "홈페이지 제작",
      serviceType: [
        "홈페이지 제작",
        "랜딩페이지 제작",
        "기업 홈페이지 제작",
        "웹개발",
      ],
      description: siteConfig.ogDescription,
      provider: { "@id": `${siteConfig.url}/#organization` },
      areaServed,
      url: siteConfig.url,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "KRW",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "홈페이지 제작 서비스",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "홈페이지 제작" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "랜딩페이지 제작" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "기업 홈페이지 제작" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "웹개발" } },
        ],
      },
    },
  ],
};
