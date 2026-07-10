import Link from "next/link";
import { logoutAdmin } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderAdminNavProps {
  isAdmin: boolean;
  className?: string;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}

export function HeaderAdminNav({
  isAdmin,
  className,
  onNavigate,
  variant = "desktop",
}: HeaderAdminNavProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {isAdmin ? (
          <>
            <Button asChild className="w-full">
              <Link href="/admin" onClick={onNavigate}>
                관리자 페이지
              </Link>
            </Button>
            <form action={logoutAdmin}>
              <Button type="submit" variant="outline" className="w-full" onClick={onNavigate}>
                로그아웃
              </Button>
            </form>
          </>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/login" onClick={onNavigate}>
              관리자 로그인
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isAdmin ? (
        <>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/admin">관리자 페이지</Link>
          </Button>
          <form action={logoutAdmin}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              로그아웃
            </Button>
          </form>
        </>
      ) : (
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/admin/login">관리자 로그인</Link>
        </Button>
      )}
    </div>
  );
}
