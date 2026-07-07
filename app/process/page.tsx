import { PageHero } from "@/components/layout/PageHero";
import { ProcessContent } from "@/components/sections/ProcessContent";
import { PAGE_META } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  PAGE_META.process.label,
  PAGE_META.process.description
);

export default function ProcessPage() {
  const meta = PAGE_META.process;

  return (
    <>
      <PageHero
        label={meta.label}
        title={meta.title}
        description={meta.description}
      />
      <ProcessContent showHeader={false} />
    </>
  );
}
