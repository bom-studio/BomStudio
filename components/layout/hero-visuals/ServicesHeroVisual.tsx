import {
  Code2,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";

const NODES = [
  { icon: Code2, label: "맞춤 개발", angle: -90, distance: 108 },
  { icon: MonitorSmartphone, label: "반응형", angle: -18, distance: 108 },
  { icon: Search, label: "SEO", angle: 54, distance: 108 },
  { icon: ShieldCheck, label: "유지보수", angle: 126, distance: 108 },
  { icon: Wrench, label: "관리자", angle: 198, distance: 108 },
] as const;

function polarToXY(angle: number, distance: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance,
  };
}

export function ServicesHeroVisual() {
  return (
    <VisualShell>
      <VisualDot className="top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* 연결선 */}
        <svg className="absolute top-1/2 left-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 240 240">
          {NODES.map((node) => {
            const { x, y } = polarToXY(node.angle, 90);
            return (
              <line
                key={node.label}
                x1="120"
                y1="120"
                x2={120 + x}
                y2={120 + y}
                stroke="#0F766E"
                strokeOpacity="0.15"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* 중앙 허브 */}
        <VisualCard className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-primary/20 bg-primary/5">
          <div className="h-8 w-8 rounded-xl bg-primary/15" />
          <p className="mt-1 text-[9px] font-semibold text-primary">웹서비스</p>
        </VisualCard>

        {/* 주변 노드 */}
        {NODES.map((node) => {
          const { x, y } = polarToXY(node.angle, node.distance);
          const Icon = node.icon;

          return (
            <div
              key={node.label}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <VisualCard className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border-border/80">
                <Icon className="h-4 w-4 text-primary" />
                <p className="mt-0.5 text-[8px] font-medium text-muted-foreground">{node.label}</p>
              </VisualCard>
            </div>
          );
        })}
      </div>
    </VisualShell>
  );
}
