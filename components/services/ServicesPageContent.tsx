import { AvailableFeatures } from "@/components/services/AvailableFeatures";
import { ServiceCatalog } from "@/components/services/ServiceCatalog";
import { ServicesCTA } from "@/components/services/ServicesCTA";
import { PageHeroSection } from "@/components/layout/PageHeroSection";

export function ServicesPageContent() {
  return (
    <>
      <PageHeroSection variant="services" />
      <ServiceCatalog />
      <AvailableFeatures />
      <ServicesCTA />
    </>
  );
}
