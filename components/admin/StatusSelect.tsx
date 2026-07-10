"use client";

import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type MutationResult = void | { success: true } | { success: false; error: string };

interface StatusSelectProps<T extends string> {
  value: T | string | null | undefined;
  options: readonly T[];
  onChange: (value: T) => Promise<MutationResult> | MutationResult;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

function getStatusTone(status: string) {
  if (
    ["계약완료", "완료", "승인완료", "서명완료", "입금완료", "종료"].includes(status)
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (["발송완료", "상담중", "견적서작성", "진행중", "기획", "디자인", "개발", "검수", "배포", "입금예정"].includes(status)) {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  if (["작성중", "접수완료", "대기중", "입금대기"].includes(status)) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  if (["수정요청", "부분입금"].includes(status)) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (["연체", "취소"].includes(status)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (["보류", "환불"].includes(status)) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  return "border-border bg-white text-muted-foreground";
}

export function StatusSelect<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  size = "sm",
  className,
}: StatusSelectProps<T>) {
  const fallback = options[0] ?? "";
  const [currentValue, setCurrentValue] = useState((value || fallback) as T);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const renderedOptions = options.includes(currentValue)
    ? options
    : ([currentValue, ...options] as readonly T[]);

  useEffect(() => {
    setCurrentValue((value || fallback) as T);
  }, [fallback, value]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(null), 3200);
    return () => window.clearTimeout(timer);
  }, [error]);

  const handleChange = (nextValue: T) => {
    if (nextValue === currentValue) return;

    const previousValue = currentValue;
    setCurrentValue(nextValue);
    setError(null);

    startTransition(async () => {
      const result = await onChange(nextValue);
      if (result && !result.success) {
        setCurrentValue(previousValue);
        setError(result.error);
      }
    });
  };

  return (
    <>
      <select
        value={currentValue}
        disabled={disabled || isPending}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => handleChange(event.target.value as T)}
        className={cn(
          "max-w-full rounded-full border font-medium outline-none transition-colors focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
          size === "sm" ? "h-8 min-w-[104px] px-2.5 text-xs" : "h-9 min-w-[124px] px-3 text-sm",
          getStatusTone(currentValue),
          isPending && "opacity-70",
          className
        )}
        aria-label="상태 변경"
      >
        {renderedOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error ? (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-destructive/30 bg-white px-4 py-3 text-sm text-destructive shadow-lg">
          {error}
        </div>
      ) : null}
    </>
  );
}
