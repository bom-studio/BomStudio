import { notFound } from "next/navigation";
import { PortfolioDetailContent } from "@/components/portfolio/PortfolioDetailContent";
import { getAllPortfolioSlugs, getPortfolioBySlug } from "@/lib/portfolio";
import { createPageMetadata, siteConfig } from "@/lib/metadata";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPortfolioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);
  if (!project) return {};

  const description = project.seoDescription ?? project.description;
  const ogImage = project.previewImage
    ? `${siteConfig.url}${project.previewImage}`
    : siteConfig.ogImage;

  return {
    ...createPageMetadata(project.title, description),
    openGraph: {
      title: `${project.title} | ${siteConfig.nameEn}`,
      description,
      url: `${siteConfig.url}/portfolio/${slug}`,
      type: "website",
      images: [{ url: ogImage, alt: project.previewImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${siteConfig.nameEn}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);

  if (!project) notFound();

  return <PortfolioDetailContent project={project} />;
}
