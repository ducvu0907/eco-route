import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import enTranslations from "./locales/en/translations.json";
import viTranslations from "./locales/vi/translations.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translations: enTranslations
    },
    vi: {
      translations: viTranslations
    },
  },
  ns: ["translations"],
  defaultNS: "translations",
  interpolation: {
    escapeValue: true
  }
});

i18n.languages = ["en", "vi"];

export default i18n;