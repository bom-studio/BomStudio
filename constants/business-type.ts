export const BUSINESS_TYPE_OPTIONS = [
  "기업",
  "병원·의료",
  "교육(학원)",
  "쇼핑몰",
  "카페·음식점",
  "뷰티·헬스",
  "건설·인테리어",
  "전문서비스(법률·세무·부동산 등)",
  "기관·단체",
  "기타",
] as const;

export type BusinessTypeOption = (typeof BUSINESS_TYPE_OPTIONS)[number];
