import { FileText, MessageSquare, Send } from "lucide-react";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";

export function EstimateHeroVisual() {
  const fields = ["이름", "연락처", "업종", "예산 범위"];

  return (
    <VisualShell>
      <VisualDot className="top-8 left-8 h-28 w-28" />

      {/* 추상적 인물 실루엣 */}
      <div className="absolute bottom-8 left-6 flex flex-col items-center">
        <div className="h-8 w-8 rounded-full bg-primary/10" />
        <div className="mt-1 h-12 w-14 rounded-t-2xl bg-primary/8" />
      </div>

      {/* 노트북 + 문의서 */}
      <div className="absolute top-10 left-1/2 w-[62%] -translate-x-[40%]">
        <VisualCard className="overflow-hidden rounded-xl p-1.5">
          <div className="rounded-lg bg-section p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">견적 문의서</p>
            </div>
            <div className="mt-3 space-y-2">
              {fields.map((field) => (
                <div key={field} className="rounded-lg border border-border bg-white px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{field}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary text-[10px] font-medium text-primary-foreground">
              <Send className="h-3 w-3" />
              제출하기
            </div>
          </div>
        </VisualCard>
        <div className="mx-auto mt-1 h-1.5 w-[80%] rounded-b-md bg-border/60" />
      </div>

      {/* 상담 UI 카드 */}
      <VisualCard className="absolute top-6 right-2 w-[42%] p-3 sm:right-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-semibold">빠른 상담</p>
        </div>
        <div className="mt-2 space-y-2">
          <div className="rounded-lg rounded-tl-sm bg-primary/10 px-2.5 py-2">
            <p className="text-[9px] text-foreground">안녕하세요! 견적 문의 도와드릴게요.</p>
          </div>
          <div className="ml-auto w-[80%] rounded-lg rounded-tr-sm bg-section px-2.5 py-2">
            <p className="text-[9px] text-muted-foreground">학원 홈페이지 제작 문의합니다.</p>
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          <div className="h-1.5 flex-1 rounded-full bg-border" />
          <div className="h-1.5 w-6 rounded-full bg-primary/30" />
        </div>
      </VisualCard>
    </VisualShell>
  );
}
