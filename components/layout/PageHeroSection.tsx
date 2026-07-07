import { PageHero } from "@/components/layout/PageHero";
import { PAGE_META, type PageHeroVariant } from "@/constants/page-meta";

interface PageHeroSectionProps {
  variant: PageHeroVariant;
}

export function PageHeroSection({ variant }: PageHeroSectionProps) {
  const meta = PAGE_META[variant];
  return <PageHero variant={variant} {...meta} />;
}
