export const CONTRACT_STATUSES = [
  "작성중",
  "계약완료",
  "진행중",
  "종료",
  "취소",
] as const;

export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const CONTRACT_TYPES = ["신규제작", "유지보수", "추가개발"] as const;

export type ContractType = (typeof CONTRACT_TYPES)[number];

export const BILLING_CYCLES = ["없음", "월", "분기", "반기", "연"] as const;

export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const PAYMENT_STATUSES = ["미납", "입금완료"] as const;

export const SIGNATURE_STATUSES = ["미서명", "서명완료"] as const;

export function isContractStatus(value: string): value is ContractStatus {
  return CONTRACT_STATUSES.includes(value as ContractStatus);
}

export const DEFAULT_CONTRACT_TERMS = `- 계약금은 계약 체결 시 총 금액의 50%를 입금한다.
- 잔금은 홈페이지 제작 완료 및 배포 전 또는 배포 완료 시 입금한다.
- 제작 범위는 견적서에 명시된 항목을 기준으로 한다.
- 추가 기능 또는 범위 변경이 발생할 경우 별도 견적이 발생할 수 있다.
- 자료 전달 지연 또는 고객 확인 지연 시 일정이 변경될 수 있다.
- 도메인, 호스팅, 외부 유료 플러그인 비용은 별도 부담을 원칙으로 한다.`;
