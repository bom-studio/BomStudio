"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PortfolioBrowserPreviewProps {
  previewImage?: string;
  siteUrl: string;
  title: string;
  priority?: boolean;
}

function getDisplayUrl(siteUrl: string): string {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "project.demo";
  }
}

function PreviewPlaceholder() {
  return (
    <div className="flex h-full min-h-[500px] items-center justify-center bg-section px-8 lg:min-h-[720px]">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-6 h-px w-16 bg-border" aria-hidden="true" />
        <p className="text-base font-medium text-foreground">프로젝트 미리보기 준비 중</p>
        <p className="mt-2 text-sm text-muted-foreground">곧 실제 화면이 추가됩니다.</p>
        <div className="mx-auto mt-6 h-px w-16 bg-border" aria-hidden="true" />
      </div>
    </div>
  );
}

export function PortfolioBrowserPreview({
  previewImage,
  siteUrl,
  title,
  priority = false,
}: PortfolioBrowserPreviewProps) {
  const [hasError, setHasError] = useState(false);
  const displayUrl = getDisplayUrl(siteUrl);
  const showPlaceholder = !previewImage || hasError;

  return (
    <div
      className={cn(
        "group/browser relative w-full cursor-pointer overflow-hidden rounded-[20px] border border-border bg-white",
        "shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300",
        "hover:scale-[1.01] hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
      )}
    >
      <div className="flex h-12 items-center gap-3 border-b border-border px-4">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28CA42]" />
        </div>

        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-xs rounded-lg border border-border bg-section px-4 py-1.5 text-center text-xs text-muted-foreground">
            {displayUrl}
          </div>
        </div>

        <div className="w-[52px]" aria-hidden="true" />
      </div>

      <div className="relative h-[500px] overflow-hidden lg:h-[720px]">
        {showPlaceholder ? (
          <PreviewPlaceholder />
        ) : (
          <div
            className={cn(
              "will-change-transform transition-transform duration-[14s] ease-in-out",
              "group-hover/browser:translate-y-[calc(-100%+500px)]",
              "lg:group-hover/browser:translate-y-[calc(-100%+720px)]"
            )}
          >
            <Image
              src={previewImage}
              alt={`${title} 홈페이지 미리보기`}
              width={1440}
              height={3200}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={priority}
              loading={priority ? undefined : "lazy"}
              onError={() => setHasError(true)}
            />
          </div>
        )}
      </div>

      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "absolute right-4 bottom-4 z-10 inline-flex items-center gap-1.5 rounded-full",
          "border border-border/70 bg-white/85 px-4 py-2 text-sm font-medium text-foreground",
          "transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
        )}
        aria-label={`${title} 사이트 방문`}
        onClick={(event) => event.stopPropagation()}
      >
        사이트 방문
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
