"use client";

import {
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ScrollText,
  Settings,
  Users,
  Wallet,
  X,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "견적문의", icon: MessageSquare },
  { href: "/admin/estimates", label: "견적서", icon: FileText },
  { href: "/admin/contracts", label: "계약", icon: ScrollText },
  { href: "/admin/projects", label: "프로젝트", icon: Briefcase },
  { href: "/admin/payments", label: "매출관리", icon: Wallet },
  { href: "/admin/customers", label: "고객", icon: Users },
  { href: "/admin/settings", label: "사이트 설정", icon: Settings },
];

function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/admin") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

interface AdminSidebarProps {
  email?: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isNavActive(pathname, item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <Link href="/admin" className="text-base font-bold text-primary">
          BOM STUDIO 관리자
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r border-border bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="hidden border-b border-border p-5 lg:block">
          <Link href="/admin" className="text-lg font-bold text-primary">
            BOM STUDIO 관리자
          </Link>
          {email ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
          ) : null}
        </div>

        {navContent}

        <div className="mt-auto space-y-2 border-t border-border p-4">
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              홈페이지 보기
            </Link>
          </Button>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
