"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/actions/inquiries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [{ href: "/admin/inquiries", label: "견적문의" }];

interface AdminHeaderProps {
  email?: string;
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/admin/inquiries" className="text-lg font-bold text-primary">
            BOM Admin
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {email ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
          ) : null}
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5">
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
