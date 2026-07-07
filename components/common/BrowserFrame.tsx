import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function BrowserFrame({
  url = "bomstudio.kr",
  children,
  className,
  compact = false,
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border bg-[#FAFAFA]",
          compact ? "h-9 px-3" : "h-11 gap-3 px-4"
        )}
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className={cn("rounded-full bg-[#FF5F57]", compact ? "h-2 w-2" : "h-2.5 w-2.5")} />
          <span className={cn("rounded-full bg-[#FFBD2E]", compact ? "h-2 w-2" : "h-2.5 w-2.5")} />
          <span className={cn("rounded-full bg-[#28CA42]", compact ? "h-2 w-2" : "h-2.5 w-2.5")} />
        </div>
        <div className="flex flex-1 justify-center">
          <div
            className={cn(
              "w-full rounded-md border border-border bg-white text-center text-muted-foreground",
              compact ? "max-w-[120px] px-2 py-0.5 text-[10px]" : "max-w-xs px-3 py-1 text-xs"
            )}
          >
            {url}
          </div>
        </div>
        <div className={compact ? "w-[34px]" : "w-[46px]"} aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}
