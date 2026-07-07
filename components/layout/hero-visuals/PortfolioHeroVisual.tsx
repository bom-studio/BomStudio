import Image from "next/image";
import { VisualCard, VisualDot, VisualShell } from "@/components/layout/hero-visuals/VisualShell";

function LaptopScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[220px]">
      <VisualCard className="overflow-hidden rounded-xl p-1">
        <div className="aspect-[16/10] overflow-hidden rounded-lg">{children}</div>
      </VisualCard>
      <div className="mx-auto mt-1 h-1.5 w-[85%] rounded-b-md bg-border/80" />
      <div className="mx-auto h-1 w-[70%] rounded-b-sm bg-border/50" />
    </div>
  );
}

function TabletScreen({ children }: { children: React.ReactNode }) {
  return (
    <VisualCard className="w-[100px] overflow-hidden rounded-xl p-1">
      <div className="aspect-[3/4] overflow-hidden rounded-lg">{children}</div>
    </VisualCard>
  );
}

function PhoneScreen({ children }: { children: React.ReactNode }) {
  return (
    <VisualCard className="w-[56px] overflow-hidden rounded-[14px] p-0.5">
      <div className="aspect-[9/16] overflow-hidden rounded-[12px]">{children}</div>
    </VisualCard>
  );
}

export function PortfolioHeroVisual() {
  return (
    <VisualShell>
      <VisualDot className="top-4 right-8 h-32 w-32" />
      <VisualDot className="bottom-8 left-4 h-24 w-24 bg-accent/10" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%]">
        <LaptopScreen>
          <Image
            src="/images/portfolio/mukhyang-long.webp"
            alt=""
            width={440}
            height={275}
            className="h-full w-full object-cover object-top"
            sizes="220px"
          />
        </LaptopScreen>
      </div>

      <div className="absolute top-6 left-2 -rotate-6 sm:left-6">
        <TabletScreen>
          <Image
            src="/images/portfolio/aone-long.webp"
            alt=""
            width={200}
            height={267}
            className="h-full w-full object-cover object-top"
            sizes="100px"
          />
        </TabletScreen>
      </div>

      <div className="absolute right-4 bottom-10 rotate-6 sm:right-8">
        <PhoneScreen>
          <Image
            src="/images/portfolio/sajangman-long.webp"
            alt=""
            width={112}
            height={200}
            className="h-full w-full object-cover object-top"
            sizes="56px"
          />
        </PhoneScreen>
      </div>

      <div className="absolute top-4 right-12 hidden rounded-full border border-primary/20 bg-white px-3 py-1 text-[10px] font-medium text-primary shadow-sm sm:block">
        Responsive
      </div>
    </VisualShell>
  );
}
