import type { ProjectStatus } from "@/constants/project-admin";

export interface CreateProjectInput {
  inquiryId?: string;
  estimateId?: string;
  contractId?: string;
  projectNumber: string;
  projectTitle?: string;
  contractType?: string;
  customerName: string;
  company?: string;
  phone?: string;
  email?: string;
  startDate?: string;
  dueDate?: string;
  status: ProjectStatus;
  progress: number;
  domain?: string;
  hosting?: string;
  githubRepo?: string;
  figmaUrl?: string;
  deploymentUrl?: string;
  memo?: string;
}

export interface SavedProject {
  id: string;
  inquiry_id: string | null;
  estimate_id: string | null;
  contract_id: string | null;
  project_number: string;
  project_title: string | null;
  customer_name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  status: ProjectStatus | string | null;
  progress: number;
  memo: string | null;
  domain: string | null;
  hosting: string | null;
  github_repo: string | null;
  figma_url: string | null;
  deployment_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  project_id: string | null;
  contract_id: string | null;
  inquiry_id: string | null;
  estimate_id: string | null;
  payment_id: string | null;
  type: string;
  content: string;
  created_at: string;
}

export type ProjectMutationResult =
  | { success: true; projectId?: string }
  | { success: false; error: string };

export interface ProjectFormState {
  projectNumber: string;
  projectTitle: string;
  contractType: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  startDate: string;
  dueDate: string;
  status: ProjectStatus;
  progress: string;
  domain: string;
  hosting: string;
  githubRepo: string;
  figmaUrl: string;
  deploymentUrl: string;
  memo: string;
  inquiryId: string;
  estimateId: string;
  contractId: string;
}
