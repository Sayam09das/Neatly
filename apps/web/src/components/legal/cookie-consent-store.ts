import { COOKIE_CONSENT_CHANGE_EVENT } from "@/config/legal";

export function subscribeToCookieConsent(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return (): void => undefined;
  }

  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return (): void => {
    window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function subscribeNever(): () => void {
  return (): void => undefined;
}
