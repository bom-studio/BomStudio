import Link from "next/link";
import { Logo } from "@/components/logo/Logo";
import { BRAND, SERVICE_COVERAGE } from "@/constants/brand";
import { FOOTER_NAV } from "@/constants/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border bg-section">
      <div className="container-max section-padding !py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Logo />
            <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{BRAND.name}</p>
              <p>대표 허보미</p>
              <p>홈페이지 제작 · 랜딩페이지 · 웹서비스 개발</p>
              <p className="pt-2">
                Phone:{" "}
                <a href="tel:01067805934" className="transition-colors hover:text-primary">
                  010-6780-5934
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:bomstudio22@gmail.com"
                  className="transition-colors hover:text-primary"
                >
                  bomstudio22@gmail.com
                </a>
              </p>
              <div className="space-y-1 pt-4 text-sm text-muted-foreground">
                {SERVICE_COVERAGE.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">바로가기</h3>
            <ul className="space-y-2">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-divider pt-8">
          <p className="text-xs text-muted-foreground">
            Copyright © {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
