export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  eventLabel?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactItem {
  type: string;
  value: string;
  href?: string;
  icon: string;
}

export interface EstimateFormData {
  company: string;
  contact: string;
  phone: string;
  email: string;
  businessType: string;
  budget: string;
  schedule: string;
  pages: string[];
  features: string[];
  reference: string;
  notes: string;
}
