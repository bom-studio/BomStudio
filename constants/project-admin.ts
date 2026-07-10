export const PROJECT_STATUSES = [
  "대기중",
  "기획",
  "디자인",
  "개발",
  "검수",
  "배포",
  "완료",
  "보류",
  "취소",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_OPTIONS = PROJECT_STATUSES;

export const PROJECT_STATUS_PROGRESS: Record<ProjectStatus, number> = {
  대기중: 0,
  기획: 10,
  디자인: 30,
  개발: 60,
  검수: 80,
  배포: 95,
  완료: 100,
  보류: 0,
  취소: 0,
};

export const ACTIVITY_LOG_TYPES = ["작업", "완료", "메모", "상태변경"] as const;

export type ActivityLogType = (typeof ACTIVITY_LOG_TYPES)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return PROJECT_STATUSES.includes(value as ProjectStatus);
}

export function getRecommendedProgress(status: ProjectStatus): number {
  return PROJECT_STATUS_PROGRESS[status];
}
