import type { ContractDocumentView } from "@/lib/admin/contract-document";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import { ContractAmountSummaryBar } from "@/components/admin/contract/ContractAmountSummaryBar";
import { DocumentDivider, DocumentSectionTitle } from "@/components/admin/document/DocumentPaper";

interface ContractDocumentProps {
  data: ContractDocumentView;
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-gray-900">{value}</p>
    </div>
  );
}

export function ContractDocument({ data }: ContractDocumentProps) {
  return (
    <div className="px-10 py-12 text-[13px] leading-relaxed text-gray-900 sm:px-14 sm:py-14">
      <header className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-500">
          {data.supplier.name}
        </p>
        <h1 className="mt-2 text-[26px] font-bold tracking-[0.12em] text-gray-900">
          홈페이지 제작 계약서
        </h1>
        <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[12px] text-gray-600">
          <p>
            <span className="text-gray-500">계약번호</span>{" "}
            <span className="font-medium text-gray-900">{data.contractNumber}</span>
          </p>
          <p>
            <span className="text-gray-500">작성일</span>{" "}
            <span className="font-medium text-gray-900">{data.issuedDate}</span>
          </p>
        </div>
      </header>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>공급자</DocumentSectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock label="상호" value={data.supplier.nameKo} />
          <InfoBlock label="대표" value={data.supplier.representative} />
          <InfoBlock label="전화" value={data.supplier.phone} />
          <InfoBlock label="이메일" value={data.supplier.email} />
        </div>
      </section>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>고객</DocumentSectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock label="회사명" value={data.customer.company} />
          <InfoBlock label="담당자" value={data.customer.name} />
          <InfoBlock label="전화" value={data.customer.phone} />
          <InfoBlock label="이메일" value={data.customer.email} />
        </div>
      </section>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>프로젝트 정보</DocumentSectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoBlock label="프로젝트명" value={data.project.title} />
          <InfoBlock label="제작기간" value={data.project.period} />
          <InfoBlock label="계약유형" value={data.project.contractType} />
        </div>
      </section>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>계약금액</DocumentSectionTitle>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-left text-gray-600">
              <th className="px-3 py-2.5 font-medium">항목</th>
              <th className="px-3 py-2.5 text-right font-medium">금액</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#F3F4F6]">
              <td className="px-3 py-2.5 font-medium text-gray-900">총 계약금액</td>
              <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                {formatEstimateMoney(data.amounts.total)}
              </td>
            </tr>
            <tr className="border-b border-[#F3F4F6]">
              <td className="px-3 py-2.5 text-gray-700">계약금</td>
              <td className="px-3 py-2.5 text-right text-gray-900">
                {formatEstimateMoney(data.amounts.downPayment)}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2.5 text-gray-700">잔금</td>
              <td className="px-3 py-2.5 text-right text-gray-900">
                {formatEstimateMoney(data.amounts.balance)}
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

      <section>
        <DocumentSectionTitle>계약 내용</DocumentSectionTitle>
        {data.terms.length > 0 ? (
          <ol className="list-decimal space-y-2.5 pl-5 text-[13px] leading-7 text-gray-800">
            {data.terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ol>
        ) : (
          <p className="text-[13px] text-gray-500">등록된 계약 내용이 없습니다.</p>
        )}
      </section>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>특약사항</DocumentSectionTitle>
        <p className="whitespace-pre-line text-[13px] leading-7 text-gray-800">
          {data.specialTerms || "해당 없음"}
        </p>
      </section>

      <DocumentDivider />

      <section>
        <DocumentSectionTitle>서명</DocumentSectionTitle>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-6">
            <p className="text-[13px] font-medium text-gray-700">공급자</p>
            <div className="flex h-24 items-end border-b border-gray-300 pb-2">
              <span className="text-[12px] text-gray-400">(직인)</span>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[13px] font-medium text-gray-700">고객</p>
            <div className="flex h-24 items-end border-b border-gray-300 pb-2">
              <span className="text-[12px] text-gray-400">(서명)</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 flex items-center justify-between border-t border-[#E5E7EB] pt-4 text-[11px] text-gray-500">
        <span className="font-semibold tracking-[0.2em] text-gray-700">{data.supplier.name}</span>
        <span>1 / 1</span>
      </footer>
    </div>
  );
}
