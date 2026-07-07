import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  { q: "홈페이지 제작기간은?", open: true },
  { q: "도메인은 누가 구매하나요?", open: false },
  { q: "유지보수는 가능한가요?", open: false },
];

export function FaqHeroVisual() {
  return (
    <VisualShell>
      <VisualDot className="top-4 right-10 h-24 w-24 bg-accent/10" />

      {/* 말풍선 */}
      <div className="absolute top-6 left-8">
        <div className="relative rounded-2xl rounded-bl-sm border border-primary/20 bg-primary/5 px-4 py-2.5">
          <p className="text-[10px] font-medium text-primary">궁금한 점이 있으신가요?</p>
        </div>
        <MessageCircle className="absolute -top-2 -right-2 h-6 w-6 text-primary/40" />
      </div>

      {/* 물음표 아이콘 */}
      <div className="absolute top-4 right-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-white shadow-sm">
        <HelpCircle className="h-6 w-6 text-primary" />
      </div>

      {/* 아코디언 카드 */}
      <div className="absolute right-4 bottom-6 left-4 space-y-2 sm:left-8">
        {QUESTIONS.map((item, index) => (
          <div key={item.q} style={{ transform: `translateX(${index * 4}px)` }}>
            <VisualCard
              className={cn(
                "p-3 transition-colors",
                item.open && "border-primary/25 bg-primary/5"
              )}
            >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium">{item.q}</p>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-primary transition-transform",
                  item.open && "rotate-180"
                )}
              />
            </div>
            {item.open ? (
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                페이지 수와 기능에 따라 다르며, 상담 후 정확한 일정을 안내해 드립니다.
              </p>
            ) : null}
            </VisualCard>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}
