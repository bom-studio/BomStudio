import { PageHero } from "@/components/layout/PageHero";
import { FAQContent } from "@/components/sections/FAQContent";
import { PAGE_META } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  PAGE_META.faq.label,
  PAGE_META.faq.description
);

export default function FAQPage() {
  const meta = PAGE_META.faq;

  return (
    <>
      <PageHero
        label={meta.label}
        title={meta.title}
        description={meta.description}
      />
      <FAQContent showHeader={false} />
    </>
  );
}
