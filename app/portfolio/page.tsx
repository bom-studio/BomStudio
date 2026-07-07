import type { Metadata } from "next";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioShowcase } from "@/components/portfolio/PortfolioShowcase";
import { siteConfig } from "@/lib/metadata";
import { getAllPortfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: { absolute: "Portfolio | BOM STUDIO" },
  description:
    "BOM STUDIO에서 직접 제작한 반응형 홈페이지와 SaaS 프로젝트 포트폴리오입니다.",
  openGraph: {
    title: "Portfolio | BOM STUDIO",
    description:
      "BOM STUDIO에서 직접 제작한 반응형 홈페이지와 SaaS 프로젝트 포트폴리오입니다.",
    url: `${siteConfig.url}/portfolio`,
    siteName: siteConfig.nameEn,
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | BOM STUDIO",
    description:
      "BOM STUDIO에서 직접 제작한 반응형 홈페이지와 SaaS 프로젝트 포트폴리오입니다.",
  },
};

export default function PortfolioPage() {
  const projects = getAllPortfolio();

  return (
    <>
      <PortfolioHero />
      <PortfolioShowcase projects={projects} />
      <PortfolioCTA />
    </>
  );
}
