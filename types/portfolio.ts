export type PortfolioCategory = "Education" | "Corporate" | "SaaS";

export interface PortfolioProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  deployUrl: string;
  githubUrl: string;
  tech: string[];
  category: PortfolioCategory;
  features: string[];
  screenshot: string;
  screenshotAlt: string;
  featured?: boolean;
}

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  Education: "Education",
  Corporate: "Corporate",
  SaaS: "SaaS",
};

export const PORTFOLIO_CATEGORY_GRADIENTS: Record<PortfolioCategory, string> = {
  Education: "from-background via-background to-section",
  Corporate: "from-section via-background to-background",
  SaaS: "from-background via-section to-background",
};

export const PORTFOLIO_CATEGORY_BADGE: Record<PortfolioCategory, string> = {
  Education: "bg-section text-muted-foreground",
  Corporate: "bg-section text-muted-foreground",
  SaaS: "bg-section text-muted-foreground",
};
