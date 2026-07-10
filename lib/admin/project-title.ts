/**
 * 프로젝트명 규칙: 회사명 + 계약유형 (예: 봄스튜디오신규제작)
 */
export function buildProjectTitle(
  company: string | null | undefined,
  contractType: string | null | undefined
): string {
  const companyName = company?.trim() ?? "";
  const type = contractType?.trim() ?? "";

  if (companyName && type) return `${companyName}${type}`;
  if (companyName) return companyName;
  if (type) return type;
  return "";
}
