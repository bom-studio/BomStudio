"use client";

import {
  Calendar,
  CreditCard,
  LogIn,
  Mail,
  MapPin,
  MonitorSmartphone,
  Newspaper,
  Search,
  Share2,
  Shield,
  Upload,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatedSection,
  SectionHeader,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimatedSection";
import { SERVICE_FEATURES } from "@/constants/services-page";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Mail,
  Newspaper,
  Shield,
  Calendar,
  UserPlus,
  LogIn,
  CreditCard,
  MapPin,
  Share2,
  Search,
  MonitorSmartphone,
  Upload,
};

export function AvailableFeatures() {
  return (
    <AnimatedSection className="section-padding section-alt">
      <div className="container-max px-8">
        <SectionHeader label="Features" title="제작 가능한 핵심 기능" />

        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICE_FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.icon] ?? Mail;

            return (
              <StaggerItem key={feature.id}>
                <div className="group relative">
                  <div
                    className={cn(
                      "flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-5 text-center",
                      "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    )}
                  >
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>

                  <div
                    className={cn(
                      "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2",
                      "rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg",
                      "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    )}
                    role="tooltip"
                  >
                    {feature.description}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
