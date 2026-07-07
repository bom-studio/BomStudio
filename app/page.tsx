import { Hero } from "@/components/sections/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { ServicesContent } from "@/components/sections/ServicesContent";
import { PortfolioContent } from "@/components/sections/PortfolioContent";
import { ProcessContent } from "@/components/sections/ProcessContent";
import { EstimateCTA } from "@/components/sections/EstimateCTA";
import { getFeaturedPortfolio } from "@/lib/portfolio";

export default function HomePage() {
  const featuredProjects = getFeaturedPortfolio(3);

  return (
    <>
      <Hero />
      <TrustSection />
      <ServicesContent limit={6} showHeader showViewAll />
      <PortfolioContent projects={featuredProjects} />
      <ProcessContent compact showHeader showViewAll />
      <EstimateCTA />
    </>
  );
}
