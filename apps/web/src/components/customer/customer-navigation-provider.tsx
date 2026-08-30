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

interface CustomerNavigationContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const CustomerNavigationContext =
  createContext<CustomerNavigationContextValue | null>(null);

interface CustomerNavigationProviderProps {
  children: ReactNode;
}

export function CustomerNavigationProvider({
  children,
}: CustomerNavigationProviderProps): ReactElement {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback((): void => {
    setCollapsed((current) => !current);
  }, []);

  const value = useMemo(
    (): CustomerNavigationContextValue => ({
      collapsed,
      toggleCollapsed,
    }),
    [collapsed, toggleCollapsed],
  );

  return (
    <CustomerNavigationContext.Provider value={value}>
      {children}
    </CustomerNavigationContext.Provider>
  );
}

export function useCustomerNavigation(): CustomerNavigationContextValue {
  const value = useContext(CustomerNavigationContext);

  if (value === null) {
    throw new Error(
      "useCustomerNavigation must be used within CustomerNavigationProvider.",
    );
  }

  return value;
}
