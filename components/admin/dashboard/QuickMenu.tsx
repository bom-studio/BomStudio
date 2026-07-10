import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  FileText,
  ScrollText,
  UserCircle,
  Users,
} from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";

const QUICK_LINKS = [
  {
    label: "새 문의 보기",
    href: "/admin/inquiries",
    icon: Users,
    className: "bg-slate-100 text-slate-700",
  },
  {
    label: "견적서 작성",
    href: "/admin/estimates/new",
    icon: FileText,
    className: "bg-sky-100 text-sky-700",
  },
  {
    label: "계약서 작성",
    href: "/admin/contracts/new",
    icon: ScrollText,
    className: "bg-amber-100 text-amber-700",
  },
  {
    label: "결제 관리",
    href: "/admin/payments",
    icon: CreditCard,
    className: "bg-[#CCFBF1] text-[#0F766E]",
  },
  {
    label: "고객 관리",
    href: "/admin/projects",
    icon: UserCircle,
    className: "bg-violet-100 text-violet-700",
  },
];

export function QuickMenu() {
  return (
    <DashboardCard title="빠른 메뉴" hover={false} className="min-h-[360px]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group flex min-h-[104px] items-center justify-between rounded-2xl border border-border/40 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:bg-muted/20 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex rounded-xl p-3 ${item.className}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-foreground">{item.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0F766E]" />
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}
