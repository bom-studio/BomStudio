import type { Metadata } from "next";
import { PageHeroSection } from "@/components/layout/PageHeroSection";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioShowcase } from "@/components/portfolio/PortfolioShowcase";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { siteConfig } from "@/lib/metadata";
import { getAllPortfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: { absolute: `${getPageSeoTitle(PAGE_META.portfolio)} | BOM STUDIO` },
  description: PAGE_META.portfolio.description,
  openGraph: {
    title: `${getPageSeoTitle(PAGE_META.portfolio)} | BOM STUDIO`,
    description: PAGE_META.portfolio.description,
    url: `${siteConfig.url}/portfolio`,
    siteName: siteConfig.nameEn,
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "BOM STUDIO",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${getPageSeoTitle(PAGE_META.portfolio)} | BOM STUDIO`,
    description: PAGE_META.portfolio.description,
    images: [siteConfig.ogImage],
  },
};

export default function PortfolioPage() {
  const projects = getAllPortfolio();

  return (
    <>
      <PageHeroSection variant="portfolio" />
      <PortfolioShowcase projects={projects} />
      <PortfolioCTA />
    </>
  );
}
