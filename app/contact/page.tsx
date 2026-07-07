import { PageHeroSection } from "@/components/layout/PageHeroSection";
import { ContactContent } from "@/components/sections/ContactContent";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  getPageSeoTitle(PAGE_META.contact),
  PAGE_META.contact.description
);

export default function ContactPage() {
  return (
    <>
      <PageHeroSection variant="contact" />
      <ContactContent showHeader={false} />
    </>
  );
}
