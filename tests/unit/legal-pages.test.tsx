/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { LegalPage } from "@/components/legal-page";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  cookieConsentCopy,
  cookiePolicy,
  cookiePreferencesCopy,
  privacyPolicy,
  shouldOfferCookieConsent,
  termsOfService,
} from "@/config/legal";
import {
  clearCookieConsent,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/customer/cookie-consent";

const { useActivePathname } = vi.hoisted(() => ({
  useActivePathname: vi.fn((): string => "/"),
}));

vi.mock("@/components/layout/navbar/use-active-pathname", () => ({
  useActivePathname,
}));

function installMemoryLocalStorage(): void {
  const store = new Map<string, string>();

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      get length(): number {
        return store.size;
      },
      clear: (): void => {
        store.clear();
      },
      getItem: (key: string): string | null => store.get(key) ?? null,
      key: (index: number): string | null => [...store.keys()][index] ?? null,
      removeItem: (key: string): void => {
        store.delete(key);
      },
      setItem: (key: string, value: string): void => {
        store.set(key, value);
      },
    },
  });
}

describe("shouldOfferCookieConsent", (): void => {
  it("hides the banner on admin, dashboard, and cleaner shells", (): void => {
    expect(shouldOfferCookieConsent("/")).toBe(true);
    expect(shouldOfferCookieConsent("/privacy")).toBe(true);
    expect(shouldOfferCookieConsent("/admin")).toBe(false);
    expect(shouldOfferCookieConsent("/admin/dashboard")).toBe(false);
    expect(shouldOfferCookieConsent("/dashboard")).toBe(false);
    expect(shouldOfferCookieConsent("/cleaner/jobs")).toBe(false);
  });
});

describe("cookie consent storage", (): void => {
  beforeEach((): void => {
    installMemoryLocalStorage();
  });

  it("ignores unknown values and stores accept or reject", (): void => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "maybe");
    expect(readCookieConsent()).toBeNull();

    writeCookieConsent("accepted");
    expect(readCookieConsent()).toBe("accepted");

    writeCookieConsent("rejected");
    expect(readCookieConsent()).toBe("rejected");

    clearCookieConsent();
    expect(readCookieConsent()).toBeNull();
  });
});

describe("LegalPage", (): void => {
  it("renders one h1 and the privacy sections", (): void => {
    render(<LegalPage document={privacyPolicy} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: privacyPolicy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: privacyPolicy.sections[0]?.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.queryByText("hello@neatly.com")).not.toBeInTheDocument();
  });

  it("renders terms without invented insurance or prices", (): void => {
    render(<LegalPage document={termsOfService} />);

    expect(
      screen.getByRole("heading", { level: 1, name: termsOfService.heading }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Lloyds/i)).not.toBeInTheDocument();
  });

  it("lets visitors change the cookie choice on the cookie page", async (): Promise<void> => {
    const user = userEvent.setup();
    installMemoryLocalStorage();
    render(<LegalPage document={cookiePolicy} />);

    expect(
      screen.getByRole("heading", { level: 1, name: cookiePolicy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: cookiePreferencesCopy.heading,
      }),
    ).toBeInTheDocument();

    writeCookieConsent("accepted");
    expect(
      await screen.findByText(cookiePreferencesCopy.accepted),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: cookiePreferencesCopy.changeLabel }),
    );
    expect(
      await screen.findByText(cookiePreferencesCopy.unset),
    ).toBeInTheDocument();
  });
});

describe("CookieConsentBanner", (): void => {
  beforeEach((): void => {
    useActivePathname.mockReturnValue("/");
    installMemoryLocalStorage();
  });

  it("accepts cookies and then hides", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<CookieConsentBanner />);

    expect(
      screen.getByRole("heading", { name: cookieConsentCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: cookieConsentCopy.policyLabel }),
    ).toHaveAttribute("href", "/cookies");

    await user.click(
      screen.getByRole("button", { name: cookieConsentCopy.acceptLabel }),
    );

    expect(
      screen.queryByRole("button", { name: cookieConsentCopy.acceptLabel }),
    ).not.toBeInTheDocument();
    expect(readCookieConsent()).toBe("accepted");
  });

  it("does not render on admin routes", (): void => {
    useActivePathname.mockReturnValue("/admin/dashboard");
    render(<CookieConsentBanner />);

    expect(
      screen.queryByRole("button", { name: cookieConsentCopy.acceptLabel }),
    ).not.toBeInTheDocument();
  });
});
