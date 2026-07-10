"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/constants/contact";
import { cn } from "@/lib/utils";

export function KakaoChatButton() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <a
      href={CONTACT.kakaoChatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡 상담 열기"
      className={cn(
        "fixed z-40 inline-flex items-center justify-center gap-2",
        "rounded-full bg-[#FEE500] text-[#191919]",
        "font-medium shadow-lg shadow-black/10",
        "transition-[transform,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEE500] focus-visible:ring-offset-2",
        "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4",
        "h-14 w-14 sm:bottom-8 sm:right-6 sm:h-auto sm:w-auto sm:px-5 sm:py-3.5"
      )}
    >
      <MessageCircle className="h-6 w-6 shrink-0 sm:h-5 sm:w-5" aria-hidden />
      <span className="hidden text-sm sm:inline">카카오톡 상담</span>
    </a>
  );
}
