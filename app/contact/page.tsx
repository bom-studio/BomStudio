import { PageHero } from "@/components/layout/PageHero";
import { ContactContent } from "@/components/sections/ContactContent";
import { PAGE_META } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  PAGE_META.contact.label,
  PAGE_META.contact.description
);

export default function ContactPage() {
  const meta = PAGE_META.contact;

  return (
    <>
      <PageHero
        label={meta.label}
        title={meta.title}
        description={meta.description}
      />
      <ContactContent showHeader={false} />
    </>
  );
}
