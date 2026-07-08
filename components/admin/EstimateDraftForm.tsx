"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, FileDown, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { saveEstimate } from "@/app/actions/estimates";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getInquiryDisplayNumber } from "@/lib/admin/inquiry-number";
import { formatInquiryDate, parseReferenceUrls } from "@/lib/admin/inquiry-utils";
import type { EstimateInquiry } from "@/types/inquiry";

interface EstimateDraftFormProps {
  inquiry: EstimateInquiry;
}

interface EstimateItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  amount: string;
  note: string;
}

interface ExtraConditions {
  domainSeparate: boolean;
  hostingSeparate: boolean;
  maintenanceSeparate: boolean;
  vatIncluded: boolean;
  vatSeparate: boolean;
}

const DEFAULT_PAYMENT_TERMS = `계약 시 계약금 50% 입금\n홈페이지 제작 완료 및 배포 후 잔금 50% 입금`;

function createEmptyItem(): EstimateItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    duration: "",
    amount: "",
    note: "",
  };
}

function parseMoney(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

function formatMoney(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export function EstimateDraftForm({ inquiry }: EstimateDraftFormProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isPdfPending, setIsPdfPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [estimateNumber] = useState(() => getInquiryDisplayNumber(inquiry));
  const [createdDate] = useState(() => new Date().toISOString());
  const [paymentTerms, setPaymentTerms] = useState(DEFAULT_PAYMENT_TERMS);
  const [memo, setMemo] = useState("");
  const [items, setItems] = useState<EstimateItem[]>([
    {
      ...createEmptyItem(),
      title: "홈페이지 제작",
      description: "요구사항 기반 맞춤 제작",
      duration: "2주",
      amount: "2500000",
      note: "",
    },
  ]);
  const [conditions, setConditions] = useState<ExtraConditions>({
    domainSeparate: true,
    hostingSeparate: true,
    maintenanceSeparate: true,
    vatIncluded: false,
    vatSeparate: true,
  });

  const referenceUrls = parseReferenceUrls(inquiry.reference);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + parseMoney(item.amount), 0),
    [items]
  );

  const vat = useMemo(() => {
    if (conditions.vatIncluded) return Math.round(subtotal / 11);
    if (conditions.vatSeparate) return Math.round(subtotal * 0.1);
    return 0;
  }, [conditions.vatIncluded, conditions.vatSeparate, subtotal]);

  const total = useMemo(() => {
    if (conditions.vatIncluded) return subtotal;
    if (conditions.vatSeparate) return subtotal + vat;
    return subtotal;
  }, [conditions.vatIncluded, conditions.vatSeparate, subtotal, vat]);

  const updateItem = (id: string, field: keyof EstimateItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleReset = () => {
    setPaymentTerms(DEFAULT_PAYMENT_TERMS);
    setMemo("");
    setItems([createEmptyItem()]);
    setConditions({
      domainSeparate: true,
      hostingSeparate: true,
      maintenanceSeparate: true,
      vatIncluded: false,
      vatSeparate: true,
    });
    setMessage(null);
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveEstimate({
        inquiryId: inquiry.id,
        estimateNumber,
        customerName: inquiry.name,
        company: inquiry.company ?? "",
        phone: inquiry.phone,
        email: inquiry.email ?? "",
        businessType: inquiry.business_type ?? "",
        items: items.map((item) => ({
          title: item.title,
          description: item.description,
          duration: item.duration,
          amount: parseMoney(item.amount),
          note: item.note,
        })),
        subtotal,
        vat,
        total,
        paymentTerms,
        memo,
      });

      if (!result.success) {
        setMessage(result.error);
        return;
      }

      setMessage("견적서가 저장되었습니다.");
      router.refresh();
    });
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;

    setIsPdfPending(true);
    setMessage(null);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = 210;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(image, "PNG", 0, 0, width, height);
      const safeName = inquiry.name.replace(/[\\/:*?"<>|]/g, "");
      pdf.save(`견적서_${estimateNumber}_${safeName}.pdf`);
    } finally {
      setIsPdfPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link href={`/admin/inquiries/${inquiry.id}`}>
              <ArrowLeft className="h-4 w-4" />
              문의 상세로
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">견적서 작성</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            견적문의 내용을 기반으로 견적서를 작성합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            초기화
          </Button>
          <Button type="button" variant="outline" onClick={handleDownloadPdf} disabled={isPdfPending}>
            <FileDown className="h-4 w-4" />
            {isPdfPending ? "PDF 생성 중..." : "PDF 저장"}
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending ? "저장 중..." : "견적서 저장"}
          </Button>
        </div>
      </div>

      {message ? <p className="rounded-lg border border-border bg-white px-4 py-2 text-sm">{message}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[42fr_58fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold">1. 고객 정보</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>고객명</Label>
                <Input value={inquiry.name} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label>회사명</Label>
                <Input value={inquiry.company ?? ""} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label>연락처</Label>
                <Input value={inquiry.phone} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label>이메일</Label>
                <Input value={inquiry.email ?? ""} readOnly />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>업종</Label>
                <Input value={inquiry.business_type ?? ""} readOnly />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold">2. 견적 정보</h2>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label>견적번호</Label>
                <Input value={estimateNumber} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label>작성일</Label>
                <Input value={formatInquiryDate(createdDate)} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paymentTerms">결제조건</Label>
                <Textarea
                  id="paymentTerms"
                  className="min-h-24"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold">3. 제작 항목</h2>
            <div className="mt-4 space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium">항목 {index + 1}</p>
                    {items.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setItems((prev) => prev.filter((row) => row.id !== item.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="항목명 (예: 메인 페이지 제작)"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, "title", e.target.value)}
                    />
                    <Textarea
                      placeholder="작업 설명"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="예상 작업기간 (예: 1주)"
                        value={item.duration}
                        onChange={(e) => updateItem(item.id, "duration", e.target.value)}
                      />
                      <Input
                        placeholder="금액"
                        value={item.amount}
                        onChange={(e) => updateItem(item.id, "amount", e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                    <Input
                      placeholder="비고"
                      value={item.note}
                      onChange={(e) => updateItem(item.id, "note", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setItems((prev) => [...prev, createEmptyItem()])}>
                <Plus className="h-4 w-4" />
                항목 추가
              </Button>
              <div className="rounded-lg border border-dashed border-border p-4 text-sm">
                <p>총 견적 금액: <span className="font-semibold">{formatMoney(subtotal)}</span></p>
                <p>부가세: <span className="font-semibold">{formatMoney(vat)}</span></p>
                <p>최종 금액: <span className="font-semibold text-primary">{formatMoney(total)}</span></p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold">4. 요청 내용 (읽기 전용)</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-medium">필요한 페이지:</span> {inquiry.pages.join(", ") || "-"}</p>
              <p><span className="font-medium">필요한 기능:</span> {inquiry.features.join(", ") || "-"}</p>
              <p><span className="font-medium">희망 일정:</span> {inquiry.schedule || "-"}</p>
              <p><span className="font-medium">참고 사이트:</span> {referenceUrls.join(", ") || "-"}</p>
              <p><span className="font-medium">문의 내용:</span> {inquiry.message || "-"}</p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold">5. 추가 조건</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={conditions.domainSeparate}
                  onCheckedChange={(checked) =>
                    setConditions((prev) => ({ ...prev, domainSeparate: Boolean(checked) }))
                  }
                />
                도메인 비용 별도
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={conditions.hostingSeparate}
                  onCheckedChange={(checked) =>
                    setConditions((prev) => ({ ...prev, hostingSeparate: Boolean(checked) }))
                  }
                />
                호스팅 비용 별도
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={conditions.maintenanceSeparate}
                  onCheckedChange={(checked) =>
                    setConditions((prev) => ({ ...prev, maintenanceSeparate: Boolean(checked) }))
                  }
                />
                유지보수 별도
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={conditions.vatIncluded}
                  onCheckedChange={(checked) =>
                    setConditions((prev) => ({
                      ...prev,
                      vatIncluded: Boolean(checked),
                      vatSeparate: checked ? false : prev.vatSeparate,
                    }))
                  }
                />
                부가세 포함
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={conditions.vatSeparate}
                  onCheckedChange={(checked) =>
                    setConditions((prev) => ({
                      ...prev,
                      vatSeparate: Boolean(checked),
                      vatIncluded: checked ? false : prev.vatIncluded,
                    }))
                  }
                />
                부가세 별도
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold">6. 관리자 메모</h2>
            <Textarea
              className="mt-4 min-h-24"
              placeholder="내부 공유용 메모 (고객에게 노출되지 않음)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </section>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="sticky top-6 overflow-auto">
            <div
              ref={previewRef}
              className="mx-auto aspect-[210/297] w-full max-w-[700px] rounded-lg border border-border bg-white p-8 text-[11px] leading-relaxed shadow-sm"
            >
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold tracking-[0.2em]">견 적 서</h2>
                <p className="text-xs text-muted-foreground">Quotation</p>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <p>견적번호: {estimateNumber}</p>
                  <p>작성일: {formatInquiryDate(createdDate)}</p>
                  <p>수신: {inquiry.name}</p>
                  <p>회사명: {inquiry.company || "-"}</p>
                </div>
              </div>

              <div className="mt-4 text-xs">
                <p>공급자: BOM STUDIO / 대표 허보미 / 이메일 bomstudio22@gmail.com</p>
                <p className="mt-2">아래와 같이 홈페이지 제작 견적을 안내드립니다.</p>
              </div>

              <table className="mt-4 w-full border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-border px-2 py-1">NO</th>
                    <th className="border border-border px-2 py-1">항목명</th>
                    <th className="border border-border px-2 py-1">작업 설명</th>
                    <th className="border border-border px-2 py-1">예상 작업기간</th>
                    <th className="border border-border px-2 py-1">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-border px-2 py-1 text-center">{index + 1}</td>
                      <td className="border border-border px-2 py-1">{item.title || "-"}</td>
                      <td className="border border-border px-2 py-1">{item.description || "-"}</td>
                      <td className="border border-border px-2 py-1 text-center">{item.duration || "-"}</td>
                      <td className="border border-border px-2 py-1 text-right">{formatMoney(parseMoney(item.amount))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <p>총 견적금액</p>
                <p className="text-right">{formatMoney(subtotal)}</p>
                <p>부가세</p>
                <p className="text-right">{formatMoney(vat)}</p>
                <p className="font-semibold">최종 견적금액</p>
                <p className="text-right font-semibold">{formatMoney(total)}</p>
              </div>

              <div className="mt-4 space-y-1 text-xs">
                <p className="font-semibold">요청 내용</p>
                <p>필요 페이지: {inquiry.pages.join(", ") || "-"}</p>
                <p>필요 기능: {inquiry.features.join(", ") || "-"}</p>
                <p>희망 일정: {inquiry.schedule || "-"}</p>
                <p>참고 사이트: {referenceUrls.join(", ") || "-"}</p>
              </div>

              <div className="mt-4 space-y-1 text-xs">
                <p className="font-semibold">계약 조건</p>
                <p className="whitespace-pre-wrap">{paymentTerms}</p>
                <p>도메인: {conditions.domainSeparate ? "별도" : "포함"}</p>
                <p>호스팅: {conditions.hostingSeparate ? "별도" : "포함"}</p>
                <p>유지보수: {conditions.maintenanceSeparate ? "별도" : "포함"}</p>
                <p>부가세: {conditions.vatIncluded ? "포함" : conditions.vatSeparate ? "별도" : "-"}</p>
                <p>기타 특이사항: {memo || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
