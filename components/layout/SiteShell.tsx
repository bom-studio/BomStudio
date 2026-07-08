"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BackToTop } from "@/components/common/BackToTop";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
