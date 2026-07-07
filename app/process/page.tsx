import { PageHeroSection } from "@/components/layout/PageHeroSection";
import { ProcessContent } from "@/components/sections/ProcessContent";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  getPageSeoTitle(PAGE_META.process),
  PAGE_META.process.description
);

export default function ProcessPage() {
  return (
    <>
      <PageHeroSection variant="process" />
      <ProcessContent showHeader={false} />
    </>
  );
}
