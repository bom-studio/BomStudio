import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 343;
const LOGO_HEIGHT = 360;
const LOGO_SRC = "/images/brand/logo-b.png";

interface BrandSymbolProps {
  className?: string;
  size?: number;
}

export function BrandSymbol({ className, size = 48 }: BrandSymbolProps) {
  const width = size;
  const height = Math.round((size * LOGO_HEIGHT) / LOGO_WIDTH);

  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      aria-hidden="true"
    />
  );
}
