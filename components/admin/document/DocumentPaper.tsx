import { cn } from "@/lib/utils";

interface DocumentPaperProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function DocumentPaper({ children, className, innerClassName }: DocumentPaperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[794px]", className)}>
      <div
        className={cn(
          "min-h-[1123px] overflow-hidden rounded-md border border-[#E5E7EB] bg-white shadow-lg",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface DocumentSectionTitleProps {
  children: React.ReactNode;
}

export function DocumentSectionTitle({ children }: DocumentSectionTitleProps) {
  return (
    <h3 className="mb-3 text-[13px] font-semibold tracking-wide text-[#0F766E]">{children}</h3>
  );
}

export function DocumentDivider() {
  return <div className="my-5 border-t border-[#E5E7EB]" />;
}
