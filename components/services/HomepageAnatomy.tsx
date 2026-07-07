"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AnimatedSection,
  SectionHeader,
} from "@/components/common/AnimatedSection";
import { BrowserFrame } from "@/components/common/BrowserFrame";
import { HOMEPAGE_PREVIEW, HOMEPAGE_SECTIONS } from "@/constants/services-page";
import { cn } from "@/lib/utils";

function WireframePreview() {
  const blocks = [
    "h-[14%] bg-primary/10",
    "h-[14%] bg-section",
    "h-[16%] bg-white",
    "h-[16%] bg-section",
    "h-[12%] bg-white",
    "h-[14%] bg-primary/5",
    "h-[14%] bg-foreground/5",
  ];

  return (
    <div className="flex h-full flex-col gap-1 p-2" aria-hidden="true">
      {blocks.map((height, index) => (
        <div key={index} className={cn("w-full rounded-lg", height)} />
      ))}
    </div>
  );
}

export function HomepageAnatomy() {
  const [activeId, setActiveId] = useState(HOMEPAGE_SECTIONS[0]?.id ?? "");
  const [hasError, setHasError] = useState(false);

  const activeSection =
    HOMEPAGE_SECTIONS.find((section) => section.id === activeId) ?? HOMEPAGE_SECTIONS[0];

  return (
    <AnimatedSection className="section-padding">
      <div className="container-max px-8">
        <SectionHeader label="Structure" title="홈페이지 구성" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
          <BrowserFrame url={HOMEPAGE_PREVIEW.url}>
            <div className="relative h-[520px] overflow-hidden bg-section sm:h-[580px]">
              {!hasError ? (
                <Image
                  src={HOMEPAGE_PREVIEW.image}
                  alt={HOMEPAGE_PREVIEW.alt}
                  width={1440}
                  height={3200}
                  className="absolute inset-x-0 top-0 h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 720px"
                  onError={() => setHasError(true)}
                />
              ) : (
                <WireframePreview />
              )}

              {HOMEPAGE_SECTIONS.map((section) => {
                const isActive = activeId === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onMouseEnter={() => setActiveId(section.id)}
                    onFocus={() => setActiveId(section.id)}
                    onClick={() => setActiveId(section.id)}
                    className={cn(
                      "absolute right-0 left-0 border-2 transition-all duration-300",
                      isActive
                        ? "z-10 border-primary bg-primary/15"
                        : "border-transparent bg-transparent hover:border-primary/40 hover:bg-primary/8"
                    )}
                    style={{ top: `${section.top}%`, height: `${section.height}%` }}
                    aria-label={`${section.number}. ${section.title}`}
                  >
                    <span
                      className={cn(
                        "absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/90 text-foreground shadow-sm"
                      )}
                    >
                      {section.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </BrowserFrame>

          {activeSection ? (
            <div className="rounded-[20px] border border-border bg-card p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold text-primary">
                {String(activeSection.number).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {activeSection.title}
              </h3>
              <p className="mt-4 text-body-lg text-muted-foreground">
                {activeSection.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </AnimatedSection>
  );
}
