"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BUSINESS_PRICE,
  EVENT_DISCOUNT,
  STARTER_PRICE,
} from "@/constants/event";
import {
  hideOpenEventPopupFor24Hours,
  shouldShowOpenEventPopup,
} from "@/lib/open-event-popup";

function getDiscountedPrice(price: number) {
  return Math.round(price * (1 - EVENT_DISCOUNT / 100));
}

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function OpenEventPopup() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hideFor24Hours, setHideFor24Hours] = useState(false);
  const [visible, setVisible] = useState(false);

  const prices = useMemo(
    () => ({
      starter: getDiscountedPrice(STARTER_PRICE),
      business: getDiscountedPrice(BUSINESS_PRICE),
    }),
    []
  );

  const handleClose = useCallback(() => {
    if (hideFor24Hours) {
      hideOpenEventPopupFor24Hours();
    }
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  }, [hideFor24Hours]);

  useEffect(() => {
    if (pathname !== "/") return;
    if (!shouldShowOpenEventPopup()) return;
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, handleClose]);

  if (!open || pathname !== "/") return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center px-6 transition-opacity duration-300 ease-out ${
        visible ? "bg-black/55" : "bg-black/0"
      }`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="open-event-title"
        className={`relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-xl transition-all duration-300 ease-out ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
          aria-label="팝업 닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-6 pt-6">
          <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            🎉 OPEN EVENT
          </div>
          <p className="absolute right-14 top-7 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
            ~ 2026.08.31
          </p>

          <h2 id="open-event-title" className="mt-5 text-center text-2xl font-bold leading-tight">
            오픈 이벤트
            <br />
            홈페이지 제작
            <br />
            <span className="text-3xl font-extrabold text-primary">
              {EVENT_DISCOUNT}% 할인
            </span>
          </h2>

          <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
            봄스튜디오 오픈 기념
            <br />
            모든 홈페이지 제작 상품을
            <br />
            기간 한정 {EVENT_DISCOUNT}% 할인된 가격으로 제작해드립니다.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/20 p-3 text-center">
              <p className="text-xs text-muted-foreground">Starter</p>
              <p className="mt-1 text-sm text-muted-foreground line-through">
                {formatWon(STARTER_PRICE)}
              </p>
              <p className="text-xs text-muted-foreground">↓</p>
              <p className="text-lg font-bold text-primary">{formatWon(prices.starter)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-3 text-center">
              <p className="text-xs text-muted-foreground">Business</p>
              <p className="mt-1 text-sm text-muted-foreground line-through">
                {formatWon(BUSINESS_PRICE)}
              </p>
              <p className="text-xs text-muted-foreground">↓</p>
              <p className="text-lg font-bold text-primary">{formatWon(prices.business)}</p>
            </div>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            {["선착순 이벤트", "상담만 받아도 할인 적용", "계약 시 자동 할인 적용"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              )
            )}
          </ul>

          <Button asChild className="mt-6 h-12 w-full" onClick={handleClose}>
            <Link href="/estimate">무료 견적 문의하기</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-200 px-6 py-5">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-gray-600">
            <Checkbox
              checked={hideFor24Hours}
              onCheckedChange={(checked) => setHideFor24Hours(Boolean(checked))}
              aria-label="24시간 동안 열지 않기"
            />
            <span>24시간 동안 열지 않기</span>
          </label>

          <button
            type="button"
            onClick={handleClose}
            className="min-h-11 px-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
