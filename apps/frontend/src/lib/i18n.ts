import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`../locales/${language}/${namespace}.json`);
    })
  )
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "en",
    lng: undefined, // let detect the language on client side
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    preload: runsOnServerSide ? ["en", "vi"] : [],
    supportedLngs: ["en", "vi"],
    defaultNS: "common",
    fallbackNS: "common",
    ns: ["common", "navigation", "auth", "errors"],
    detection: {
      order: [
        "path",
        "htmlTag",
        "cookie",
        "localStorage",
        "subdomain",
        "querystring",
        "header",
      ],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18next;
