"use client";

import {
  Building2,
  Calendar,
  Check,
  Code2,
  Coffee,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Rocket,
  ShoppingBag,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { ServicePreviewImage } from "@/components/services/ServicePreviewImage";
import { SERVICE_TYPES } from "@/constants/services-page";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Hospital: Stethoscope,
  GraduationCap,
  Coffee,
  ShoppingBag,
  Rocket,
  Calendar,
  LayoutDashboard,
  Code2,
};

export function ServiceCatalog() {
  return (
    <AnimatedSection className="section-padding">
      <div className="container-max px-8">
        <SectionHeader
          label="Services"
          title="어떤 홈페이지를 제작할 수 있나요?"
        />

        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {SERVICE_TYPES.map((service, index) => {
            const Icon = ICON_MAP[service.icon] ?? Building2;

            return (
              <StaggerItem key={service.id} className="h-full">
                <article
                  className={cn(
                    "group flex h-full min-h-[520px] flex-col overflow-hidden rounded-[20px] border border-border bg-card",
                    "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  )}
                >
                  <ServicePreviewImage
                    src={service.previewImage}
                    alt={service.previewLabel}
                    label={service.previewLabel}
                    icon={Icon}
                    priority={index < 3}
                  />

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold">{service.title}</h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <p className="mt-4 text-xs font-medium text-primary">
                      추천 · {service.industries.slice(0, 4).join(" · ")}
                    </p>

                    <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-1.5 text-sm text-foreground/80"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {service.href ? (
                      <div className="mt-auto pt-6">
                        <Button asChild className="w-full sm:w-auto">
                          <a
                            href={service.href}
                            target={service.external ? "_blank" : undefined}
                            rel={service.external ? "noopener noreferrer" : undefined}
                            aria-label={`${service.title} 사이트 보기`}
                          >
                            사이트 보기
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
