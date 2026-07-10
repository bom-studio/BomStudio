import type { EstimateDocumentView } from "@/lib/admin/estimate-document";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import { ContractAmountSummaryBar } from "@/components/admin/contract/ContractAmountSummaryBar";
import { DocumentDivider, DocumentSectionTitle } from "@/components/admin/document/DocumentPaper";
import { formatVatLabel } from "@/lib/format/money";

interface SavedEstimateDocumentProps {
  data: EstimateDocumentView;
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-gray-900">{value}</p>
    </div>
  );
}

export function SavedEstimateDocument({ data }: SavedEstimateDocumentProps) {
  return (
    <div className="px-10 py-12 text-[13px] leading-relaxed text-gray-900 sm:px-14 sm:py-14">
      <header className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-500">
          {data.supplier.name}
        </p>
        <h1 className="mt-2 text-[26px] font-bold tracking-[0.2em] text-gray-900">견 적 서</h1>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.35em] text-gray-500">
          Quotation
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[12px] text-gray-600">
          <p>
            <span className="text-gray-500">견적번호</span>{" "}
            <span className="font-medium text-gray-900">{data.estimateNumber}</span>
          </p>
          <p>
            <span className="text-gray-500">작성일</span>{" "}
            <span className="font-medium text-gray-900">{data.issuedDate}</span>
          </p>
          <p>
            <span className="text-gray-500">유효기간</span>{" "}
            <span className="font-medium text-gray-900">{data.validUntil}</span>
          </p>
        </div>
      </header>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>수신</DocumentSectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock label="고객명" value={data.customer.name} />
          <InfoBlock label="회사명" value={data.customer.company} />
          <InfoBlock label="연락처" value={data.customer.phone} />
          <InfoBlock label="이메일" value={data.customer.email} />
        </div>
      </section>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>공급자</DocumentSectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock label="상호" value={data.supplier.name} />
          <InfoBlock label="대표" value={data.supplier.representative} />
          <InfoBlock label="전화" value={data.supplier.phone} />
          <InfoBlock label="이메일" value={data.supplier.email} />
        </div>
      </section>

      <p className="mt-6 text-[13px] text-gray-700">
        아래와 같이 홈페이지 제작 견적을 안내드립니다.
      </p>

      <section className="mt-6">
        <DocumentSectionTitle>견적 품목</DocumentSectionTitle>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-left text-gray-600">
              <th className="px-3 py-2.5 font-medium">항목명</th>
              <th className="px-3 py-2.5 font-medium">설명</th>
              <th className="px-3 py-2.5 font-medium">기간</th>
              <th className="px-3 py-2.5 text-right font-medium">금액</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="border-b border-[#F3F4F6]">
                  <td className="px-3 py-2.5 font-medium text-gray-900">{item.name}</td>
                  <td className="px-3 py-2.5 text-gray-700">{item.description}</td>
                  <td className="px-3 py-2.5 text-gray-700">{item.period}</td>
                  <td className="px-3 py-2.5 text-right text-gray-900">
                    {formatEstimateMoney(item.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                  등록된 견적 품목이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-4">
        <table className="ml-auto w-full max-w-sm border-collapse text-[13px]">
          <tbody>
            <tr className="border-b border-[#F3F4F6]">
              <td className="px-3 py-2 text-gray-600">공급가액</td>
              <td className="px-3 py-2 text-right font-medium text-gray-900">
                {formatEstimateMoney(data.amounts.subtotal)}
              </td>
            </tr>
            <tr className="border-b border-[#F3F4F6]">
              <td className="px-3 py-2 text-gray-600">부가세</td>
              <td className="px-3 py-2 text-right font-medium text-gray-900">
                {formatEstimateMoney(data.amounts.vat)}
              </td>
            </tr>
          </tbody>
        </table>
        <ContractAmountSummaryBar
          amount={data.amounts.total}
          vatType={data.amounts.vatType}
          variant="document"
        />
      </section>

      <DocumentDivider />

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <DocumentSectionTitle>결제조건</DocumentSectionTitle>
          <p className="whitespace-pre-line text-[13px] leading-7 text-gray-800">
            {data.paymentTerms}
          </p>
        </div>
        <div>
          <DocumentSectionTitle>납기</DocumentSectionTitle>
          <p className="text-[13px] leading-7 text-gray-800">{data.deliveryPeriod}</p>
        </div>
      </section>

      {data.note ? (
        <>
          <DocumentDivider />
          <section>
            <DocumentSectionTitle>비고</DocumentSectionTitle>
            <p className="whitespace-pre-line text-[13px] leading-7 text-gray-800">{data.note}</p>
          </section>
        </>
      ) : null}

      <footer className="mt-10 border-t border-[#E5E7EB] pt-4 text-[11px] leading-5 text-gray-500">
        <p>본 견적서는 유효기간 내에 한해 효력이 있으며, 범위 변경 시 별도 견적이 적용됩니다.</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold tracking-[0.2em] text-gray-700">{data.supplier.name}</span>
          <span>1 / 1</span>
        </div>
      </footer>
    </div>
  );
}
