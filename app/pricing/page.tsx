import { PageHeroSection } from "@/components/layout/PageHeroSection";
import { PricingContent } from "@/components/sections/PricingContent";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  getPageSeoTitle(PAGE_META.pricing),
  PAGE_META.pricing.description
);

export default function PricingPage() {
  return (
    <>
      <PageHeroSection variant="pricing" />
      <PricingContent showHeader={false} showExtraCosts />
    </>
  );
}
