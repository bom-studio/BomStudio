import { PageHero } from "@/components/layout/PageHero";
import { PricingContent } from "@/components/sections/PricingContent";
import { PAGE_META } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  PAGE_META.pricing.label,
  PAGE_META.pricing.description
);

export default function PricingPage() {
  const meta = PAGE_META.pricing;

  return (
    <>
      <PageHero
        label={meta.label}
        title={meta.title}
        description={meta.description}
      />
      <PricingContent showHeader={false} showExtraCosts />
    </>
  );
}
