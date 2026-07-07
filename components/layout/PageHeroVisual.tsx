import type { PageHeroVariant } from "@/constants/page-meta";
import { ContactHeroVisual } from "@/components/layout/hero-visuals/ContactHeroVisual";
import { EstimateHeroVisual } from "@/components/layout/hero-visuals/EstimateHeroVisual";
import { FaqHeroVisual } from "@/components/layout/hero-visuals/FaqHeroVisual";
import { PortfolioHeroVisual } from "@/components/layout/hero-visuals/PortfolioHeroVisual";
import { PricingHeroVisual } from "@/components/layout/hero-visuals/PricingHeroVisual";
import { ProcessHeroVisual } from "@/components/layout/hero-visuals/ProcessHeroVisual";
import { ServicesHeroVisual } from "@/components/layout/hero-visuals/ServicesHeroVisual";

const VISUALS: Record<PageHeroVariant, React.ComponentType> = {
  services: ServicesHeroVisual,
  portfolio: PortfolioHeroVisual,
  pricing: PricingHeroVisual,
  process: ProcessHeroVisual,
  estimate: EstimateHeroVisual,
  faq: FaqHeroVisual,
  contact: ContactHeroVisual,
};

interface PageHeroVisualProps {
  variant: PageHeroVariant;
}

export function PageHeroVisual({ variant }: PageHeroVisualProps) {
  const Visual = VISUALS[variant];
  return <Visual />;
}
