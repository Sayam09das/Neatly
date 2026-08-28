"use client";

import { Sheet } from "@neatly/ui";
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface AdminNavigationContextValue {
  closeMobileNav: () => void;
  collapsed: boolean;
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
}

const AdminNavigationContext =
  createContext<AdminNavigationContextValue | null>(null);

interface AdminNavigationProviderProps {
  children: ReactNode;
}

export function AdminNavigationProvider({
  children,
}: AdminNavigationProviderProps): ReactElement {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const openMobileNav = useCallback((): void => {
    setMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback((): void => {
    setMobileNavOpen(false);
  }, []);

  const toggleCollapsed = useCallback((): void => {
    setCollapsed((current) => !current);
  }, []);

  const value = useMemo(
    (): AdminNavigationContextValue => ({
      closeMobileNav,
      collapsed,
      isMobileNavOpen,
      openMobileNav,
      setMobileNavOpen,
      toggleCollapsed,
    }),
    [
      closeMobileNav,
      collapsed,
      isMobileNavOpen,
      openMobileNav,
      toggleCollapsed,
    ],
  );

  return (
    <AdminNavigationContext.Provider value={value}>
      <Sheet onOpenChange={setMobileNavOpen} open={isMobileNavOpen}>
        {children}
      </Sheet>
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation(): AdminNavigationContextValue {
  const value = useContext(AdminNavigationContext);

  if (value === null) {
    throw new Error(
      "useAdminNavigation must be used within AdminNavigationProvider.",
    );
  }

  return value;
}

export function useOptionalAdminNavigation(): AdminNavigationContextValue | null {
  return useContext(AdminNavigationContext);
}
