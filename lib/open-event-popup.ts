import { EVENT_END_DATE, OPEN_EVENT_POPUP_SEEN_KEY } from "@/constants/event";

const HIDE_DURATION_MS = 24 * 60 * 60 * 1000;

export function isOpenEventActive() {
  const endDate = new Date(`${EVENT_END_DATE}T23:59:59`);
  return Date.now() <= endDate.getTime();
}

export function shouldShowOpenEventPopup() {
  if (typeof window === "undefined") return false;
  if (!isOpenEventActive()) return false;

  const hiddenAt = localStorage.getItem(OPEN_EVENT_POPUP_SEEN_KEY);
  if (!hiddenAt) return true;

  const elapsed = Date.now() - new Date(hiddenAt).getTime();
  return elapsed >= HIDE_DURATION_MS;
}

export function hideOpenEventPopupFor24Hours() {
  localStorage.setItem(OPEN_EVENT_POPUP_SEEN_KEY, new Date().toISOString());
}
