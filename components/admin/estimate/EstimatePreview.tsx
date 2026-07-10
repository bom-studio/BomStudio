"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { SavedEstimateDocument } from "@/components/admin/estimate/SavedEstimateDocument";
import { DocumentPaper } from "@/components/admin/document/DocumentPaper";
import { Button } from "@/components/ui/button";
import type { EstimateDocumentView } from "@/lib/admin/estimate-document";
import { downloadEstimatePdf } from "@/lib/admin/estimate-pdf";

interface EstimateDocumentFrameProps {
  data: EstimateDocumentView;
  paperRef?: React.RefObject<HTMLDivElement | null>;
}

export function EstimateDocumentFrame({ data, paperRef }: EstimateDocumentFrameProps) {
  return (
    <DocumentPaper innerClassName="overflow-hidden" className="estimate-document-paper">
      <div ref={paperRef}>
        <SavedEstimateDocument data={data} />
      </div>
    </DocumentPaper>
  );
}

interface EstimatePdfDownloadButtonProps {
  data: EstimateDocumentView;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm";
  className?: string;
}

export function EstimatePdfDownloadButton({
  data,
  variant = "secondary",
  size = "default",
  className,
}: EstimatePdfDownloadButtonProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setIsPending(true);
    try {
      await downloadEstimatePdf(
        paperRef.current,
        data.estimateNumber,
        data.customer.name
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed -left-[10000px] top-0 w-[794px]" aria-hidden>
        <EstimateDocumentFrame data={data} paperRef={paperRef} />
      </div>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={isPending}
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        {isPending ? "PDF 생성 중..." : "PDF 다운로드"}
      </Button>
    </>
  );
}

interface EstimatePreviewProps {
  estimateId: string;
  documentView: EstimateDocumentView;
}

export function EstimatePreview({ estimateId, documentView }: EstimatePreviewProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setIsPending(true);
    try {
      await downloadEstimatePdf(
        paperRef.current,
        documentView.estimateNumber,
        documentView.customer.name
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <Link href={`/admin/estimates/${estimateId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">견적서 미리보기</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              고객에게 전달할 견적서 문서를 확인합니다.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/estimates/${estimateId}`}>견적서 상세</Link>
          </Button>
          <Button type="button" onClick={handleDownload} disabled={isPending}>
            <Download className="h-4 w-4" />
            {isPending ? "PDF 생성 중..." : "PDF 다운로드"}
          </Button>
        </div>
      </header>

      <div className="rounded-2xl bg-[#F1F5F9] p-4 sm:p-8">
        <div className="max-h-[calc(100vh-12rem)] overflow-auto py-2">
          <EstimateDocumentFrame data={documentView} paperRef={paperRef} />
        </div>
      </div>
    </div>
  );
}
