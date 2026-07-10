"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
  RefreshCw,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { CountUp } from "@/components/admin/dashboard/CountUp";
import { DashboardCard, DashboardProgressBar } from "@/components/admin/dashboard/DashboardCard";
import { formatEstimateMoney } from "@/lib/admin/estimate-display";
import { formatShortDate } from "@/lib/admin/dashboard-dates";
import type { DashboardKpi, DashboardNotification } from "@/types/admin-dashboard";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userName: string;
  todayLabel: string;
  notifications: DashboardNotification[];
  unreadCount: number;
}

export function DashboardHeader({
  userName,
  todayLabel,
  notifications,
  unreadCount,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          안녕하세요, {userName}님 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">오늘도 좋은 하루입니다.</p>
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-muted-foreground sm:block">{todayLabel}</p>

        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-white text-foreground transition-colors hover:bg-muted/40"
            aria-label="알림"
          >
            <span className="text-base leading-none">🔔</span>
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0F766E] px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>

          {open ? (
            <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
              <div className="border-b border-border/40 px-4 py-3">
                <p className="text-sm font-semibold text-foreground">알림</p>
                <p className="text-xs text-muted-foreground">최근 이벤트</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    새 알림이 없습니다.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/80">
                        {formatShortDate(item.createdAt)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-white px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 disabled:opacity-60"
        >
          <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
          새로고침
        </button>
      </div>
    </div>
  );
}

function DeltaBadge({ delta, suffix = "건" }: { delta: number; suffix?: string }) {
  if (delta === 0) {
    return <span className="text-xs text-muted-foreground">변동 없음</span>;
  }

  const positive = delta > 0;
  const Icon = positive ? ChevronUp : ChevronDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        positive ? "text-emerald-600" : "text-rose-600"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {positive ? "+" : ""}
      {delta}
      {suffix}
    </span>
  );
}

function ChangePercent({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  if (value === null) {
    return <p className="text-xs text-muted-foreground">{label} —</p>;
  }

  const positive = value >= 0;
  return (
    <p className="text-xs text-muted-foreground">
      {label}{" "}
      <span className={cn("font-medium", positive ? "text-emerald-600" : "text-rose-600")}>
        {positive ? "+" : ""}
        {value}%
      </span>
    </p>
  );
}

const KPI_CONFIG = [
  {
    key: "todayInquiries" as const,
    label: "오늘 문의",
    icon: MessageSquare,
    iconClass: "bg-sky-50 text-sky-600",
    href: "/admin/inquiries",
    countValue: (kpi: DashboardKpi) => kpi.todayInquiries.count,
    countFormat: (v: number) => `${v}건`,
    footer: (kpi: DashboardKpi) => (
      <div className="space-y-1.5 border-t border-border/40 pt-3">
        <DeltaBadge delta={kpi.todayInquiries.changeDelta} />
        <ChangePercent label="어제 대비" value={kpi.todayInquiries.changePercent} />
      </div>
    ),
  },
  {
    key: "activeProjects" as const,
    label: "진행중 프로젝트",
    icon: Briefcase,
    iconClass: "bg-violet-50 text-violet-600",
    href: "/admin/projects",
    countValue: (kpi: DashboardKpi) => kpi.activeProjects.count,
    countFormat: (v: number) => `${v}건`,
    footer: (kpi: DashboardKpi) => (
      <div className="space-y-1.5 border-t border-border/40 pt-3">
        <p className="text-xs font-medium text-foreground">
          이번달 신규 {kpi.activeProjects.newThisMonth}건
        </p>
        <p className="text-xs text-muted-foreground">현재 진행중</p>
      </div>
    ),
  },
  {
    key: "monthContracts" as const,
    label: "이번달 계약",
    icon: FileText,
    iconClass: "bg-amber-50 text-amber-700",
    href: "/admin/contracts",
    countValue: (kpi: DashboardKpi) => kpi.monthContracts.count,
    countFormat: (v: number) => `${v}건`,
    footer: (kpi: DashboardKpi) => (
      <div className="space-y-1.5 border-t border-border/40 pt-3">
        <DeltaBadge delta={kpi.monthContracts.changeDelta} />
        <ChangePercent label="지난달 대비" value={kpi.monthContracts.changePercent} />
      </div>
    ),
  },
  {
    key: "monthRevenue" as const,
    label: "이번달 매출",
    icon: Wallet,
    iconClass: "bg-[#F0FDFA] text-[#0F766E]",
    href: "/admin/payments",
    countValue: (kpi: DashboardKpi) => kpi.monthRevenue.amount,
    countFormat: (v: number) => formatEstimateMoney(v),
    footer: (kpi: DashboardKpi) => (
      <div className="space-y-2 border-t border-border/40 pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">목표 달성률</span>
          <span className="font-semibold text-[#0F766E]">{kpi.monthRevenue.goalPercent}%</span>
        </div>
        <DashboardProgressBar percent={kpi.monthRevenue.goalPercent} />
        <ChangePercent label="지난달 대비" value={kpi.monthRevenue.changePercent} />
      </div>
    ),
  },
];

export function KpiCards({ kpis }: { kpis: DashboardKpi }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_CONFIG.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.key} href={item.href} className="block h-full">
            <DashboardCard hover className="h-full min-h-[196px]">
              <div className="flex items-start justify-between gap-3">
                <div className={cn("rounded-xl p-2.5", item.iconClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                <CountUp value={item.countValue(kpis)} formatter={item.countFormat} />
              </p>
              <div className="mt-4">{item.footer(kpis)}</div>
            </DashboardCard>
          </Link>
        );
      })}
    </div>
  );
}

export function RevenueChangeBadge({ percent }: { percent: number | null }) {
  if (percent === null) return null;
  const positive = percent >= 0;
  const Icon = positive ? ChevronUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-semibold",
        positive ? "text-emerald-600" : "text-rose-600"
      )}
    >
      <Icon className="h-4 w-4" />
      {positive ? "+" : ""}
      {percent}%
    </span>
  );
}
