import { PageHero } from "@/components/layout/PageHero";
import { ServicesContent } from "@/components/sections/ServicesContent";
import { PAGE_META } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  PAGE_META.services.label,
  PAGE_META.services.description
);

export default function ServicesPage() {
  const meta = PAGE_META.services;

  return (
    <>
      <PageHero
        label={meta.label}
        title={meta.title}
        description={meta.description}
      />
      <ServicesContent showHeader={false} />
    </>
  );
}
