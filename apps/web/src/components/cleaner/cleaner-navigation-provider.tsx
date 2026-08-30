"use client";

import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface CleanerNavigationContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const CleanerNavigationContext =
  createContext<CleanerNavigationContextValue | null>(null);

interface CleanerNavigationProviderProps {
  children: ReactNode;
}

export function CleanerNavigationProvider({
  children,
}: CleanerNavigationProviderProps): ReactElement {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback((): void => {
    setCollapsed((current) => !current);
  }, []);

  const value = useMemo(
    (): CleanerNavigationContextValue => ({
      collapsed,
      toggleCollapsed,
    }),
    [collapsed, toggleCollapsed],
  );

  return (
    <CleanerNavigationContext.Provider value={value}>
      {children}
    </CleanerNavigationContext.Provider>
  );
}

export function useCleanerNavigation(): CleanerNavigationContextValue {
  const value = useContext(CleanerNavigationContext);

  if (value === null) {
    throw new Error(
      "useCleanerNavigation must be used within CleanerNavigationProvider.",
    );
  }

  return value;
}
