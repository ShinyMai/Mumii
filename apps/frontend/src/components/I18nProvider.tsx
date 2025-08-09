"use client";

import { ReactNode, useEffect } from "react";
import "@/lib/i18n";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18n on client side
    import("@/lib/i18n");
  }, []);

  return <>{children}</>;
}
