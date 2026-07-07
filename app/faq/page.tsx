import { PageHeroSection } from "@/components/layout/PageHeroSection";
import { FAQContent } from "@/components/sections/FAQContent";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  getPageSeoTitle(PAGE_META.faq),
  PAGE_META.faq.description
);

export default function FAQPage() {
  return (
    <>
      <PageHeroSection variant="faq" />
      <FAQContent showHeader={false} />
    </>
  );
}
