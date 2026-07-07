"use client";

import { motion } from "framer-motion";
import { PortfolioBrowserPreview } from "@/components/portfolio/PortfolioBrowserPreview";
import { ProjectInfo } from "@/components/portfolio/ProjectInfo";
import type { PortfolioProject } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioSectionProps {
  project: PortfolioProject;
  index: number;
}

export function PortfolioSection({ project, index }: PortfolioSectionProps) {
  return (
    <section
      className={cn(
        "py-28 sm:py-32 lg:py-36",
        index % 2 === 1 && "section-alt"
      )}
      aria-labelledby={`project-${project.slug}`}
    >
      <div className="container-max relative px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div id={`project-${project.slug}`}>
              <ProjectInfo project={project} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <PortfolioBrowserPreview
              previewImage={project.previewImage}
              siteUrl={project.siteUrl}
              title={project.title}
              priority={index === 0}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
