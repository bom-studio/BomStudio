import { PageHero } from "@/components/layout/PageHero";
import { StepEstimateForm } from "@/components/estimate/StepEstimateForm";
import { PAGE_META } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  PAGE_META.estimate.label,
  PAGE_META.estimate.description
);

export default function EstimatePage() {
  const meta = PAGE_META.estimate;

  return (
    <>
      <PageHero
        label={meta.label}
        title={meta.title}
        description={meta.description}
      />
      <section className="section-padding">
        <div className="container-max">
          <StepEstimateForm />
        </div>
      </section>
    </>
  );
}
