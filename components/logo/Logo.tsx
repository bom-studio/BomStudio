import Link from "next/link";
import { BrandSymbol } from "@/components/logo/BrandSymbol";
import { BRAND } from "@/constants/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 transition-opacity hover:opacity-80", className)}
      aria-label={`${BRAND.name} 홈으로`}
    >
      <BrandSymbol size={32} />
      {showText && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          {BRAND.name}
        </span>
      )}
    </Link>
  );
}
