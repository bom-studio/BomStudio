import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";

const CONTACT_CHANNELS = [
  { icon: Mail, label: "이메일", value: "contact@bomstudio.kr" },
  { icon: Phone, label: "전화", value: "상담 문의" },
  { icon: MessageCircle, label: "카카오톡", value: "채널 상담" },
] as const;

export function ContactHeroVisual() {
  return (
    <VisualShell>
      <VisualDot className="bottom-10 left-1/2 h-32 w-32 -translate-x-1/2" />

      {/* 지도 카드 */}
      <VisualCard className="absolute top-6 right-2 left-2 overflow-hidden sm:left-6 sm:w-[58%]">
        <div className="relative h-[120px] bg-section">
          {/* 지도 그리드 */}
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute h-px w-full bg-border"
                  style={{ top: `${(row + 1) * 16}%` }}
                />
              ))
            )}
          </div>
          {/* 위치 핀 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="mt-0.5 h-2 w-2 rotate-45 bg-primary" />
            </div>
          </div>
          <div className="absolute bottom-2 left-3 rounded-md bg-white/90 px-2 py-1 text-[9px] font-medium shadow-sm">
            BOM STUDIO
          </div>
        </div>
      </VisualCard>

      {/* 연락 채널 */}
      <div className="absolute right-4 bottom-6 left-4 space-y-2 sm:left-auto sm:w-[48%]">
        {CONTACT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <VisualCard key={channel.label} className="flex items-center gap-3 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold">{channel.label}</p>
                <p className="text-[9px] text-muted-foreground">{channel.value}</p>
              </div>
            </VisualCard>
          );
        })}
      </div>
    </VisualShell>
  );
}
