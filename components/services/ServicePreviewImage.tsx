"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ServicePreviewImageProps {
  src?: string;
  alt: string;
  label: string;
  icon: LucideIcon;
  className?: string;
  priority?: boolean;
}

export function ServicePreviewImage({
  src,
  alt,
  label,
  icon: Icon,
  className,
  priority = false,
}: ServicePreviewImageProps) {
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !src || hasError;

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-section",
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-section", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
