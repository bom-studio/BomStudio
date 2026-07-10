import type { ProjectStatus } from "@/constants/project-admin";
import { getRecommendedProgress } from "@/constants/project-admin";
import { buildProjectTitle } from "@/lib/admin/project-title";
import type { ProjectFormState } from "@/types/admin-project";
import type { SavedContract } from "@/types/admin-contract";
import type { SavedProject } from "@/types/admin-project";

export function generateProjectNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 0xfff)
    .toString(16)
    .toUpperCase()
    .padStart(3, "0")
    .slice(-3);
  return `PRJ-${y}${m}${d}-${random}`;
}

export function buildProjectFormFromContract(contract: SavedContract): ProjectFormState {
  const contractType = contract.contract_type || "신규제작";

  return {
    projectNumber: generateProjectNumber(),
    projectTitle: buildProjectTitle(contract.company, contractType),
    contractType,
    customerName: contract.customer_name || "",
    company: contract.company || "",
    phone: contract.phone || "",
    email: contract.email || "",
    startDate: contract.start_date || "",
    dueDate: contract.end_date || "",
    status: "대기중",
    progress: String(getRecommendedProgress("대기중")),
    domain: "",
    hosting: "",
    githubRepo: "",
    figmaUrl: "",
    deploymentUrl: "",
    memo: contract.memo || "",
    inquiryId: contract.inquiry_id || "",
    estimateId: contract.estimate_id || "",
    contractId: contract.id,
  };
}

export function buildProjectFormFromSaved(
  project: SavedProject,
  contractType?: string
): ProjectFormState {
  const resolvedContractType = contractType || "신규제작";

  return {
    projectNumber: project.project_number,
    projectTitle: buildProjectTitle(project.company, resolvedContractType),
    contractType: resolvedContractType,
    customerName: project.customer_name,
    company: project.company || "",
    phone: project.phone || "",
    email: project.email || "",
    startDate: project.start_date || "",
    dueDate: project.due_date || "",
    status: (project.status as ProjectStatus) || "대기중",
    progress: String(project.progress ?? 0),
    domain: project.domain || "",
    hosting: project.hosting || "",
    githubRepo: project.github_repo || "",
    figmaUrl: project.figma_url || "",
    deploymentUrl: project.deployment_url || "",
    memo: project.memo || "",
    inquiryId: project.inquiry_id || "",
    estimateId: project.estimate_id || "",
    contractId: project.contract_id || "",
  };
}

export function createEmptyProjectForm(): ProjectFormState {
  return {
    projectNumber: generateProjectNumber(),
    projectTitle: "",
    contractType: "신규제작",
    customerName: "",
    company: "",
    phone: "",
    email: "",
    startDate: "",
    dueDate: "",
    status: "대기중",
    progress: "0",
    domain: "",
    hosting: "",
    githubRepo: "",
    figmaUrl: "",
    deploymentUrl: "",
    memo: "",
    inquiryId: "",
    estimateId: "",
    contractId: "",
  };
}

export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
