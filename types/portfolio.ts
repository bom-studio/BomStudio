export type PortfolioCategory = "Education" | "Corporate" | "SaaS" | "Healthcare";

export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  siteUrl: string;
  githubUrl?: string;
  tech: string[];
  category: PortfolioCategory;
  features: string[];
  duration: string;
  previewImage?: string;
  previewImageAlt: string;
  featured?: boolean;
  status?: string;
}

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  Education: "Education",
  Corporate: "Corporate",
  SaaS: "SaaS",
  Healthcare: "Long-term Care Hospital",
};

export function getPortfolioCategoryLabel(category: PortfolioCategory): string {
  return PORTFOLIO_CATEGORY_LABELS[category];
}

export const PORTFOLIO_CATEGORY_BADGE: Record<PortfolioCategory, string> = {
  Education: "bg-section text-muted-foreground",
  Corporate: "bg-section text-muted-foreground",
  SaaS: "bg-section text-muted-foreground",
  Healthcare: "bg-primary/10 text-primary",
};
