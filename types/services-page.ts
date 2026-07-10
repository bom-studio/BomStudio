import type { LucideIcon } from "lucide-react";

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  features: string[];
  industries: string[];
  previewImage?: string;
  previewLabel: string;
  icon: string;
}

export interface ServiceFeature {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export type ServiceIconMap = Record<string, LucideIcon>;
