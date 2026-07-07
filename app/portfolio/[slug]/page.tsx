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

  return {
    ...createPageMetadata(project.title, project.description),
    openGraph: {
      title: `${project.title} | ${siteConfig.nameEn}`,
      description: project.description,
      url: `${siteConfig.url}/portfolio/${slug}`,
      type: "website",
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);

  if (!project) notFound();

  return <PortfolioDetailContent project={project} />;
}
