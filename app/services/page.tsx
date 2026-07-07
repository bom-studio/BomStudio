import { ServicesPageContent } from "@/components/services/ServicesPageContent";
import { PAGE_META, getPageSeoTitle } from "@/constants/page-meta";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  getPageSeoTitle(PAGE_META.services),
  PAGE_META.services.description
);

export default function ServicesPage() {
  return <ServicesPageContent />;
}
