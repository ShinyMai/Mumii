"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function useI18n(namespace: string = "common") {
  const { t, i18n } = useTranslation(namespace);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsLoading(false);
    }
  }, [i18n.isInitialized]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return {
    t,
    i18n,
    isLoading,
    currentLanguage: i18n.language,
    changeLanguage,
    languages: Array.isArray(i18n.options.supportedLngs)
      ? i18n.options.supportedLngs.filter((lng) => lng !== "cimode")
      : [],
  };
}
