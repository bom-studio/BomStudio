import { PORTFOLIO_PROJECTS } from "@/data/portfolio";
import type { PortfolioProject } from "@/types/portfolio";

export function getAllPortfolio(): PortfolioProject[] {
  return PORTFOLIO_PROJECTS;
}

export function getFeaturedPortfolio(limit = 3): PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter((p) => p.featured).slice(0, limit);
}

export function getPortfolioBySlug(slug: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
}

export function getAllPortfolioSlugs(): string[] {
  return PORTFOLIO_PROJECTS.map((p) => p.slug);
}
