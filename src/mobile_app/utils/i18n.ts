import i18n from 'i18next';
import en from "./en.json";
import vi from "./vi.json";
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

export type TranslationKeys = keyof typeof en;

const getDeviceLanguage = (): string => {
  const locales = getLocales();
  return locales[0]?.languageTag || 'en';
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: "vi",
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const i18nLocale = i18n;