import type { EstimateInquiry } from "@/types/inquiry";

type InquiryNumberSource = Pick<EstimateInquiry, "inquiry_number" | "created_at" | "id">;

export function getInquiryDisplayNumber(inquiry: InquiryNumberSource): string {
  if (inquiry.inquiry_number) {
    return inquiry.inquiry_number;
  }

  const date = new Date(inquiry.created_at);
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  return `EST-${datePart}-${inquiry.id.slice(0, 3).toUpperCase()}`;
}
