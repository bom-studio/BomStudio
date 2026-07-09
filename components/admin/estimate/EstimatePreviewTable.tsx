import { formatPreviewPrice, type EstimatePreviewRow } from "@/lib/admin/estimate-draft";

interface EstimatePreviewTableProps {
  rows: EstimatePreviewRow[];
}

export function EstimatePreviewTable({ rows }: EstimatePreviewTableProps) {
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-[#F0FDFA]">
          <th className="border border-[#E5E7EB] px-2 py-2 font-semibold">NO</th>
          <th className="border border-[#E5E7EB] px-2 py-2 font-semibold">항목명</th>
          <th className="border border-[#E5E7EB] px-2 py-2 font-semibold">작업 설명</th>
          <th className="border border-[#E5E7EB] px-2 py-2 font-semibold">예상 작업기간</th>
          <th className="border border-[#E5E7EB] px-2 py-2 font-semibold">금액</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id}>
            <td className="border border-[#E5E7EB] px-2 py-2 text-center">{index + 1}</td>
            <td className="border border-[#E5E7EB] px-2 py-2">{row.title}</td>
            <td className="border border-[#E5E7EB] px-2 py-2">{row.description}</td>
            <td className="border border-[#E5E7EB] px-2 py-2 text-center">{row.duration}</td>
            <td className="border border-[#E5E7EB] px-2 py-2 text-right">
              {formatPreviewPrice(row.price)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
