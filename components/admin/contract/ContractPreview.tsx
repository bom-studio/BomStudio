"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { ContractDocument } from "@/components/admin/contract/ContractDocument";
import { DocumentPaper } from "@/components/admin/document/DocumentPaper";
import { Button } from "@/components/ui/button";
import type { ContractDocumentView } from "@/lib/admin/contract-document";
import { downloadContractPdf } from "@/lib/admin/contract-pdf";

interface ContractDocumentFrameProps {
  data: ContractDocumentView;
  paperRef?: React.RefObject<HTMLDivElement | null>;
}

export function ContractDocumentFrame({ data, paperRef }: ContractDocumentFrameProps) {
  return (
    <DocumentPaper innerClassName="overflow-hidden" className="contract-document-paper">
      <div ref={paperRef}>
        <ContractDocument data={data} />
      </div>
    </DocumentPaper>
  );
}

interface ContractPdfDownloadButtonProps {
  data: ContractDocumentView;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm";
  className?: string;
}

export function ContractPdfDownloadButton({
  data,
  variant = "secondary",
  size = "default",
  className,
}: ContractPdfDownloadButtonProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setIsPending(true);
    try {
      await downloadContractPdf(paperRef.current, data.contractNumber);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed -left-[10000px] top-0 w-[794px]" aria-hidden>
        <ContractDocumentFrame data={data} paperRef={paperRef} />
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

interface ContractPreviewProps {
  contractId: string;
  documentView: ContractDocumentView;
}

export function ContractPreview({ contractId, documentView }: ContractPreviewProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setIsPending(true);
    try {
      await downloadContractPdf(paperRef.current, documentView.contractNumber);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <Link href={`/admin/contracts/${contractId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">계약서 미리보기</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              고객에게 전달할 계약서 문서를 확인합니다.
            </p>
          </div>
        </div>
        <Button type="button" onClick={handleDownload} disabled={isPending}>
          <Download className="h-4 w-4" />
          {isPending ? "PDF 생성 중..." : "PDF 다운로드"}
        </Button>
      </header>

      <div className="rounded-2xl bg-[#F1F5F9] p-4 sm:p-8">
        <div className="max-h-[calc(100vh-12rem)] overflow-auto py-2">
          <ContractDocumentFrame data={documentView} paperRef={paperRef} />
        </div>
      </div>
    </div>
  );
}
