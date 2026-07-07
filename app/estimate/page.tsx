import { PageHeroSection } from "@/components/layout/PageHeroSection";
import { StepEstimateForm } from "@/components/estimate/StepEstimateForm";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  getPageSeoTitle(PAGE_META.estimate),
  PAGE_META.estimate.description
);

export default function EstimatePage() {
  return (
    <>
      <PageHeroSection variant="estimate" />
      <section className="section-padding">
        <div className="container-max">
          <StepEstimateForm />
        </div>
      </section>
    </>
  );
}
