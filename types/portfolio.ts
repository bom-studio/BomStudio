export type PortfolioCategory = "Education" | "Corporate" | "SaaS";

export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  siteUrl: string;
  githubUrl: string;
  tech: string[];
  category: PortfolioCategory;
  features: string[];
  duration: string;
  previewImage?: string;
  previewImageAlt: string;
  featured?: boolean;
}

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  Education: "Education",
  Corporate: "Corporate",
  SaaS: "SaaS",
};

export const PORTFOLIO_CATEGORY_BADGE: Record<PortfolioCategory, string> = {
  Education: "bg-section text-muted-foreground",
  Corporate: "bg-section text-muted-foreground",
  SaaS: "bg-section text-muted-foreground",
};
